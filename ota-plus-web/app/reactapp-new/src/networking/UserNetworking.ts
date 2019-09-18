import axios from 'axios';
import { UserProfile } from '../store/user/types';
import AxiosConnector from './AxiosConnector';

export interface UserNetworkingInterface {
  getUserProfile(): Promise<UserProfile>;
}

export class UserNetworking implements UserNetworkingInterface {
  public async getUserProfile(): Promise<UserProfile> {
    // FIXME: until we do not have axios and networking configurated the url is hardcoded
    return await AxiosConnector.get('/user/profile');
  }
}

export const userNetworking: UserNetworkingInterface = new UserNetworking();
