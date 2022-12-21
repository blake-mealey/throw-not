import { expect, test } from 'vitest';
import { createError } from '.';

export const { ApiError, isApiError } = createError('ApiError', {
  bad_request: (message: string) => ({ message, meta: { statusCode: 400 } }),
  not_found: (resourceType: string, resourceId: string) => ({
    message: `${resourceType} ${resourceId} not found`,
    meta: { statusCode: 404, resourceType, resourceId },
  }),
  custom: (statusCode: number, message: string) => ({
    message,
    meta: { statusCode },
  }),
});
export type ApiError = InstanceType<typeof ApiError>;

test('bad_request errors should be constructed properly and isApiError should return correctly', () => {
  const error = new ApiError('bad_request', 'missing required input');

  expect(error instanceof ApiError).toBe(true);
  expect(error instanceof Error).toBe(true);

  expect(isApiError(error)).toBe(true);
  expect(isApiError(error, 'bad_request')).toBe(true);
  expect(isApiError(error, 'not_found')).toBe(false);

  expect(error.code).toBe('bad_request');
  expect(error.message).toBe('missing required input');
  expect(error.meta).toEqual({
    statusCode: 400,
  });
});

test('not_found errors should be constructed properly and isApiError should return correctly', () => {
  const error = new ApiError('not_found', 'customer', 'cus_djh319eu2189');

  expect(error instanceof ApiError).toBe(true);
  expect(error instanceof Error).toBe(true);

  expect(isApiError(error)).toBe(true);
  expect(isApiError(error, 'not_found')).toBe(true);
  expect(isApiError(error, 'bad_request')).toBe(false);

  expect(error.code).toBe('not_found');
  expect(error.message).toBe('customer cus_djh319eu2189 not found');
  expect(error.meta).toEqual({
    statusCode: 404,
    resourceType: 'customer',
    resourceId: 'cus_djh319eu2189',
  });
});

test('not_found errors should be constructed properly and isApiError should return correctly', () => {
  const error = new ApiError('not_found', 'customer', 'cus_djh319eu2189');

  expect(error instanceof ApiError).toBe(true);
  expect(error instanceof Error).toBe(true);

  expect(isApiError(error)).toBe(true);
  expect(isApiError(error, 'not_found')).toBe(true);
  expect(isApiError(error, 'bad_request')).toBe(false);

  expect(error.code).toBe('not_found');
  expect(error.message).toBe('customer cus_djh319eu2189 not found');
  expect(error.meta).toEqual({
    statusCode: 404,
    resourceType: 'customer',
    resourceId: 'cus_djh319eu2189',
  });
});

test('isApiError should return correctly for non-errors', () => {
  expect(isApiError('not an error')).toBe(false);
  expect(isApiError(true)).toBe(false);
  expect(isApiError(new Error('generic error'))).toBe(false);
});
