export interface ISoftwareState {
  versionsTotal: number;
}

export enum ActionType {
  SET_ALL_SOFTWARE_REQUEST = 'SET_ALL_SOFTWARE_REQUEST',
  SET_ALL_SOFTWARE_DONE = 'SET_ALL_SOFTWARE_DONE',
  SET_ALL_SOFTWARE_FAILED = 'SET_ALL_SOFTWARE_FAILED'
}
