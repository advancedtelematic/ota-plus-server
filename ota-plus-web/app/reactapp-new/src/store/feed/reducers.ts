import {
  IFeedState,
  ActionTypes,
} from './types';
import { Actions } from './actions';

export const initialState: IFeedState = {
  data: [],
};

export const feedReducer = (state = initialState, action: Actions): IFeedState => {
  switch (action.type) {
    case ActionTypes.SET_FEED_DATA_DONE: {
      return {
        data: action.payload
      };
    }
    case ActionTypes.SET_FEED_DATA_FAILED: {
      return {
        data: []
      };
    }
    default:
      return state;
  }
};
