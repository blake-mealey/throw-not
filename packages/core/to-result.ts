import { Panic } from './panic';
import { Err, Ok, Result } from './result';
import { Value } from './value';

export function toResult<
  TOp extends Promise<Value> | (() => Promise<Value>) | (() => Value),
  TValue extends TOp extends Promise<infer V1>
    ? V1
    : TOp extends () => Promise<infer V2>
    ? V2
    : TOp extends () => infer V3
    ? V3
    : never,
  TError extends Value,
>(
  op: TOp,
  mapErr?: (error: any) => TError,
): TOp extends Promise<TValue>
  ? Promise<Result<TValue, TError>>
  : TOp extends () => Promise<TValue>
  ? Promise<Result<TValue, TError>>
  : Result<TValue, TError> {
  try {
    if (typeof op === 'function') {
      const value = op();
      if (value instanceof Promise) {
        return toResult(value, mapErr) as any;
      }
      return Ok<TValue, TError>(value as TValue) as any;
    } else {
      return op
        .then((value) => Ok(value))
        .catch((error) => {
          if (error instanceof Panic) {
            return Promise.reject(error);
          }
          return mapErr !== undefined ? Err(mapErr(error)) : Err(error);
        }) as any;
    }
  } catch (error) {
    if (error instanceof Panic) {
      throw error;
    }
    return (mapErr !== undefined ? Err(mapErr(error)) : Err(error)) as any;
  }
}

export function mapError(error: any) {
  if (error instanceof Error) {
    return error;
  }
  try {
    return new Error(error.toString());
  } catch {
    return new Error('Unknown error');
  }
}
