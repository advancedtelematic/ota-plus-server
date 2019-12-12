/** @format */

import { observable, computed } from 'mobx';
import axios from 'axios';
import _ from 'lodash';
import {
  API_CAMPAIGNS_FETCH,
  API_CAMPAIGNS_FETCH_SINGLE,
  API_CAMPAIGNS_STATISTICS_SINGLE,
  API_CAMPAIGNS_CREATE,
  API_CAMPAIGNS_LAUNCH,
  API_CAMPAIGNS_RENAME,
  API_CAMPAIGNS_CANCEL,
  API_CAMPAIGNS_CANCEL_REQUEST,
  API_CAMPAIGNS_RETRY_SINGLE,
  API_GET_MULTI_TARGET_UPDATE_INDENTIFIER,
  CAMPAIGNS_STATUSES,
  CAMPAIGNS_STATUS_ALL,
  CAMPAIGNS_STATUS_LAUNCHED,
  CAMPAIGNS_STATUS_FINISHED,
  CAMPAIGNS_STATUS_CANCELLED,
  CAMPAIGNS_STATUS_SCHEDULED,
  CAMPAIGNS_LIMIT_PER_PAGE,
  CAMPAIGNS_DEFAULT_TAB,
} from '../config';
import { CAMPAIGN_RETRY_STATUSES } from '../constants';
import { resetAll, resetAsync, handleAsyncSuccess, handleAsyncError } from '../utils/Common';
import { prepareUpdateObject } from '../utils/Helpers';
import { getOverallCampaignStatistics } from '../helpers/campaignHelper';

export default class CampaignsStore {
  @observable campaignsFetchAsyncAll = {};

  @observable campaignsStatsFetchAsync = {};

  @observable campaignsWithErrorsFetchAsync = {};

  @observable campaignsFetchAsync = {
    all: {},
    prepared: {},
    launched: {},
    finished: {},
    cancelled: {},
  };

  @observable count = {
    all: 0,
    prepared: 0,
    launched: 0,
    finished: 0,
    cancelled: 0,
  };

  @observable campaignsLatestFetchAsync = {};

  @observable campaignsSafeFetchAsync = {
    all: {},
  };

  @observable campaignsSingleFetchAsync = {};

  @observable campaignsSingleSafeFetchAsync = {};

  @observable campaignsSingleStatisticsFetchAsync = {};

  @observable campaignsSingleSafeStatisticsFetchAsync = {};

  @observable campaignsSingleRetryAsync = {};

  @observable campaignsCreateAsync = {};

  @observable campaignsLaunchAsync = {};

  @observable campaignsRenameAsync = {};

  @observable campaignsCancelAsync = {};

  @observable campaignsCancelRequestAsync = {};

  @observable campaignsMtuCreateAsync = {};

  @observable campaigns = [];

  @observable campaignsTotal = 0;

  @observable campaignsWithErrorsTotal = 0;

  @observable preparedCampaigns = [];

  @observable overallCampaignsCount = null;

  @observable campaignsFilter = '';

  @observable campaignsSort = 'asc';

  @observable campaign = {};

  @observable campaignData = {};

  @observable fullScreenMode = false;

  @observable transitionsEnabled = true;

  @observable limitCampaigns = CAMPAIGNS_LIMIT_PER_PAGE;

  @observable latestCampaigns = [];

  @observable activeTab = CAMPAIGNS_DEFAULT_TAB;

  constructor() {
    CAMPAIGNS_STATUSES.forEach((status) => {
      resetAsync(this.campaignsFetchAsync[status]);
    });
    resetAsync(this.campaignsSafeFetchAsync);
    resetAsync(this.campaignsSingleFetchAsync);
    resetAsync(this.campaignsSingleSafeFetchAsync);
    resetAsync(this.campaignsSingleStatisticsFetchAsync);
    resetAsync(this.campaignsSingleSafeStatisticsFetchAsync);
    resetAsync(this.campaignsSingleRetryAsync);
    resetAsync(this.campaignsCreateAsync);
    resetAsync(this.campaignsLaunchAsync);
    resetAsync(this.campaignsRenameAsync);
    resetAsync(this.campaignsCancelAsync);
    resetAsync(this.campaignsCancelRequestAsync);
    resetAsync(this.campaignsMtuCreateAsync);
  }

