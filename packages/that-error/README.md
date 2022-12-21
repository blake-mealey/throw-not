# `that-error`

Create typed error classes. Inspired by the [`thiserror`](https://crates.io/crates/thiserror) Rust crate.

## Install

```sh
npm install that-error
pnpm install that-error
yarn install that-error
```

## Example

```ts
// api-errors.ts
export const { ApiError, isApiError } = createError('ApiError', {
  bad_request: (message: string) => ({
    message,
    meta: { statusCode: 400 },
  }),
  not_found: (resourceType: string, resourceId: string) => ({
    message: `${resourceType} ${resourceId} not found`,
    meta: { statusCode: 404, resourceType, resourceId },
  }),
  custom: (statusCode: number, message: string) => ({
    message,
    meta: { statusCode },
  }),
});

// if needed you can define an instance type
export type ApiError = InstanceType<typeof ApiError>;
```

```ts
// index.ts
import { ApiError, isApiError } from './api-errors';

function getCustomer(id: string) {
  const customer = ...;
  if (!customer) {
    // constructors are type-checked.
    // `resourceType` and `resourceId` are required for `not_found` errors
    throw new ApiError('not_found', 'customer', id);
  }
  return customer;
}

try {
  const customer = getCustomer('cus_1234567890');
} catch (error) {
  // instanceof will also pass for `error` for both `ApiError` and `Error`
  // passing the code here is optional if you just want to check if it is an `ApiError`
  if (isApiError(error, 'not_found')) {
    // `error` will have full types. In this example:
    // error.code = 'not_found'
    // error.meta = { statusCode: 404, resourceType: 'customer', resourceId: 'cus_1234567890' }
    // error.message = 'customer cus_1234567890 not found'
  }
}
```
