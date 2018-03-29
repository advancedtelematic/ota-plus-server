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
    API_CAMPAIGNS_CANCEL_REQUEST,
    API_GET_MULTI_TARGET_UPDATE_INDENTIFIER,
    API_CAMPAIGNS_INDIVIDUAL_FETCH,
    API_CAMPAIGNS_LEGACY_CREATE,
    API_CAMPAIGNS_LEGACY_LAUNCH,
    API_CAMPAIGNS_LEGACY_FETCH,
    API_CAMPAIGNS_LEGACY_CAMPAIGN_STATISTICS,
    API_CAMPAIGNS_LEGACY_INDIVIDUAL_FETCH,
    API_CAMPAIGNS_LEGACY_RENAME,
    API_CAMPAIGNS_LEGACY_CANCEL
} from '../config';
import { 
    resetAsync, 
    handleAsyncSuccess, 
    handleAsyncError 
} from '../utils/Common';
import _ from 'underscore';

export default class CampaignsStore {

    @observable campaignsFetchAsync = {};
    @observable campaignsSafeFetchAsync = {};
    @observable campaignsOneFetchAsync = {};
    @observable campaignsOneSafeFetchAsync = {};
    @observable campaignsOneStatisticsFetchAsync = {};
    @observable campaignsOneSafeStatisticsFetchAsync = {};
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

    constructor() {
        resetAsync(this.campaignsFetchAsync);
        resetAsync(this.campaignsSafeFetchAsync);
        resetAsync(this.campaignsOneFetchAsync);
        resetAsync(this.campaignsOneSafeFetchAsync);
        resetAsync(this.campaignsOneStatisticsFetchAsync);
        resetAsync(this.campaignsOneSafeStatisticsFetchAsync);
        resetAsync(this.campaignsCreateAsync);
        resetAsync(this.campaignsLaunchAsync);
        resetAsync(this.campaignsRenameAsync);
        resetAsync(this.campaignsCancelAsync);
        resetAsync(this.campaignsCancelRequestAsync);
        resetAsync(this.campaignsMtuCreateAsync);
    }

    createMultiTargetUpdate(data) {
        let updateObject = this._prepareUpdateObject(data);
        resetAsync(this.campaignsMtuCreateAsync, true);
        return axios.post(API_GET_MULTI_TARGET_UPDATE_INDENTIFIER, updateObject)
            .then((response) => {
                this.campaignData.mtuId = response.data;
                this.campaignsMtuCreateAsync = handleAsyncSuccess(response);
            })
            .catch((error) => {
                this.campaignsMtuCreateAsync = handleAsyncError(error);
            });
    }

     _prepareUpdateObject(data) {
        let targets = {};
        _.each(data, (item, index) => {
            targets[item.hardwareId] = {
                from: {
                    target: item.from.target,
                    checksum: {
                        method: "sha256",
                        hash: item.from.hash
                    },
                    targetLength: item.from.targetLength
                },
                to: {
                    target: item.to.target,
                    checksum: {
                        method: "sha256",
                        hash: item.to.hash
                    },
                    targetLength: item.to.targetLength
                },
                targetFormat: item.targetFormat,
                generateDiff: item.generateDiff
            }
        });
        return {
            targets
        };
    }

    fetchCampaigns(async = 'campaignsFetchAsync') {
        resetAsync(this[async], true);
        return axios.get(API_CAMPAIGNS_FETCH)
            .then(function (response) {
                let campaignIds = response.data.values;
                let that = this;
                if(campaignIds.length) {
                    let after = _.after(campaignIds.length, () => {
                        let afterStats = _.after(this.campaigns.length, () => {
                            this.overallCampaignsCount = response.data.total;
                            this._prepareCampaigns();
                            this[async] = handleAsyncSuccess(response);
                        });
                        _.each(this.campaigns, (campaign, index) => {
                            axios.get(API_CAMPAIGNS_CAMPAIGN_STATISTICS + '/' + campaign.id + '/stats')
                                .then(function(resp) {
                                    let stats = resp.data;
                                    campaign.summary = stats;
                                    afterStats();
                                })
                                .catch(function() {
                                    afterStats();
                                });
                        });
                    }, this);
                    _.each(campaignIds, (campaignId, index) => {
                        axios.get(API_CAMPAIGNS_INDIVIDUAL_FETCH + '/' + campaignId)
                        .then(function(resp) {
                            that.campaigns = _.uniq(that.campaigns.concat(resp.data), campaign => campaign.id);
                            after();
                        })
                        .catch(function() {
                            after();
                        });
                  });

                } else {
                    this.campaigns = [];
                    this[async] = handleAsyncSuccess(response);
                }
            }.bind(this))
            .catch(function (error) {
                this[async] = handleAsyncError(error);
            }.bind(this));    
    }

    fetchCampaign(id, mainAsync = 'campaignsOneFetchAsync', statsAsync = 'campaignsOneStatisticsFetchAsync') {
        resetAsync(this[mainAsync], true);
        return axios.get(API_CAMPAIGNS_INDIVIDUAL_FETCH + '/' + id)
            .then(function (response) {
                resetAsync(this[statsAsync], true);
                this[mainAsync] = handleAsyncSuccess(response);
                axios.get(API_CAMPAIGNS_CAMPAIGN_STATISTICS + '/' + id + '/stats')
                    .then(function (resp) {
                        let data = response.data;
                        data.statistics = resp.data;
                        this.campaign = data;
                        this[statsAsync] = handleAsyncSuccess(resp);
                    }.bind(this))
                    .catch(function (err) {
                        this[statsAsync] = handleAsyncError(err);
                    }.bind(this));
            }.bind(this))
            .catch(function (error) {
                this[statsAsync] = handleAsyncError(error);
            }.bind(this));
    }