  createMultiTargetUpdate(data) {
    const updateObject = prepareUpdateObject(data);
    resetAsync(this.campaignsMtuCreateAsync, true);
    return axios
      .post(API_GET_MULTI_TARGET_UPDATE_INDENTIFIER, updateObject)
      .then((response) => {
        this.campaignData.mtuId = response.data;
        this.campaignsMtuCreateAsync = handleAsyncSuccess(response);
      })
      .catch((error) => {
        this.campaignsMtuCreateAsync = handleAsyncError(error);
      });
  }

  async fetchCampaignsStats() {
    try {
      const { data } = await axios.get(API_CAMPAIGNS_FETCH);
      this.campaignsTotal = data.total;
    } catch (err) {
      this.campaignsStatsFetchAsync = handleAsyncError(err);
    }
  }

  async fetchCampaignsWithErrors() {
    try {
      const { data } = await axios.get(`${API_CAMPAIGNS_FETCH}?withErrors=true`);
      this.campaignsWithErrorsTotal = data.total;
    } catch (err) {
      this.campaignsWithErrorsFetchAsync = handleAsyncError(err);
    }
  }

  fetch(status = '', offset = 0, latestOnly = false, limit = null) {
    const limitThisRequest = limit || this.limitCampaigns;
    if (latestOnly) {
      return axios.get(`${API_CAMPAIGNS_FETCH}?limit=${limitThisRequest}`);
    }
    if (status === CAMPAIGNS_STATUS_ALL) {
      return axios.get(`${API_CAMPAIGNS_FETCH}?nameContains=${this.campaignsFilter.toLowerCase()}&limit=${limitThisRequest}&offset=${offset}`);
    }
    return axios.get(`${API_CAMPAIGNS_FETCH}?status=${status}&nameContains=${this.campaignsFilter.toLowerCase()}&limit=${limitThisRequest}&offset=${offset}`);
  }

  fetchCampaignSingle = id => axios.get(`${API_CAMPAIGNS_FETCH_SINGLE}/${id}`);

  fetchCampaignStatistics = id => axios.get(`${API_CAMPAIGNS_STATISTICS_SINGLE}/${id}/stats`);

  fetchStatusCounts() {
    const isFetching = true;
    CAMPAIGNS_STATUSES.forEach((status) => {
      resetAsync(this.campaignsFetchAsync[status], isFetching);

      this.fetch(status)
        .then((response) => {
          this.count[status] = response.data.total;
          this.campaignsFetchAsync[status] = handleAsyncSuccess(response);
        })
        .catch((error) => {
          this.campaignsFetchAsync[status] = handleAsyncError(error);
        });
    });
  }

  fetchAllCampaignsStatistics(campaigns) {
    const campaignsIds = campaigns.map(campaign => campaign.id);
    if (!_.isEmpty(campaignsIds)) {
      campaignsIds.forEach((id) => {
        axios.all([this.fetchCampaignStatistics(id)]).then(
          axios.spread((statistics) => {
            const updatingCampaign = campaigns.find(
              iteratedCampaign => iteratedCampaign.id === statistics.data.campaign
            );
            updatingCampaign.summary = statistics.data;
          }),
        );
      });
    }
  }

  fetchCampaigns(status = 'all', async = 'campaignsFetchAsync', dataOffset = 0) {
    this.campaigns = [];
    // first reset all possible active asyncs
    resetAll(this[async]);
    resetAsync(this[async][status], true);

    return this.fetch(status, dataOffset)
      .then((response) => {
        const campaigns = response && response.data && response.data.values;
        this.campaigns = campaigns;
        this.fetchAllCampaignsStatistics(this.campaigns);

        this[async][status] = handleAsyncSuccess(response);
      })
      .catch((error) => {
        this[async][status] = handleAsyncError(error);
      });
  }

