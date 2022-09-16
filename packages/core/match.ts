import { Option } from './option';
import { Result } from './result';
import { Value } from './value';

export const Default = Symbol('NoError(Default)');
export const Other = Symbol('NoError(Other)');

export function matchResult<
  TMappedValue,
  TValue extends Value,
  TError extends Value,
>(
  result: Result<TValue, TError>,
  onOk: (value: TValue) => TMappedValue,
  onErr: (error: TError) => TMappedValue,
) {
  if (result.isOk()) {
    return onOk(result.unwrap());
  }
  return onErr(result.unwrapErr());
}

export function matchOption<TMappedValue, TValue extends Value>(
  option: Option<TValue>,
  onSome: (value: TValue) => TMappedValue,
  onNone: () => TMappedValue,
) {
  if (option.isSome()) {
    return onSome(option.unwrap());
  }
  return onNone();
}

export function match<TMappedValue, TValue extends string | number | symbol>(
  value: TValue,
  matchers: { [K in TValue]: () => TMappedValue } & {
    [Default]: () => TMappedValue;
  } & {
    [Other]?: (value: TValue) => TMappedValue;
  },
) {
  const matcher = matchers[value];
  if (matcher) {
    return matcher();
  }
  const other = matchers[Other];
  if (other) {
    return other(value);
  }
  return matchers[Default]();
}
