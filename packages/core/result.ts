import { None, Some } from './option';
import { panic, unreachable } from './panic';
import { Value } from './value';

export class Result<
  TValue extends Value = unknown,
  TError extends Value = unknown,
> {
  constructor(
    private _value: TValue | undefined,
    private _error: TError | undefined,
  ) {
    if (_value !== undefined && _error !== undefined) {
      return panic('Result cannot be both Ok and Err');
    }

    if (_value === undefined && _error === undefined) {
      return panic('Result must be one of Ok or Err');
    }
  }

  isOk() {
    return this._value !== undefined;
  }

  isOkAnd(predicate: (value: TValue) => boolean) {
    return this._value !== undefined && predicate(this._value);
  }

  isErr() {
    return this._error !== undefined;
  }

  isErrAnd(predicate: (error: TError) => boolean) {
    if (this._error !== undefined) {
      return predicate(this._error);
    }
  }

  ok() {
    if (this._value !== undefined) {
      return Some(this._value);
    }
    return None<TValue>();
  }

  err() {
    if (this._error !== undefined) {
      return Some(this._error);
    }
    return None<TError>();
  }

  map<TMappedValue extends Value>(map: (value: TValue) => TMappedValue) {
    if (this._value !== undefined) {
      return Ok<TMappedValue, TError>(map(this._value));
    } else if (this._error !== undefined) {
      return Err<TMappedValue, TError>(this._error);
    }
    return unreachable();
  }

  mapOr<TMappedValue extends Value>(
    defaultValue: TMappedValue,
    map: (value: TValue) => TMappedValue,
  ) {
    if (this._value !== undefined) {
      return map(this._value);
    }
    return defaultValue;
  }

  mapOrElse<TMappedValue extends Value>(
    getDefaultValue: (error: TError) => TMappedValue,
    map: (value: TValue) => TMappedValue,
  ) {
    if (this._value !== undefined) {
      return map(this._value);
    } else if (this._error !== undefined) {
      return getDefaultValue(this._error);
    }
    return unreachable();
  }

  mapErr<TMappedError extends Value>(map: (error: TError) => TMappedError) {
    if (this._error !== undefined) {
      return Err<TValue, TMappedError>(map(this._error));
    } else if (this._value !== undefined) {
      return Ok<TValue, TMappedError>(this._value);
    }
    return unreachable();
  }

  expect(message: string) {
    if (this._value !== undefined) {
      return this._value;
    }
    return panic(message);
  }

  expectErr(message: string) {
    if (this._error !== undefined) {
      return this._error;
    }
    return panic(message);
  }

  unwrap() {
    if (this._value !== undefined) {
      return this._value;
    } else if (this._error !== undefined) {
      panic(
        (this._error as {}).toString
          ? (this._error as {}).toString()
          : undefined,
      );
    }
    return unreachable();
  }

  unwrapErr() {
    if (this._error !== undefined) {
      return this._error;
    } else if (this._value !== undefined) {
      panic(
        (this._value as {}).toString
          ? (this._value as {}).toString()
          : undefined,
      );
    }
    return unreachable();
  }

  and<UValue extends Value>(result: Result<UValue, TError>) {
    if (this._value !== undefined) {
      return result;
    } else if (this._error !== undefined) {
      return Err<UValue, TError>(this._error);
    }
    return unreachable();
  }

  andThen<UValue extends Value>(op: (value: TValue) => Result<UValue, TError>) {
    if (this._value !== undefined) {
      return op(this._value);
    } else if (this._error !== undefined) {
      return Err<UValue, TError>(this._error);
    }
    return unreachable();
  }

  or<UError extends Value>(result: Result<TValue, UError>) {
    if (this._error !== undefined) {
      return result;
    } else if (this._value !== undefined) {
      return Ok<TValue, UError>(this._value);
    }
    return unreachable();
  }

  orElse<UError extends Value>(op: (error: TError) => Result<TValue, UError>) {
    if (this._error !== undefined) {
      return op(this._error);
    } else if (this._value !== undefined) {
      return Ok<TValue, UError>(this._value);
    }
    return unreachable();
  }

  unwrapOr(defaultValue: TValue) {
    if (this._value !== undefined) {
      return this._value;
    }
    return defaultValue;
  }

  unwrapOrElse(getDefaultValue: (error: TError) => TValue) {
    if (this._value !== undefined) {
      return this._value;
    } else if (this._error !== undefined) {
      return getDefaultValue(this._error);
    }
    return unreachable();
  }

  contains(value: TValue) {
    return this._value === value;
  }

  containsErr(error: TError) {
    return this._error === error;
  }
}

export function Ok<TValue extends Value, TError extends Value>(value: TValue) {
  return new Result<TValue, TError>(value, undefined);
}

export function Err<TValue extends Value, TError extends Value>(error: TError) {
  return new Result<TValue, TError>(undefined, error);
}
