import AxiosConnector from './AxiosConnector';
import ApiEndpoints from '../constants/endpoints';
import { IDevicesState } from '../store/devices/types';
import buildUrl from '../helpers/UrlBuilder';

export interface IDevicesService {
  getAllDevices(): Promise<IDevicesState>;
  getAllDeviceGroups(): Promise<IDevicesState>;
  getAllUnconnectedDevices(): Promise<IDevicesState>;
  getAllUngroupedDevices(): Promise<IDevicesState>;
}

export class DevicesService implements IDevicesService {
  async getAllDevices(): Promise<IDevicesState> {
    const url = buildUrl(ApiEndpoints.DEVICES.ALL);
    return AxiosConnector.get(url);
  }

  async getAllDeviceGroups(): Promise<IDevicesState> {
    const url = buildUrl(ApiEndpoints.DEVICE_GROUPS.ALL);
    return AxiosConnector.get(url);
  }

  async getAllUnconnectedDevices(): Promise<IDevicesState> {
    const unconnectedQuery = { activated: 'false' };
    const url = buildUrl(ApiEndpoints.DEVICES.ALL, unconnectedQuery);
    return AxiosConnector.get(url);
  }

  async getAllUngroupedDevices(): Promise<IDevicesState> {
    const ungroupedQuery = { grouped: 'false' };
    const url = buildUrl(ApiEndpoints.DEVICES.ALL, ungroupedQuery);
    return AxiosConnector.get(url);
  }
}

export const devicesService: IDevicesService = new DevicesService();