  fetchLatestCampaigns(limit = 10) {
    const latestOnly = true;
    this.latestCampaigns = [];
    resetAsync(this.campaignsLatestFetchAsync, true);
    return this.fetch('', 0, latestOnly, limit)
      .then((response) => {
        const campaigns = response && response.data && response.data.values;
        this.latestCampaigns = campaigns;
        this.fetchAllCampaignsStatistics(this.latestCampaigns);
        this.campaignsLatestFetchAsync = handleAsyncSuccess(response);
      })
      .catch((error) => {
        this.campaignsLatestFetchAsync = handleAsyncError(error);
      });
  }

  fetchCampaign(id, mainAsync = 'campaignsSingleFetchAsync', statsAsync = 'campaignsSingleStatisticsFetchAsync') {
    resetAsync(this[mainAsync], true);
    return this.fetchCampaignSingle(id)
      .then((response) => {
        resetAsync(this[statsAsync], true);
        axios
          .all([
            axios.get(`${API_CAMPAIGNS_STATISTICS_SINGLE}/${id}/stats`)
          ])
          .then(
            axios.spread((fromCampaignsAPI) => {
              const { data } = response;
              data.statistics = fromCampaignsAPI.data;
              this.campaign = data;
              this[statsAsync] = handleAsyncSuccess(fromCampaignsAPI);
            }),
          )
          .catch((statsError) => {
            this[statsAsync] = handleAsyncError(statsError);
          });
        this[mainAsync] = handleAsyncSuccess(response);
      })
      .catch((error) => {
        this[mainAsync] = handleAsyncError(error);
      });
  }

  createCampaign(data) {
    resetAsync(this.campaignsCreateAsync, true);
    return axios
      .post(API_CAMPAIGNS_CREATE, data)
      .then((response) => {
        this.campaignData.campaignId = response.data;
        this.campaignsCreateAsync = handleAsyncSuccess(response);
      })
      .catch((error) => {
        this.campaignsCreateAsync = handleAsyncError(error);
      });
  }

  launchCampaign(id) {
    resetAsync(this.campaignsLaunchAsync, true);
    return axios
      .post(`${API_CAMPAIGNS_LAUNCH}/${id}/launch`)
      .then((response) => {
        this.campaignsLaunchAsync = handleAsyncSuccess(response);
      })
      .catch((error) => {
        this.campaignsLaunchAsync = handleAsyncError(error);
      });
  }

  launchRetryCampaign(id, failureCode) {
    resetAsync(this.campaignsSingleRetryAsync, true);
    const retryFailure = _.find(this.campaign.statistics.failures, singleFailure => singleFailure.code === failureCode);
    return axios
      .post(`${API_CAMPAIGNS_RETRY_SINGLE}/${id}/retry-failed`, { failureCode })
      .then((response) => {
        this.campaignsSingleRetryAsync = handleAsyncSuccess(response);
        _.each(this.campaign.statistics.failures, (singleFailure) => {
          if (singleFailure.code !== failureCode) {
            // eslint-disable-next-line no-param-reassign
            singleFailure.retryStatus = CAMPAIGN_RETRY_STATUSES.WAITING;
          }
        });
        retryFailure.retryStatus = CAMPAIGN_RETRY_STATUSES.LAUNCHED;
      })
      .catch((error) => {
        this.campaignsSingleRetryAsync = handleAsyncError(error);
      });
  }

  renameCampaign(id, data) {
    resetAsync(this.campaignsRenameAsync, true);
    return axios
      .put(`${API_CAMPAIGNS_RENAME}/${id}`, data)
      .then((response) => {
        const campaign = _.find(this.campaigns, singleCampaign => singleCampaign.id === id);
        campaign.name = data.name;
        this.campaignsRenameAsync = handleAsyncSuccess(response);
      })
      .catch((error) => {
        this.campaignsRenameAsync = handleAsyncError(error);
      });
  }

