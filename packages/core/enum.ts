import { expect, it } from 'vitest';
import { match } from './match';

export namespace t {
  export const empty = Symbol('empty');
  export const string = Symbol('empty');
  export const number = Symbol('empty');
  export const boolean = Symbol('empty');
  export const any = Symbol('any');
}

type EnumDefinitionSimpleValue =
  | typeof t.empty
  | typeof t.string
  | typeof t.number
  | typeof t.boolean
  | typeof t.any;

type EnumDefinitionValue =
  | EnumDefinitionSimpleValue
  | EnumDefinitionSimpleValue[]
  | Record<string, EnumDefinitionSimpleValue>;

type EnumDefinition = { [K: string]: EnumDefinitionValue };

type DeriveSimpleType<T extends EnumDefinitionSimpleValue> =
  T extends typeof t.empty
    ? undefined
    : T extends typeof t.string
    ? string
    : T extends typeof t.number
    ? number
    : T extends typeof t.boolean
    ? boolean
    : T extends typeof t.any
    ? any
    : never;

type DeriveType<T extends EnumDefinitionValue> =
  T extends EnumDefinitionSimpleValue
    ? DeriveSimpleType<T>
    : T extends EnumDefinitionSimpleValue[]
    ? Array<DeriveSimpleType<T[number]>>
    : T extends Record<string, EnumDefinitionSimpleValue>
    ? { [K in keyof T]: DeriveSimpleType<T[K]> }
    : never;

type EnumValue<
  TDef extends EnumDefinition,
  TKey extends keyof TDef = keyof TDef,
  TImplDef extends EnumImplDefinition<TDef> | undefined = undefined,
> = {
  [K in keyof TDef]: {
    _symbol: symbol;
    _name: K;
    _value: DeriveType<TDef[K]>;
  } & (TImplDef extends EnumImplDefinition<TDef>
    ? EnumImpl<TDef, TImplDef>
    : {});
}[TKey];

type EnumImplDefinition<TDef extends EnumDefinition> = {
  [K in string]: (enumValue: EnumValue<TDef>, ...args: any[]) => any;
};

type OmitFirstArg<F> = F extends (x: any, ...args: infer P) => infer R
  ? (...args: P) => R
  : never;
type EnumImpl<
  TDef extends EnumDefinition,
  TImplDef extends EnumImplDefinition<TDef>,
> = {
  [K in keyof TImplDef]: OmitFirstArg<TImplDef[K]>;
};

type Enum<
  TName extends string,
  TDef extends EnumDefinition,
  TImplDef extends EnumImplDefinition<TDef>,
> = {
  [K in keyof TDef]: TDef[K] extends typeof t.empty
    ? () => EnumValue<TDef, K, TImplDef>
    : (p: DeriveType<TDef[K]>) => EnumValue<TDef, K, TImplDef>;
} & {
  _symbol: symbol;
  _name: TName;
};

export function createEnum<
  TName extends string,
  TDef extends EnumDefinition,
  TImplDef extends EnumImplDefinition<TDef>,
>(
  name: TName,
  definition: TDef,
  implementation: TImplDef = {} as any,
): Enum<TName, TDef, TImplDef> {
  const symbol = Symbol(`Enum(${name})`);
  const enumObject = {
    _symbol: symbol,
    _name: name,
  };

  const defEntries = Object.entries(definition);
  for (const [key, value] of defEntries) {
    const createValue = {
      [key]: (p: DeriveType<typeof value>) => {
        const value = {
          _symbol: symbol,
          _name: key,
          _value: p,
        };

        const mappedImplementation = Object.fromEntries(
          Object.entries(implementation).map(([name, fn]) => [
            name,
            { [name]: (...args: any[]) => fn(value as any, ...args) }[name],
          ]),
        );

        return {
          _symbol: symbol,
          _name: key,
          _value: p,
          ...mappedImplementation,
        };
      },
    }[key];
    enumObject[key] = createValue;
  }

  return enumObject as any;
}

// TODO: Could we make generic enums?
function createOptionEnum<TValue>() {
  return createEnum(
    'Option',
    { Some: t.string, None: t.empty },
    {
      isSome(self) {
        return self._name === 'Some';
      },
      isNone(self) {
        return self._name === 'None';
      },
    },
  );
}

if (import.meta.vitest) {
  it('should create an enum', () => {
    const Option = createEnum(
      'Option',
      { Some: t.any, None: t.empty },
      {
        isSome(self) {
          return self._name === 'Some';
        },
        isNone(self) {
          return self._name === 'None';
        },
      },
    );
    type OptionType = typeof Option;

    const { None, Some } = Option;

    console.log(Option);
    console.log(None());
    console.log(Some(['what']));

    expect(None().isNone()).toBe(true);
    expect(None().isSome()).toBe(false);

    expect(Some('test').isNone()).toBe(false);
    expect(Some('test').isSome()).toBe(true);

    expect(Option._symbol).toBe(None()._symbol);
    expect(Option._symbol).toBe(Some('test')._symbol);
  });
}
