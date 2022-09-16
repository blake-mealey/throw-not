import { None, Option, Some } from './option';
import { panic } from './panic';
import { Err, Ok, Result } from './result';
import { Value, Void } from './value';
import type { Simplify } from 'type-fest';

export const Default = Symbol('NoError(Default)');
export const DefaultSome = Symbol('NoError(DefaultSome)');
export const DefaultNone = Symbol('NoError(DefaultNone)');
export const DefaultOk = Symbol('NoError(DefaultOk)');
export const DefaultErr = Symbol('NoError(DefaultErr)');

type InputValue =
  | Option
  | typeof DefaultSome
  | typeof DefaultNone
  | Result
  | typeof DefaultOk
  | typeof DefaultErr
  | typeof Default
  | {}
  | typeof Void;

type Matcher1<
  TIn extends InputValue,
  TOut,
  TValue = TIn extends Result<infer UValue>
    ? UValue
    : TIn extends Option<infer UValue>
    ? UValue
    : never,
  TError = TIn extends Result<unknown, infer UError> ? UError : never,
> = TIn extends Option<TValue>
  ?
      | [Option<TValue>, () => TOut]
      | [typeof DefaultSome, (value: TValue) => TOut]
      | [typeof DefaultNone, () => TOut]
      | [typeof Default, (option: Option<TValue>) => TOut]
  : TIn extends Result<TValue, TError>
  ?
      | [Result<TValue, TError>, () => TOut]
      | [typeof DefaultOk, (value: TValue) => TOut]
      | [typeof DefaultErr, (error: TError) => TOut]
      | [typeof Default, (result: Result<TValue, TError>) => TOut]
  : [typeof Default, (value: TIn) => TOut] | [TIn, () => TOut];

type Matcher2<
  TMatch extends InputValue,
  TIn extends InputValue,
  TOut,
  TValue = TIn extends Result<infer UValue>
    ? UValue
    : TIn extends Option<infer UValue>
    ? UValue
    : never,
  TError = TIn extends Result<unknown, infer UError> ? UError : never,
> = TIn extends Option<TValue>
  ? TMatch extends Option
    ? [Option<TValue>, () => TOut]
    : TMatch extends typeof DefaultSome
    ? [typeof DefaultSome, (value: TValue) => TOut]
    : TMatch extends typeof DefaultNone
    ? [typeof DefaultNone, () => TOut]
    : TMatch extends typeof Default
    ? [typeof Default, (option: TIn) => TOut]
    : never
  : TIn extends Result<TValue, TError>
  ? TMatch extends Result
    ? [Result<TValue, TError>, () => TOut]
    : TMatch extends typeof DefaultOk
    ? [typeof DefaultOk, (value: TValue) => TOut]
    : TMatch extends typeof DefaultErr
    ? [typeof DefaultErr, (error: TError) => TOut]
    : TMatch extends typeof Default
    ? [typeof Default, (result: TIn) => TOut]
    : never
  : TMatch extends typeof Default
  ? [typeof Default, (value: TIn) => TOut]
  : [TIn, () => TOut];

export function match<
  // TMatch extends InputValue,
  TIn extends InputValue,
  TOut,
  TValue = TIn extends Result<infer UValue>
    ? UValue
    : TIn extends Option<infer UValue>
    ? UValue
    : never,
  TError = TIn extends Result<unknown, infer UError> ? UError : never,
>(input: TIn, matchers: Matcher1<TIn, TOut, TValue, TError>[]) {
  const map = new Map(matchers as [InputValue, () => TOut][]);
  let matcher = map.get(input);
  if (matcher) {
    return matcher();
  }

  if (input instanceof Option) {
    if (input.isSome()) {
      const entries = map.entries();
      for (const [key, value] of entries) {
        if (key instanceof Option && key.contains(input.unwrap())) {
          return value();
        }
      }
      matcher = map.get(DefaultSome);
      if (matcher) {
        return (matcher as (a: TValue) => TOut)(input.unwrap() as TValue);
      }
    } else {
      matcher = map.get(DefaultNone);
      if (matcher) {
        return matcher();
      }
    }
  } else if (input instanceof Result) {
    if (input.isOk()) {
      const entries = map.entries();
      for (const [key, value] of entries) {
        if (key instanceof Result && key.contains(input.unwrap())) {
          return value();
        }
      }
      matcher = map.get(DefaultOk);
      if (matcher) {
        return (matcher as (a: TValue) => TOut)(input.unwrap() as TValue);
      }
    } else {
      const entries = map.entries();
      for (const [key, value] of entries) {
        if (key instanceof Result && key.containsErr(input.unwrapErr())) {
          return value();
        }
      }
      matcher = map.get(DefaultErr);
      if (matcher) {
        return (matcher as (a: TError) => TOut)(input.unwrapErr() as TError);
      }
    }
  }

  matcher = map.get(Default);
  if (matcher) {
    return (matcher as (a: TIn) => TOut)(input);
  }

  return panic(`Unable to find a matcher for ${input.toString()}`);
}

function getV(): string | number {
  return 1;
}
function t() {
  const r = Ok<boolean, number>(true);
  const m1 = match(r, [
    // [r, () => 'self'],
    // [Ok(true), () => 'hi'],
    // [Ok(false), () => 'bye'],
    [Err(1), () => 'err'],
    [Default, (x) => 'hi'],
  ]);

  const o = Some(1);
  const m2 = match(o, [
    [o, () => 'self'],
    [Some(2), () => 'hi'],
    [Default, (x) => 'hi'],
    [DefaultNone, () => 'hi'],
  ]);
}

type T = Simplify<typeof match<Result<boolean, number>, string>>;
type T2 = Simplify<typeof match<Option<number>, string>>;
