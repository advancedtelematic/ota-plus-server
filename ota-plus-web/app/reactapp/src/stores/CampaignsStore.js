import { observable, computed } from 'mobx';
import axios from 'axios';
import { 
    CSRF_TOKEN,
    API_CAMPAIGNS_FETCH, 
    API_CAMPAIGNS_CAMPAIGN_DETAILS,
    API_CAMPAIGNS_CAMPAIGN_STATISTICS,
    API_CAMPAIGNS_CREATE,
    API_CAMPAIGNS_PACKAGE_SAVE,
    API_CAMPAIGNS_GROUPS_SAVE,
    API_CAMPAIGNS_LAUNCH,
    API_CAMPAIGNS_RENAME,
    API_CAMPAIGNS_CANCEL,
    API_CAMPAIGNS_CANCEL_REQUEST
} from '../config';
import { 
    resetAsync, 
    handleAsyncSuccess, 
    handleAsyncError 
} from '../utils/Common';
import _ from 'underscore';

export default class CampaignsStore {

    @observable campaignsFetchAsync = {};
    @observable campaignsOneFetchAsync = {};
    @observable campaignsOneStatisticsFetchAsync = {};
    @observable campaignsCreateAsync = {};
    @observable campaignsLaunchAsync = {};
    @observable campaignsPackageSaveAsync = {};
    @observable campaignsGroupsSaveAsync = {};
    @observable campaignsRenameAsync = {};
    @observable campaignsCancelAsync = {};
    @observable campaignsCancelRequestAsync = {};
    @observable campaigns = [];
    @observable preparedCampaigns = [];
    @observable overallCampaignsCount = null;
    @observable campaignsFilter = '';
    @observable campaignsSort = 'asc';
    @observable campaign = {};

    constructor() {
        resetAsync(this.campaignsFetchAsync);
        resetAsync(this.campaignsOneFetchAsync);
        resetAsync(this.campaignsOneStatisticsFetchAsync);
        resetAsync(this.campaignsCreateAsync);
        resetAsync(this.campaignsPackageSaveAsync);
        resetAsync(this.campaignsGroupsSaveAsync);
        resetAsync(this.campaignsLaunchAsync);
        resetAsync(this.campaignsRenameAsync);
        resetAsync(this.campaignsCancelAsync);
        resetAsync(this.campaignsCancelRequestAsync);
    }

    fetchCampaigns() {
        resetAsync(this.campaignsFetchAsync, true);
        return axios.get(API_CAMPAIGNS_FETCH)
            .then(function (response) {
                let campaigns = response.data;
                if(campaigns.length) {
                    let after = _.after(campaigns.length, () => {
                        this.campaigns = campaigns;
                        this._prepareCampaigns(this.campaignsFilter, this.campaignsSort);
                        if(this.overallCampaignsCount === null)
                            this.overallCampaignsCount = campaigns.length;
                        this.campaignsFetchAsync = handleAsyncSuccess(response);
                    }, this);
                    _.each(campaigns, (campaign, index) => {
                        if(campaign.status === "Active")
                            axios.get(API_CAMPAIGNS_CAMPAIGN_STATISTICS + '/' + campaign.id + '/statistics')
                            .then(function(resp) {
                                let statistics = resp.data;
                                var summary = {};
                                let overallDevicesCount = 0;
                                let overallUpdatedDevicesCount = 0;
                                let overallFailedUpdates = 0;
                                let overallSuccessfulUpdates = 0;
                                let overallCancelledUpdates = 0;
                                _.each(statistics, (statistic) => {
                                    overallDevicesCount += statistic.deviceCount;
                                    overallUpdatedDevicesCount += statistic.updatedDevices;
                                    overallFailedUpdates += statistic.failedUpdates;
                                    overallSuccessfulUpdates += statistic.successfulUpdates;
                                    overallCancelledUpdates += statistic.cancelledUpdates;
                                });
                                summary = {
                                    overallDevicesCount: overallDevicesCount,
                                    overallUpdatedDevicesCount: overallUpdatedDevicesCount,
                                    overallFailedUpdates: overallFailedUpdates,
                                    overallSuccessfulUpdates: overallSuccessfulUpdates,
                                    overallCancelledUpdates: overallCancelledUpdates
                                };
                                campaign.statistics = statistics;
                                campaign.summary = summary;
                                after();
                            })
                            .catch(function() {
                                after();
                            });
                    else
                      after();
                  });
                } else {
                    this.campaigns = campaigns;
                    this._prepareCampaigns(this.campaignsFilter, this.campaignsSort);
                    if(this.overallCampaignsCount === null)
                            this.overallCampaignsCount = campaigns.length;
                    this.campaignsFetchAsync = handleAsyncSuccess(response);
                }
            }.bind(this))
            .catch(function (error) {
                this.campaignsFetchAsync = handleAsyncError(error);
            }.bind(this));    
    }

