import { None, Some } from './option';
import { Value } from './value';

export function toOption<T extends Value>(value: T | undefined | null) {
  if (value === undefined || value === null) {
    return None<T>();
  }
  return Some(value);
}
