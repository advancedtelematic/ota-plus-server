export interface Action<T extends string> {
  type: T;
}

export interface ActionWithPayload<T extends string, P> extends Action<T> {
  payload: P;
}

type FunctionType = (...args: any[]) => any;
type ActionCreatorsMapObject = {
  [actionCreator: string]: FunctionType
};

export type ActionsUnion<A extends ActionCreatorsMapObject> = ReturnType<A[keyof A]>;

export type Object = { [key: string]: any };

// interfaces explained in
// https://stackoverflow.com/questions/40510611/typescript-interface-require-one-of-two-properties-to-exist
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> =
  Pick<T, Exclude<keyof T, Keys>>
  & {
  [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
}[Keys];

export type RequireOnlyOne<T, Keys extends keyof T = keyof T> =
  Pick<T, Exclude<keyof T, Keys>>
  & {
  [K in Keys]-?:
  Required<Pick<T, K>>
  & Partial<Record<Exclude<Keys, K>, undefined>>
}[Keys];
