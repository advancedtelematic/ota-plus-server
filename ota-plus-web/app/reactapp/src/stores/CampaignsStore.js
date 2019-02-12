/** @format */

import { observable, computed, action } from 'mobx';
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
  API_GET_MULTI_TARGET_UPDATE_INDENTIFIER,
  API_GROUPS_DEVICES_FETCH,
  API_GROUPS_DETAIL,
  CAMPAIGNS_STATUSES,
  LIMIT_CAMPAIGNS_PER_PAGE,
  CAMPAIGNS_DEFAULT_TAB,
} from '../config';
import { resetAll, resetAsync, handleAsyncSuccess, handleAsyncError } from '../utils/Common';
import { contains, prepareUpdateObject } from '../utils/Helpers';

export default class CampaignsStore {
  @observable campaignsFetchAsyncAll = {};

  @observable campaignsFetchAsync = {
    prepared: {},
    launched: {},
    finished: {},
    cancelled: {},
  };

  @observable count = {
    prepared: 0,
    launched: 0,
    finished: 0,
    cancelled: 0,
  };

  @observable campaignsSafeFetchAsync = {};
  @observable campaignsSingleFetchAsync = {};
  @observable campaignsSingleSafeFetchAsync = {};
  @observable campaignsSingleStatisticsFetchAsync = {};
  @observable campaignsSingleSafeStatisticsFetchAsync = {};
  @observable campaignsCreateAsync = {};
  @observable campaignsLaunchAsync = {};
  @observable campaignsRenameAsync = {};
  @observable campaignsCancelAsync = {};
  @observable campaignsCancelRequestAsync = {};
  @observable campaignsMtuCreateAsync = {};
  @observable campaigns = [];
  @observable preparedCampaigns = [];
  @observable overallCampaignsCount = null;
  @observable campaignsFilter = '';
  @observable campaignsSort = 'asc';
  @observable campaign = {};
  @observable campaignData = {};

  @observable fullScreenMode = false;
  @observable transitionsEnabled = true;
  @observable limitCampaigns = LIMIT_CAMPAIGNS_PER_PAGE;

  @observable currentDataOffset = 0;

  @observable _latestCampaignsCreated = null;

  @observable activeTab = CAMPAIGNS_DEFAULT_TAB;

  constructor() {
    CAMPAIGNS_STATUSES.forEach(status => {
      resetAsync(this.campaignsFetchAsync[status]);
    });
    resetAsync(this.campaignsSafeFetchAsync);
    resetAsync(this.campaignsSingleFetchAsync);
    resetAsync(this.campaignsSingleSafeFetchAsync);
    resetAsync(this.campaignsSingleStatisticsFetchAsync);
    resetAsync(this.campaignsSingleSafeStatisticsFetchAsync);
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
      .then(response => {
        this.campaignData.mtuId = response.data;
        this.campaignsMtuCreateAsync = handleAsyncSuccess(response);
      })
      .catch(error => {
        this.campaignsMtuCreateAsync = handleAsyncError(error);
      });
  }

  _fetch(status = '', offset = 0, latestOnly = false, limit = null) {
    const limitThisRequest = limit || this.limitCampaigns;
    if (latestOnly) {
      return axios.get(`${ API_CAMPAIGNS_FETCH }?orderBy=createdAt&limit=${ limitThisRequest }`);
    }
    return axios.get(`${ API_CAMPAIGNS_FETCH }?status=${ status }&limit=${ limitThisRequest }&offset=${ offset }`);
  }

  _fetchCampaign(id) {
    return axios.get(`${API_CAMPAIGNS_FETCH_SINGLE}/${id}`);
  }

  _fetchCampaignStatistics(id) {
    return axios.get(`${API_CAMPAIGNS_STATISTICS_SINGLE}/${id}/stats`);
  }

  fetchStatusCounts() {
    const isFetching = true;
    CAMPAIGNS_STATUSES.forEach(status => {
      resetAsync(this.campaignsFetchAsync[status], isFetching);

      this._fetch(status)
        .then(response => {
          this.count[status] = response.data.total;
          this.campaignsFetchAsync[status] = handleAsyncSuccess(response);
        })
        .catch(error => {
          this.campaignsFetchAsync[status] = handleAsyncError(error);
        });
    });
  }

  _fetchDetails(response, status) {
    const campaignIds = response && response.data && response.data.values;

    if (!_.isEmpty(campaignIds)) {
      campaignIds.forEach((id, index) => {
        const progressDone = index === campaignIds.length - 1;
        axios.all([this._fetchCampaign(id), this._fetchCampaignStatistics(id)]).then(
          axios.spread((campaign, statistics) => {
            const isNewItem = !contains(this.campaigns, campaign.data);

            if (isNewItem) {
              const newItem = {
                ...campaign.data,
                summary: statistics.data,
              };
              this.campaigns.push(newItem);
            }
          }),
        );

        if (progressDone) {
          this.campaignsFetchAsync[status] = handleAsyncSuccess(response);
        }
      });
    } else {
      this.campaignsFetchAsync[status] = handleAsyncSuccess(response);
    }
  }

