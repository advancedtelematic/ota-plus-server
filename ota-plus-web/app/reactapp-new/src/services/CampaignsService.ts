import AxiosConnector from './AxiosConnector';
import ApiEndpoints from '../constants/endpoints';
import { ICampaignsState } from '../store/campaigns/types';
import buildUrl from '../helpers/UrlBuilder';

export interface ICampaignsService {
  getAllCampaigns(): Promise<ICampaignsState>;
  getAllCampaignsWithError(): Promise<ICampaignsState>;
}

export class CampaignsService implements ICampaignsService {
  async getAllCampaigns(): Promise<ICampaignsState> {
    const url = buildUrl(ApiEndpoints.CAMPAIGNS.ALL);
    return AxiosConnector.get(url);
  }

  async getAllCampaignsWithError(): Promise<ICampaignsState> {
    const campaignsWithError = { withErrors: 'true' };
    const url = buildUrl(ApiEndpoints.CAMPAIGNS.ALL, campaignsWithError);
    return AxiosConnector.get(url);
  }

}

export const campaignsService: ICampaignsService = new CampaignsService();
