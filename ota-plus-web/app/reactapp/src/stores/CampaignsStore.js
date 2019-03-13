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
  API_GET_MULTI_TARGET_UPDATE_INDENTIFIER,
  API_GROUPS_DEVICES_FETCH,
  API_GROUPS_DETAIL,
  CAMPAIGNS_STATUSES,
  LIMIT_CAMPAIGNS_PER_PAGE,
  CAMPAIGNS_DEFAULT_TAB,
  API_CAMPAIGNS_STATISTICS_FAILURES_SINGLE
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
  @observable campaignsLatestFetchAsync = {};
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

  @observable latestCampaigns = [];

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
      return axios.get(`${ API_CAMPAIGNS_FETCH }?sortBy=createdAt&limit=${ limitThisRequest }`);
    }
    return axios.get(`${ API_CAMPAIGNS_FETCH }?sortBy=createdAt&status=${ status }&limit=${ limitThisRequest }&offset=${ offset }`);
  }

  _fetchCampaign(id) {
    return axios.get(`${ API_CAMPAIGNS_FETCH_SINGLE }/${ id }`);
  }

  _fetchCampaignStatistics(id) {
    return axios.get(`${ API_CAMPAIGNS_STATISTICS_SINGLE }/${ id }/stats`);
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
      campaignIds.forEach((id) => {
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
      });
    }
    this.campaignsFetchAsync[status] = handleAsyncSuccess(response);
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

  fetchLatestCampaigns(limit = 10) {
    const latestOnly = true;
    this.latestCampaigns = [];
    resetAsync(this.campaignsLatestFetchAsync, true);
    return this._fetch('', 0, latestOnly, limit)
      .then(response => {
        if (response.data.total > 0) {
          response.data.values.forEach(id => {
              axios.all([this._fetchCampaign(id), this._fetchCampaignStatistics(id)]).then(
                axios.spread((campaign, statistics) => {
                  this.latestCampaigns.push({
                    ...campaign.data,
                    summary: statistics.data,
                  });
                })
              )
            },
          );
        }
        this.latestCampaigns = _.sortBy(this.latestCampaigns.slice(), campaign => campaign.createdAt).reverse();

        this.campaignsLatestFetchAsync = handleAsyncSuccess(response);
      })
      .catch(error => {
        this.campaignsLatestFetchAsync = handleAsyncError(error);
      });
  }

  fetchCampaign(id, mainAsync = 'campaignsSingleFetchAsync', statsAsync = 'campaignsSingleStatisticsFetchAsync') {
    resetAsync(this[mainAsync], true);
    return this._fetchCampaign(id)
      .then(response => {
        resetAsync(this[statsAsync], true);
        axios
          .all([
            axios.get(`${API_CAMPAIGNS_STATISTICS_SINGLE}/${id}/stats`),
            axios.get(`${API_CAMPAIGNS_STATISTICS_FAILURES_SINGLE}/stats?correlationId=urn:here-ota:campaign:${id}`)
          ])
          .then(
            axios.spread((fromCampaignsAPI, fromDeviceAPI) => {
              const { data } = response;
              const promises = [];
              data.statistics = fromCampaignsAPI.data;
              data.statistics.byResultCode = [];
              if (!_.isEmpty(fromDeviceAPI.data)) {
                _.map(fromDeviceAPI.data, el => {
                  !el.success && data.statistics.byResultCode.push(el);
                });
              }

              _.each(data.groups, groupId => {
                promises.push(axios.get(`${API_GROUPS_DEVICES_FETCH}/${groupId}/devices`), axios.get(`${API_GROUPS_DETAIL}/${groupId}`));
              });

              axios.all(promises).then(responseSet => {
                const results = _.map(responseSet, singleResponse => singleResponse.data);
                const chunks = _.chunk(results, 2);
                data.groups = _.map(chunks, chunk => ({ ...chunk[0], ...chunk[1] }));
                this.campaign = data;
                this[statsAsync] = handleAsyncSuccess(fromCampaignsAPI);
              });
            }),
          )
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
      .post(`${ API_CAMPAIGNS_LAUNCH }/${ id }/launch`)
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
      .put(`${ API_CAMPAIGNS_RENAME }/${ id }`, data)
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
      .post(`${ API_CAMPAIGNS_CANCEL }/${ id }/cancel`)
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
      .put(`${ API_CAMPAIGNS_CANCEL_REQUEST }/${ id }/cancel`)
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
    const { affected, processed, cancelled, failed, finished } = this.campaign.statistics;
    stats.affected = affected;
    stats.processed = processed;
    stats.notImpacted = processed - affected;
    stats.finished = finished;
    stats.cancelled = cancelled;
    stats.queued = affected - (finished + cancelled);
    stats.failed = failed.length;
    stats.successful = finished - failed.length;
    return stats;
  }
}
