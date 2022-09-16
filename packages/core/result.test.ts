import { expect, test } from 'vitest';
import { Ok, Err, Void } from './index';

test('ok should be ok', () => {
  const r = Ok(Void);
  expect(r.isOk()).toBe(true);
  expect(r.isErr()).toBe(false);
});

test('err should be err', () => {
  const r = Err(Void);
  expect(r.isOk()).toBe(false);
  expect(r.isErr()).toBe(true);
});
