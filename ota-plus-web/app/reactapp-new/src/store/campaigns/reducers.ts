import {
  ICampaignsState,
  ActionType,
} from './types';
import { Actions } from './actions';

export const initialState: ICampaignsState = {
  total: 0,
  totalWithError: 0
};

export const campaignsReducer = (state = initialState, action: Actions): ICampaignsState => {
  switch (action.type) {
    case ActionType.SET_ALL_CAMPAIGNS_DONE: {
      return {
        ...action.payload
      };
    }
    default:
      return state;
  }
};
