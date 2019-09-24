import AxiosConnector from './AxiosConnector';
import ApiEndpoints from '../constants/endpoints';
import { IUserProfile } from '../store/user/types';
import buildUrl from '../helpers/UrlBuilder';

export interface IUserService {
  getUserProfile(): Promise<IUserProfile>;
}

export class UserService implements IUserService {
  async getUserProfile(): Promise<IUserProfile> {
    const url = buildUrl(ApiEndpoints.MISC.USER_PROFILE);
    return AxiosConnector.get(url);
  }
}

export const userService: IUserService = new UserService();
