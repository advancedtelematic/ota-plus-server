export interface IUpdatesState {
  total: number;
}

export enum ActionType {
  SET_ALL_UPDATES_REQUEST = 'SET_ALL_UPDATES_REQUEST',
  SET_ALL_UPDATES_DONE = 'SET_ALL_UPDATES_DONE',
  SET_ALL_UPDATES_FAILED = 'SET_ALL_UPDATES_FAILED'
}
