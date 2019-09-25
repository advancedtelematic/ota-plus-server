import {
  FeedState,
  actionTypes,
} from './types';
import { Actions } from './actions';

export const initialState: FeedState = {
  data: [],
};

export const feedReducer = (state = initialState, action: Actions): FeedState => {
  switch (action.type) {
    case actionTypes.SET_FEED_DATA_DONE: {
      return {
        data: action.payload
      };
    }
    case actionTypes.SET_FEED_DATA_FAILED: {
      return {
        data: []
      };
    }
    default:
      return state;
  }
};
