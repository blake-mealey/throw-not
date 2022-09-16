export class Panic extends Error {
  readonly isPanic = true;
}

export function panic(message?: string): never {
  throw new Panic(`[PANIC]: ${message ?? 'unknown'}`);
}

export function unreachable() {
  return panic('unreachable code');
}
