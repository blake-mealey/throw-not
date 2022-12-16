import { panic, unreachable } from './panic';
import { Value } from './value';

// export interface OkResult<TValue extends Value> {
//   ok(): true;
//   err(): false;
//   get(): TValue;
// }
// export interface ErrResult<TError extends Value> {
//   ok(): false;
//   err(): true;
//   getErr(): TError;
// }

// export class Result<TValue extends Value, TError extends Value> {
//   constructor(
//     protected _value: TValue | undefined,
//     protected _error: TError | undefined,
//   ) {
//     if (_value === undefined && _error === undefined) {
//       return panic('Result must be either ok or err');
//     }
//     if (_value !== undefined && _error !== undefined) {
//       return panic('Result cannot be both ok and err');
//     }
//   }

//   ok(): this is OkResult<TValue> {
//     return this._value !== undefined;
//   }

//   err(): this is ErrResult<TError> {
//     return this._error !== undefined;
//   }

//   get() {
//     if (this.ok()) {
//       return this._value;
//     }
//     return panic('Result is not ok');
//   }

//   getErr() {
//     if (this.err()) {
//       return this._error;
//     }
//     return panic('Result is not err');
//   }
// }

function Result<TValue extends Value, TError extends Value>(
  value: TValue | undefined,
  error: TError | undefined,
) {
  if (value === undefined && error === undefined) {
    return panic('Result must be either ok or err');
  }
  if (value !== undefined && error !== undefined) {
    return panic('Result cannot be both ok and err');
  }

  if (value !== undefined) {
    value;
    return {
      isOk(): true {
        return true;
      },
      isErr(): false {
        return false;
      },
    };
  }

  if (error !== undefined) {
    error;
    return {
      isOk(): false {
        return false;
      },
      isErr(): true {
        return true;
      },
    };
  }

  return unreachable();
}

export function Ok<TValue extends Value, TError extends Value>(value: TValue) {
  // return new Result<TValue, TError>(value, undefined);
  return Result<TValue, TError>(value, undefined);
}

export function Err<TValue extends Value, TError extends Value>(error: TError) {
  // return new Result<TValue, TError>(undefined, error);
  return Result<TValue, TError>(undefined, error);
}

function t() {
  const r = Ok(1);
  if (r.isOk()) {
  }
}
