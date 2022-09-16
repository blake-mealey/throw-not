export const Void = Symbol('NoError(Void)');

export type Value = {} | typeof Void | unknown;
