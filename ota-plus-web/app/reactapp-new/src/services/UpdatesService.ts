import AxiosConnector from './AxiosConnector';
import ApiEndpoints from '../constants/endpoints';
import { IUpdatesState } from '../store/updates/types';
import buildUrl from '../helpers/UrlBuilder';

export interface IUpdatesService {
  getAllUpdates(): Promise<IUpdatesState>;
}

export class UpdatesService implements IUpdatesService {
  async getAllUpdates(): Promise<IUpdatesState> {
    const url = buildUrl(ApiEndpoints.UPDATES.ALL);
    return AxiosConnector.get(url);
  }
}

export const devicesService: IUpdatesService = new UpdatesService();