  cancelCampaign(id) {
    resetAsync(this.campaignsCancelAsync, true);
    return axios
      .post(`${API_CAMPAIGNS_CANCEL}/${id}/cancel`)
      .then((response) => {
        this.campaignsCancelAsync = handleAsyncSuccess(response);
      })
      .catch((error) => {
        this.campaignsCancelAsync = handleAsyncError(error);
      });
  }

  cancelCampaignRequest(id) {
    resetAsync(this.campaignsCancelRequestAsync, true);
    return axios
      .put(`${API_CAMPAIGNS_CANCEL_REQUEST}/${id}/cancel`)
      .then((response) => {
        this.campaignsCancelRequestAsync = handleAsyncSuccess(response);
      })
      .catch((error) => {
        this.campaignsCancelRequestAsync = handleAsyncError(error);
      });
  }

  prepareCampaigns() {
    this.preparedCampaigns = this.campaigns.sort((a, b) => {
      const aName = a.name;
      const bName = b.name;
      return aName.localeCompare(bName);
    });
  }

  _getCampaign(id) {
    return _.find(this.campaigns, { id });
  }

  showFullScreen() {
    this.fullScreenMode = true;
    this.transitionsEnabled = false;
  }

  hideFullScreen() {
    this.fullScreenMode = false;
    const that = this;
    setTimeout(() => {
      that.transitionsEnabled = true;
    });
  }

  _resetWizard() {
    resetAsync(this.campaignsSingleFetchAsync);
    resetAsync(this.campaignsSingleSafeFetchAsync);
    resetAsync(this.campaignsSingleStatisticsFetchAsync);
    resetAsync(this.campaignsSingleSafeStatisticsFetchAsync);
    resetAsync(this.campaignsLaunchAsync);
    this.campaign = {};
  }

  resetFullScreen() {
    this.fullScreenMode = false;
    this.transitionsEnabled = true;
  }

  reset() {
    resetAsync(this.campaignsFetchAsyncAll);
    resetAsync(this.campaignsSafeFetchAsync);
    resetAsync(this.campaignsSingleFetchAsync);
    resetAsync(this.campaignsSingleSafeFetchAsync);
    resetAsync(this.campaignsSingleStatisticsFetchAsync);
    resetAsync(this.campaignsSingleSafeStatisticsFetchAsync);
    resetAsync(this.campaignsSingleRetryAsync);
    resetAsync(this.campaignsCreateAsync);
    resetAsync(this.campaignsLaunchAsync);
    resetAsync(this.campaignsRenameAsync);
    resetAsync(this.campaignsCancelAsync);
    resetAsync(this.campaignsCancelRequestAsync);
    resetAsync(this.campaignsMtuCreateAsync);
    this.campaigns = [];
    this.preparedCampaigns = [];
    this.overallCampaignsCount = null;
    this.campaignsFilter = '';
    this.campaignsSort = 'asc';
    this.campaign = {};
    this.campaignData = {};
    this.fullScreenMode = false;
    this.transitionsEnabled = true;
  }

  @computed get inPreparationCampaigns() {
    return _.filter(
      this.preparedCampaigns,
      campaign => !_.isUndefined(campaign.summary) && campaign.summary.status === CAMPAIGNS_STATUS_SCHEDULED
    );
  }

  @computed get cancelledCampaigns() {
    return _.filter(
      this.preparedCampaigns,
      campaign => !_.isUndefined(campaign.summary) && campaign.summary.status === CAMPAIGNS_STATUS_CANCELLED
    );
  }

  @computed get runningCampaigns() {
    return _.filter(
      this.preparedCampaigns,
      campaign => !_.isUndefined(campaign.summary) && campaign.summary.status === CAMPAIGNS_STATUS_LAUNCHED
    );
  }

  @computed get finishedCampaigns() {
    return _.filter(
      this.preparedCampaigns,
      campaign => !_.isUndefined(campaign.summary) && campaign.summary.status === CAMPAIGNS_STATUS_FINISHED
    );
  }

  @computed get overallCampaignStatistics() {
    return getOverallCampaignStatistics(this.campaign.statistics);
  }
}
