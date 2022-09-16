import { panic } from './panic';
import { Err, Ok } from './result';
import { Value } from './value';

export class Option<TValue extends Value = unknown> {
  constructor(private _value: TValue | undefined) {}

  isSome() {
    return this._value !== undefined;
  }

  isSomeAnd(predicate: (value: TValue) => boolean) {
    return this._value !== undefined && predicate(this._value);
  }

  isNone() {
    return this._value === undefined;
  }

  expect(message: string) {
    if (this._value !== undefined) {
      return this._value;
    }
    return panic(message);
  }

  unwrap() {
    if (this._value !== undefined) {
      return this._value;
    }
    return panic('Cannot unwrap None');
  }

  unwrapOr(defaultValue: TValue) {
    if (this._value !== undefined) {
      return this._value;
    }
    return defaultValue;
  }

  unwrapOrElse(getDefaultValue: () => TValue) {
    if (this._value !== undefined) {
      return this._value;
    }
    return getDefaultValue();
  }

  map<TMappedValue extends Value>(map: (value: TValue) => TMappedValue) {
    if (this._value !== undefined) {
      return Some(map(this._value));
    }
    return None<TMappedValue>();
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
    getDefaultValue: () => TMappedValue,
    map: (value: TValue) => TMappedValue,
  ) {
    if (this._value !== undefined) {
      return map(this._value);
    }
    return getDefaultValue();
  }

  okOr<TError extends Value>(error: TError) {
    if (this._value !== undefined) {
      return Ok<TValue, TError>(this._value);
    }
    return Err<TValue, TError>(error);
  }

  okOrElse<TError extends Value>(getError: () => TError) {
    if (this._value !== undefined) {
      return Ok<TValue, TError>(this._value);
    }
    return Err<TValue, TError>(getError());
  }

  and<UValue extends Value>(option: Option<UValue>) {
    if (this._value !== undefined) {
      return option;
    }
    return None<UValue>();
  }

  andThen<UValue extends Value>(op: (value: TValue) => Option<UValue>) {
    if (this._value !== undefined) {
      return op(this._value);
    }
    return None<UValue>();
  }

  filter(predicate: (value: TValue) => boolean) {
    if (this._value !== undefined && predicate(this._value)) {
      return this;
    }
    return None<TValue>();
  }

  or(option: Option<TValue>) {
    if (this._value !== undefined) {
      return this;
    }
    return option;
  }

  orElse(getOption: () => Option<TValue>) {
    if (this._value !== undefined) {
      return this;
    }
    return getOption();
  }

  xor(optionB: Option<TValue>) {
    const isSome = this._value !== undefined;
    const bIsSome = optionB.isSome();
    if (isSome && !bIsSome) {
      return this;
    } else if (!isSome && bIsSome) {
      return optionB;
    }
    return None<TValue>();
  }

  contains(value: TValue) {
    return this._value === value;
  }

  zip<UValue extends Value>(optionB: Option<UValue>): Option<[TValue, UValue]> {
    if (this._value !== undefined && optionB.isSome()) {
      return Some([this._value, optionB.unwrap()]);
    }
    return None<[TValue, UValue]>();
  }

  zipWith<UValue extends Value, RValue extends Value>(
    optionB: Option<UValue>,
    zip: (valueA: TValue, valueB: UValue) => RValue,
  ) {
    if (this._value !== undefined && optionB.isSome()) {
      return Some(zip(this._value, optionB.unwrap()));
    }
    return None<RValue>();
  }
}

export function Some<TValue extends Value>(value: TValue) {
  return new Option<TValue>(value);
}

export function None<TValue extends Value>() {
  return new Option<TValue>(undefined);
}
