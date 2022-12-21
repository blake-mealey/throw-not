export type Result<T, E extends Error = Error> = T | E;

export function isError(maybeError: unknown): maybeError is Error {
  return maybeError instanceof Error;
}
