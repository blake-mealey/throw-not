# `throw-not`

Utilites to help writing code using the pattern of returning errors instead of throwing them.

Part of the `throw-not` family of packages:

- [`throw-not`](https://npmjs.com/package/throw-not)
- [`that-error`](https://npmjs.com/package/that-error)

## Install

```sh
npm install throw-not
pnpm install throw-not
yarn install throw-not
```

## Example

```ts
import { Result, isError } from 'throw-not';

function somethingThatCouldThrow(): Result<string> {
  if (...) {
    return new Error('something went wrong');
  }
  return 'something';
}

function something(): string {
  const result = somethingThatCouldThrow();
  if (isError(result)) {
    return 'failed';
  }
  return result;
}
```

```ts
// suppose ApiError is an error class created by `that-error`
import { ApiError, isApiError } from './api-errors';

function somethingThatCouldThrow(): Result<string, InstanceType<typeof ApiError>> {
  if (...) {
    return new ApiError('not_found', 'customer', 'cus_1234567890');
  }
  return 'something';
}

function get(req, res): string {
  const result = somethingThatCouldThrow();
  if (isApiError(result)) {
    return res.send(result.meta.statusCode, {
      message: result.message,
      meta: result.meta
    });
  }
  return res.send(200, result);
}
```