  fetchCampaigns(status = 'prepared', async = 'campaignsFetchAsync', dataOffset = 0) {
    this.campaigns = [];
    // first reset all possible active asyncs
    resetAll(this[async]);
    resetAsync(this[async][status], true);

    return this._fetch(status, dataOffset)
      .then(response => {
        this._fetchDetails(response, status);
        this.currentDataOffset = dataOffset;
      })
      .catch(error => {
        this.campaignsFetchAsync[status] = handleAsyncError(error);
      });
  }

  fetchCampaign(id, mainAsync = 'campaignsSingleFetchAsync', statsAsync = 'campaignsSingleStatisticsFetchAsync') {
    resetAsync(this[mainAsync], true);
    return this._fetchCampaign(id)
      .then(response => {
        resetAsync(this[statsAsync], true);
        axios
          .get(`${API_CAMPAIGNS_STATISTICS_SINGLE}/${id}/stats`)
          .then(statsResponse => {
            const { data } = response;
            const promises = [];
            data.statistics = statsResponse.data;

            _.each(data.groups, groupId => {
              promises.push(axios.get(`${API_GROUPS_DEVICES_FETCH}/${groupId}/devices`), axios.get(`${API_GROUPS_DETAIL}/${groupId}`));
            });

            axios.all(promises).then(responseSet => {
              const results = _.map(responseSet, singleResponse => singleResponse.data);
              const chunks = _.chunk(results, 2);
              data.groups = _.map(chunks, chunk => ({ ...chunk[0], ...chunk[1] }));
              this.campaign = data;
              this[statsAsync] = handleAsyncSuccess(statsResponse);
            });
          })
          .catch(statsError => {
            this[statsAsync] = handleAsyncError(statsError);
          });
        this[mainAsync] = handleAsyncSuccess(response);
      })
      .catch(error => {
        this[mainAsync] = handleAsyncError(error);
      });
  }

  createCampaign(data) {
    resetAsync(this.campaignsCreateAsync, true);
    return axios
      .post(API_CAMPAIGNS_CREATE, data)
      .then(response => {
        this.campaignData.campaignId = response.data;
        this.campaignsCreateAsync = handleAsyncSuccess(response);
      })
      .catch(error => {
        this.campaignsCreateAsync = handleAsyncError(error);
      });
  }

  launchCampaign(id) {
    resetAsync(this.campaignsLaunchAsync, true);
    return axios
      .post(`${API_CAMPAIGNS_LAUNCH}/${id}/launch`)
      .then(response => {
        this.campaignsLaunchAsync = handleAsyncSuccess(response);
      })
      .catch(error => {
        this.campaignsLaunchAsync = handleAsyncError(error);
      });
  }

  renameCampaign(id, data) {
    resetAsync(this.campaignsRenameAsync, true);
    return axios
      .put(`${API_CAMPAIGNS_RENAME}/${id}`, data)
      .then(response => {
        const campaign = _.find(this.campaigns, singleCampaign => singleCampaign.id === id);
        campaign.name = data.name;
        this.campaignsRenameAsync = handleAsyncSuccess(response);
      })
      .catch(error => {
        this.campaignsRenameAsync = handleAsyncError(error);
      });
  }

  cancelCampaign(id) {
    resetAsync(this.campaignsCancelAsync, true);
    return axios
      .post(`${API_CAMPAIGNS_CANCEL}/${id}/cancel`)
      .then(response => {
        this.campaignsCancelAsync = handleAsyncSuccess(response);
      })
      .catch(error => {
        this.campaignsCancelAsync = handleAsyncError(error);
      });
  }

  cancelCampaignRequest(id) {
    resetAsync(this.campaignsCancelRequestAsync, true);
    return axios
      .put(`${API_CAMPAIGNS_CANCEL_REQUEST}/${id}/cancel`)
      .then(response => {
        this.campaignsCancelRequestAsync = handleAsyncSuccess(response);
      })
      .catch(error => {
        this.campaignsCancelRequestAsync = handleAsyncError(error);
      });
  }

  _prepareCampaigns() {
    this.preparedCampaigns = this.campaigns.sort((a, b) => {
      const aName = a.name;
      const bName = b.name;
      return aName.localeCompare(bName);
    });
  }

  _getCampaign(id) {
    return _.find(this.campaigns, { id });
  }

  _showFullScreen() {
    this.fullScreenMode = true;
    this.transitionsEnabled = false;
  }

