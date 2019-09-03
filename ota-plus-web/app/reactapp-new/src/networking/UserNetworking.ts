import axios from 'axios';
import { UserProfile } from '../store/user/types';

export interface UserNetworkingInterface {
  getUserProfile(): Promise<UserProfile>;
}

export class UserNetworking implements UserNetworkingInterface {
  public async getUserProfile(): Promise<UserProfile> {
    // FIXME: until we do not have axios and networking configurated the url is hardcoded
    const response = await axios.get('/user/profile');
    const { data } = response;
    return data;
  }
}

export const userNetworking: UserNetworkingInterface = new UserNetworking();
