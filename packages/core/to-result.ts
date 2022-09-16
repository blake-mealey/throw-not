import { Panic } from './panic';
import { Err, Ok, Result } from './result';

export function toResult<TValue, TError = unknown>(
  op: () => TValue,
  mapErr?: (error: any) => TError,
): Result<TValue, TError> {
  try {
    return Ok(op());
  } catch (error) {
    // Panics should never be caught
    if (error instanceof Panic) {
      throw error;
    }

    if (mapErr) {
      return Err(mapErr(error));
    }
    return Err(error);
  }
}

export async function toResultAsync<TValue, TError = unknown>(
  op: () => Promise<TValue>,
  mapErr?: (error: any) => TError,
): Promise<Result<TValue, TError>> {
  try {
    return Ok(await op());
  } catch (error) {
    // Panics should never be caught
    if (error instanceof Panic) {
      throw error;
    }

    if (mapErr) {
      return Err(mapErr(error));
    }
    return Err(error);
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