  _hideFullScreen() {
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

  _resetFullScreen() {
    this.fullScreenMode = false;
    this.transitionsEnabled = true;
  }

  _reset() {
    resetAsync(this.campaignsFetchAsyncAll);
    resetAsync(this.campaignsSafeFetchAsync);
    resetAsync(this.campaignsSingleFetchAsync);
    resetAsync(this.campaignsSingleSafeFetchAsync);
    resetAsync(this.campaignsSingleStatisticsFetchAsync);
    resetAsync(this.campaignsSingleSafeStatisticsFetchAsync);
    resetAsync(this.campaignsCreateAsync);
    resetAsync(this.campaignsLaunchAsync);
    resetAsync(this.campaignsRenameAsync);
    resetAsync(this.campaignsCancelAsync);
    resetAsync(this.campaignsCancelRequestAsync);
    resetAsync(this.campaignsMtuCreateAsync);
    this.campaigns = [];
    this.preparedCampaigns = [];
    this.overallCampaignsCount = null;
    this.campaignsFilter = null;
    this.campaignsSort = 'asc';
    this.campaign = {};
    this.campaignData = {};
    this.fullScreenMode = false;
    this.transitionsEnabled = true;
  }

  @computed get inPreparationCampaigns() {
    let campaigns = this.preparedCampaigns;
    campaigns = _.sortBy(campaigns, campaign => campaign.createdAt).reverse();
    return _.filter(campaigns, campaign => !_.isUndefined(campaign.summary) && campaign.summary.status === 'scheduled');
  }

  @computed get cancelledCampaigns() {
    let campaigns = this.preparedCampaigns;
    campaigns = _.sortBy(campaigns, campaign => campaign.createdAt).reverse();
    return _.filter(campaigns, campaign => !_.isUndefined(campaign.summary) && campaign.summary.status === 'cancelled');
  }

  @computed get runningCampaigns() {
    let campaigns = this.preparedCampaigns;
    campaigns = _.sortBy(campaigns, campaign => campaign.createdAt);
    return _.filter(campaigns, campaign => !_.isUndefined(campaign.summary) && campaign.summary.status === 'launched');
  }

  @computed get finishedCampaigns() {
    let campaigns = this.preparedCampaigns;
    campaigns = _.sortBy(campaigns, campaign => campaign.createdAt).reverse();
    return _.filter(campaigns, campaign => !_.isUndefined(campaign.summary) && campaign.summary.status === 'finished');
  }

  @computed get overallCampaignStatistics() {
    const stats = {
      processed: 0,
      affected: 0,
      finished: 0,
      queued: 0,
      successful: 0,
      notImpacted: 0,
      failed: 0,
      cancelled: 0,
    };
    _.each(this.campaign.statistics.stats, statistic => {
      stats.affected += statistic.affected;
      stats.processed += statistic.processed;
    });
    stats.notImpacted = stats.processed - stats.affected;
    stats.finished = this.campaign.statistics.finished;
    stats.cancelled = this.campaign.statistics.cancelled;
    stats.queued = stats.affected - (stats.finished + stats.cancelled);
    stats.failed = this.campaign.statistics.failed.length;
    stats.successful = stats.finished - stats.failed;
    return stats;
  }

  /**
   * latest created campaigns
   *
   * Following grouped functions are parts of an useful pattern
   * where with @computed decorated functions can trigger an async request
   * if necessary.
   *
   * Also first introduction of @action functions which are similar to known Redux' actions
   * quite much more convenient to implement but to use with care.
   *
   * IMPORTANT: Exclusively functions which are supposed to apply a state change will be decorated with @action
   */

  _fetchLatestCampaignsCreated(limit = 10) {
    // temporary array to fetch all data at once
    // before passing to an @action
    const fetchedCampaigns = [];
    const latestOnly = true;
    resetAsync(this.campaignsLatestFetchAsync, true);
    return this._fetch('', 0, latestOnly, limit)
      .then(response => {
        if (response.data.total > 0) {
          response.data.values.forEach(id => {
            this._fetchCampaign(id)
              .then(response => {fetchedCampaigns.push(response && response.data)})
          });
        }
        this.campaignsLatestFetchAsync = handleAsyncSuccess(response);
      })
      .catch(error => {
        this.campaignsLatestFetchAsync = handleAsyncError(error);
      })
      .finally(() => {
        this.updateLatestCreatedCampaigns(fetchedCampaigns);
      });
  }

  /**
   * Computed values can be derived from the existing state or other computed values.
   * Also data which are of specific characteristics and have to be requested from api
   */
  @computed get latestCampaignsCreated() {
    if (this._latestCampaignsCreated === null) {
      this._fetchLatestCampaignsCreated();
    }
    return this._latestCampaignsCreated;
  }

  /**
   * this @action assigns fetched data of latest created campaigns to an observable
   */
  @action updateLatestCreatedCampaigns(fetchedData) {
    this._latestCampaignsCreated = fetchedData;
  }
}
