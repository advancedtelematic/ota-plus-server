export interface ICampaignsState {
  total: number;
  totalWithError: number;
}

export enum ActionType {
  SET_ALL_CAMPAIGNS_REQUEST = 'SET_ALL_CAMPAIGNS_REQUEST',
  SET_ALL_CAMPAIGNS_DONE = 'SET_ALL_CAMPAIGNS_DONE',
  SET_ALL_CAMPAIGNS_FAILED = 'SET_ALL_CAMPAIGNS_FAILED'
}
