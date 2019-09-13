export interface IDevice {
  activatedAt: string;
  createdAt: string;
  deviceId: string;
  deviceName: string;
  deviceStatus: string;
  deviceType: string;
  lastSeen: string;
  namespace: string;
  uuid: string;
}

export interface IDevicesState {
  devices: IDevice[];
  deviceGroupsTotal: number;
  limit: number;
  offset: number;
  total: number;
  totalUnconnected?: number;
  totalUngrouped?: number;
}

export enum ActionType {
  SET_ALL_DEVICES_REQUEST = 'SET_ALL_DEVICES_REQUEST',
  SET_ALL_DEVICES_DONE = 'SET_ALL_DEVICES_DONE',
  SET_ALL_DEVICES_FAILED = 'SET_ALL_DEVICES_FAILED'
}
