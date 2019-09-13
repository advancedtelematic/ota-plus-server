import AxiosConnector from './AxiosConnector';
import ApiEndpoints from '../constants/endpoints';
import { ISoftwareState } from '../store/software/types';
import buildUrl from '../helpers/UrlBuilder';

export interface ISoftwareService {
  getAllSoftware(): Promise<ISoftwareState>;
}

export class SoftwareService implements ISoftwareService {
  async getAllSoftware(): Promise<ISoftwareState> {
    const url = buildUrl(ApiEndpoints.SOFTWARE.ALL);
    return AxiosConnector.get(url);
  }
}

export const devicesService: ISoftwareService = new SoftwareService();
