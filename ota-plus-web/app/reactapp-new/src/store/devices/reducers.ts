import {
  IDevicesState,
  ActionType,
} from './types';
import { Actions } from './actions';

export const initialState: IDevicesState = {
  devices: [],
  deviceGroupsTotal: 0,
  limit: 0,
  offset: 0,
  total: 0,
  totalUnconnected: 0,
  totalUngrouped: 0
};

export const devicesReducer = (state = initialState, action: Actions): IDevicesState => {
  switch (action.type) {
    case ActionType.SET_ALL_DEVICES_DONE: {
      return {
        ...state, ...action.payload
      };
    }
    default:
      return state;
  }
};
