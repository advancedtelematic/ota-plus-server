import {
  ISoftwareState,
  ActionType,
} from './types';
import { Actions } from './actions';

export const initialState: ISoftwareState = {
  versionsTotal: 0
};

export const softwareReducer = (state = initialState, action: Actions): ISoftwareState => {
  switch (action.type) {
    case ActionType.SET_ALL_SOFTWARE_DONE: {
      return {
        ...action.payload
      };
    }
    default:
      return state;
  }
};