    createCampaign(data) {
        resetAsync(this.campaignsCreateAsync, true);
        return axios.post(API_CAMPAIGNS_CREATE, data)
            .then(function (response) {
                this.campaignData.campaignId = response.data;
                this.campaignsCreateAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function (error) {
                this.campaignsCreateAsync = handleAsyncError(error);
            }.bind(this));
    }    

    launchCampaign(id) {
        resetAsync(this.campaignsLaunchAsync, true);
        return axios.post(API_CAMPAIGNS_LAUNCH + '/' + id + '/launch')
            .then(function (response) {
                this.campaignsLaunchAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function (error) {
                this.campaignsLaunchAsync = handleAsyncError(error);
            }.bind(this));
    }

    renameCampaign(id, data) {
        resetAsync(this.campaignsRenameAsync, true);
        return axios.put(API_CAMPAIGNS_RENAME + '/' + id, data)
            .then(function (response) {                
                let campaign = _.find(this.campaigns, campaign => {
                    return campaign.id === id;
                });
                campaign.name = data.name;
                this.campaignsRenameAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function (error) {
                this.campaignsRenameAsync = handleAsyncError(error);
            }.bind(this));
    }

    cancelCampaign(id) {
        resetAsync(this.campaignsCancelAsync, true);
        return axios.post(API_CAMPAIGNS_CANCEL + '/' + id + '/cancel')
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

    _prepareCampaigns() {
        let campaigns = this.campaigns;
        this.preparedCampaigns = campaigns.sort((a, b) => {
          let aName = a.name;
          let bName = b.name;
            return aName.localeCompare(bName);
        });
    }

    _getCampaign(id) {
        return this._getTufCampaign(id);
    }

    _getTufCampaign(id) {
        return _.findWhere(this.campaigns, {id: id});
    }

    _updateTufCampaignData(id, data) {
        let campaign = this._getTufCampaign(id);
        _.each(data, (value, attr) => {
            campaign[attr] = value;
        });
       this._prepareCampaigns();
    }

    _showFullScreen() {
        this.fullScreenMode = true;
        this.transitionsEnabled = false;
    }

    _hideFullScreen() {
        this.fullScreenMode = false;
        let that = this;
        setTimeout(() => {
            that.transitionsEnabled = true;
        })
    }

    _resetWizard() {
        resetAsync(this.campaignsOneFetchAsync);
        resetAsync(this.campaignsOneSafeFetchAsync);
        resetAsync(this.campaignsOneStatisticsFetchAsync);
        resetAsync(this.campaignsOneSafeStatisticsFetchAsync);
        resetAsync(this.campaignsLaunchAsync);
        this.campaign = {};
    }

    _resetFullScreen() {
        this.fullScreenMode = false;
        this.transitionsEnabled = true;
    }

    _reset() {
        resetAsync(this.campaignsFetchAsync);
        resetAsync(this.campaignsSafeFetchAsync);
        resetAsync(this.campaignsOneFetchAsync);
        resetAsync(this.campaignsOneSafeFetchAsync);
        resetAsync(this.campaignsOneStatisticsFetchAsync);
        resetAsync(this.campaignsOneSafeStatisticsFetchAsync);
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
        this.camapignMultiTargetUpdateIdentifier = null;
        this.fullScreenMode = false;
        this.transitionsEnabled = true;
    }

    @computed get inPreparationCampaigns() {
        let campaigns = this.preparedCampaigns;
        campaigns = _.sortBy(campaigns, function(campaign) {
          return campaign.createdAt;
        }).reverse();
        return _.filter(campaigns, (campaign) => {
            return !_.isUndefined(campaign.summary) && campaign.summary.status === "scheduled";
        });
    }

    @computed get cancelledCampaigns() {
        let campaigns = this.preparedCampaigns;
        campaigns = _.sortBy(campaigns, function(campaign) {
          return campaign.createdAt;
        }).reverse();
        return _.filter(campaigns, (campaign) => {
            return !_.isUndefined(campaign.summary) && campaign.summary.status === "cancelled";
        });
    }

    @computed get runningCampaigns() {
        let campaigns = this.preparedCampaigns;
        campaigns = _.sortBy(campaigns, function(campaign) {
          return campaign.createdAt;
        });
        return _.filter(campaigns, (campaign) => {
            return !_.isUndefined(campaign.summary) && campaign.summary.status === "launched";
        });
    }

    @computed get finishedCampaigns() {
        let campaigns = this.preparedCampaigns;
        campaigns = _.sortBy(campaigns, function(campaign) {
          return campaign.createdAt;
        }).reverse();
        return _.filter(campaigns, (campaign) => {
            return !_.isUndefined(campaign.summary) && (campaign.summary.status === "finished" || campaign.summary.status === "cancelled");
        });
    }

    @computed get lastActiveTufCampaigns() {
        let campaigns = this.runningCampaigns;
        campaigns = _.sortBy(campaigns, function(campaign) {
          return campaign.createdAt;
        }).reverse();
        return campaigns.slice(0, 10);
    }

    @computed get overallCampaignStatistics() {
        let stats = {
            processed: 0,
            affected: 0,
            finished: 0,
            queued: 0,
            successful: 0,
            notImpacted: 0,
            failed: 0,
            cancelled: 0,
        };
        _.each(this.campaign.statistics.stats, (statistic) => {
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
}