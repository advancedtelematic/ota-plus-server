import { createAction } from '../../utils/makeAction';
import { ActionType, IDevicesState } from './types';
import { ActionsUnion } from '../../utils/types';

export const Actions = {
  setAllDevicesRequest: () => createAction(ActionType.SET_ALL_DEVICES_REQUEST),
  setAllDevicesDone: (devices: IDevicesState) => createAction(ActionType.SET_ALL_DEVICES_DONE, devices),
  setAllDevicesFailed: () => createAction(ActionType.SET_ALL_DEVICES_FAILED)
} as const;

export type Actions = ActionsUnion<typeof Actions>;
