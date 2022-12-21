import { expect, test } from 'vitest';
import { isError } from '.';

class CustomError extends Error {}

test('test', () => {
  expect(isError(new Error())).toBe(true);
  expect(isError(new CustomError())).toBe(true);

  expect(isError('something')).toBe(false);
  expect(isError(false)).toBe(false);
});
