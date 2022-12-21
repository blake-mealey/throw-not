type CodesDef = {
  [code: string]: (...params: any[]) => { message: string; meta: any };
};

export function createError<TName extends string, TCodesDef extends CodesDef>(
  name: TName,
  codes: TCodesDef,
) {
  type AllCodes = keyof TCodesDef;

  const ErrorClass = class<TCode extends AllCodes = AllCodes> extends Error {
    code: TCode;
    meta: ReturnType<TCodesDef[TCode]>['meta'];

    constructor(code: TCode, ...params: Parameters<TCodesDef[TCode]>) {
      const create = codes[code];
      const { message, meta } = create(...params);

      super(message);

      this.code = code;
      this.meta = meta;
    }
  };

  const isError = <TCode extends AllCodes>(
    maybeError: unknown,
    code?: TCode,
  ): maybeError is InstanceType<typeof ErrorClass<TCode>> => {
    if (!(maybeError instanceof ErrorClass)) {
      return false;
    }
    return code ? maybeError.code === code : true;
  };

  type Output = {
    [K in TName]: typeof ErrorClass;
  } & {
    [K in `is${TName}`]: typeof isError;
  };
  return {
    [name]: ErrorClass,
    [`is${name}`]: isError,
  } as Output;
}
