import {
  IUpdatesState,
  ActionType,
} from './types';
import { Actions } from './actions';

export const initialState: IUpdatesState = {
  total: 0
};

export const updatesReducer = (state = initialState, action: Actions): IUpdatesState => {
  switch (action.type) {
    case ActionType.SET_ALL_UPDATES_DONE: {
      return {
        ...state, ...action.payload
      };
    }
    default:
      return state;
  }
};