    fetchCampaign(id) {
        resetAsync(this.campaignsOneFetchAsync, true);
        return axios.get(API_CAMPAIGNS_CAMPAIGN_DETAILS + '/' + id)
            .then(function (response) {
                resetAsync(this.campaignsOneStatisticsFetchAsync, true);
                this.campaignsOneFetchAsync = handleAsyncSuccess(response);
                axios.get(API_CAMPAIGNS_CAMPAIGN_STATISTICS + '/' + id + '/statistics')
                    .then(function (resp) {
                        let data = response.data;
                        data.statistics = resp.data;
                        this.campaign = data;
                        this.campaignsOneStatisticsFetchAsync = handleAsyncSuccess(resp);
                    }.bind(this))
                    .catch(function (err) {
                        this.campaignsOneStatisticsFetchAsync = handleAsyncError(err);
                    }.bind(this));
            }.bind(this))
            .catch(function (error) {
                this.campaignsOneFetchAsync = handleAsyncError(error);
            }.bind(this));
    }

    createCampaign(data) {
        resetAsync(this.campaignsCreateAsync, true);
        return axios.post(API_CAMPAIGNS_CREATE, data)
            .then(function (response) {
                this.fetchCampaigns();
                this.campaignsCreateAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function (error) {
                this.campaignsCreateAsync = handleAsyncError(error);
            }.bind(this));
    }

    savePackageForCampaign(id, data) {
        resetAsync(this.campaignsPackageSaveAsync, true);
        return axios.put(API_CAMPAIGNS_PACKAGE_SAVE + '/' + id + '/package', data)
            .then(function (response) {
                this.campaignsPackageSaveAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function (error) {
                this.campaignsPackageSaveAsync = handleAsyncError(error);
            }.bind(this));
    }

    saveGroupsForCampaign(id, data) {
        resetAsync(this.campaignsGroupsSaveAsync, true);
        return axios.put(API_CAMPAIGNS_GROUPS_SAVE + '/' + id + '/groups', data)
            .then(function (response) {
                this.campaignsGroupsSaveAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function (error) {
                this.campaignsGroupsSaveAsync = handleAsyncError(error);
            }.bind(this));
    }

    launchCampaign(id) {
        resetAsync(this.campaignsLaunchAsync, true);
        return axios.post(API_CAMPAIGNS_LAUNCH + '/' + id + '/launch')
            .then(function (response) {
                this.fetchCampaigns();
                this.campaignsLaunchAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function (error) {
                this.campaignsLaunchAsync = handleAsyncError(error);
            }.bind(this));
    }

    renameCampaign(id, data) {
        resetAsync(this.campaignsRenameAsync, true);
        return axios.put(API_CAMPAIGNS_RENAME + '/' + id + '/name', data)
            .then(function (response) {
                this.campaignsRenameAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function (error) {
                this.campaignsRenameAsync = handleAsyncError(error);
            }.bind(this));
    }

    cancelCampaign(id) {
        resetAsync(this.campaignsCancelAsync, true);
        return axios.put(API_CAMPAIGNS_CANCEL + '/' + id + '/cancel')
            .then(function (response) {
                this.campaignsCancelAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function (error) {
                this.campaignsCancelAsync = handleAsyncError(error);
            }.bind(this));
    }

    cancelCampaignRequest(id) {
        resetAsync(this.campaignsCancelRequestAsync, true);
        return axios.put(API_CAMPAIGNS_CANCEL_REQUEST + '/' + id + '/cancel')
            .then(function (response) {
                this.campaignsCancelRequestAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function (error) {
                this.campaignsCancelRequestAsync = handleAsyncError(error);
            }.bind(this));
    }

    _prepareCampaigns(campaignsFilter, campaignsSort) {
        this.campaignsFilter = campaignsFilter;
        this.campaignsSort = campaignsSort;
        let campaigns = this.campaigns;
        if(campaignsFilter)
            campaigns = _.filter(campaigns, (campaign) => {
                return campaign.name.indexOf(campaignsFilter) > -1;
            });
        this.preparedCampaigns = campaigns.sort((a, b) => {
          let aName = a.name;
          let bName = b.name;
          if(campaignsSort !== 'undefined' && campaignsSort == 'desc')
            return (aName.charAt(0) % 1 === 0 && bName.charAt(0) % 1 !== 0) ? -1 : bName.localeCompare(aName);
          else
            return (aName.charAt(0) % 1 === 0 && bName.charAt(0) % 1 !== 0) ? 1 : aName.localeCompare(bName);
        });
    }

    _getCampaign(id) {
        return _.findWhere(this.preparedCampaigns, {id: id});
    }

    _updateCampaignData(id, data) {
        let campaign = this._getCampaign(id);
        _.each(data, (value, attr) => {
            campaign[attr] = value;
        });
           this._prepareCampaigns(this.campaignsFilter, this.campaignsSort);
    }

    _resetWizard() {
        resetAsync(this.campaignsOneFetchAsync);
        resetAsync(this.campaignsOneStatisticsFetchAsync);
        resetAsync(this.campaignsPackageSaveAsync);
        resetAsync(this.campaignsGroupsSaveAsync);
        resetAsync(this.campaignsLaunchAsync);
        this.campaign = {};
    }

    _reset() {
        resetAsync(this.campaignsFetchAsync);
        resetAsync(this.campaignsOneFetchAsync);
        resetAsync(this.campaignsOneStatisticsFetchAsync);
        resetAsync(this.campaignsCreateAsync);
        resetAsync(this.campaignsPackageSaveAsync);
        resetAsync(this.campaignsGroupsSaveAsync);
        resetAsync(this.campaignsLaunchAsync);
        resetAsync(this.campaignsRenameAsync);
        resetAsync(this.campaignsCancelAsync);
        resetAsync(this.campaignsCancelRequestAsync);
        this.campaigns = [];
        this.preparedCampaigns = [];
        this.overallCampaignsCount = null;
        this.campaignsFilter = null;
        this.campaignsSort = 'asc';
        this.campaign = {};
    }


    @computed get campaignsCount() {
        return this.campaigns.length;
    }

    @computed get draftCampaigns() {
        return _.filter(this.preparedCampaigns, (campaign) => {
            return campaign.status === "Draft";
        });
    }

    @computed get activeCampaigns() {
        return _.filter(this.preparedCampaigns, (campaign) => {
            return campaign.status === "Active" && campaign.summary.overallDevicesCount !== campaign.summary.overallUpdatedDevicesCount;
        });
    }

    @computed get finishedCampaigns() {
        return _.filter(this.preparedCampaigns, (campaign) => {
            return campaign.status === "Active" && campaign.summary.overallDevicesCount === campaign.summary.overallUpdatedDevicesCount;
        });
    }

    @computed get lastDraftCampaigns() {
        let campaigns = this.draftCampaigns;
        _.sortBy(campaigns, function(campaign) {
          return campaign.createdAt;
        }).reverse()
        return campaigns.slice(0,10);
    }

    @computed get lastActiveCampaigns() {
        let campaigns = this.activeCampaigns;
        _.sortBy(campaigns, function(campaign) {
          return campaign.createdAt;
        }).reverse()
        return campaigns.slice(0,10);
    }

    @computed get overallCampaignStatistics() {
        let stats = {
            devicesCount: 0,
            updatedDevicesCount: 0,
            failedUpdates: 0,
            successfulUpdates: 0,
            cancelledUpdates: 0
        };
        _.each(this.campaign.statistics, (statistic) => {
            stats.devicesCount += statistic.deviceCount;
            stats.updatedDevicesCount += statistic.updatedDevices;
            stats.failedUpdates += statistic.failedUpdates;
            stats.successfulUpdates += statistic.successfulUpdates;
            stats.cancelledUpdates += statistic.cancelledUpdates;
        });
        return stats;
    }

}