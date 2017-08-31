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
    @observable campaignsLegacyFetchAsync = {};
    @observable campaignsLegacySafeFetchAsync = {};
    @observable campaignsOneFetchAsync = {};
    @observable campaignsOneSafeFetchAsync = {};
    @observable campaignsOneStatisticsFetchAsync = {};
    @observable campaignsOneSafeStatisticsFetchAsync = {};
    @observable campaignsCreateAsync = {};
    @observable campaignsLegacyCreateAsync = {};
    @observable campaignsLaunchAsync = {};
    @observable campaignsLegacyLaunchAsync = {};
    @observable campaignsPackageSaveAsync = {};
    @observable campaignsGroupsSaveAsync = {};
    @observable campaignsRenameAsync = {};
    @observable campaignsCancelAsync = {};
    @observable campaignsCancelRequestAsync = {};
    @observable campaignsMultiTargetUpdateCreateAsync = {};
    @observable campaigns = [];
    @observable preparedCampaigns = [];
    @observable preparedLegacyCampaigns = [];
    @observable overallCampaignsCount = null;
    @observable overallLegacyCampaignsCount = null;
    @observable campaignsFilter = '';
    @observable campaignsSort = 'asc';
    @observable campaign = {};
    @observable campaignData = {};

    constructor() {
        resetAsync(this.campaignsFetchAsync);
        resetAsync(this.campaignsSafeFetchAsync);
        resetAsync(this.campaignsLegacyFetchAsync);
        resetAsync(this.campaignsLegacySafeFetchAsync);
        resetAsync(this.campaignsOneFetchAsync);
        resetAsync(this.campaignsOneSafeFetchAsync);
        resetAsync(this.campaignsOneStatisticsFetchAsync);
        resetAsync(this.campaignsOneSafeStatisticsFetchAsync);
        resetAsync(this.campaignsCreateAsync);
        resetAsync(this.campaignsLegacyCreateAsync);
        resetAsync(this.campaignsPackageSaveAsync);
        resetAsync(this.campaignsGroupsSaveAsync);
        resetAsync(this.campaignsLaunchAsync);
        resetAsync(this.campaignsLegacyLaunchAsync);
        resetAsync(this.campaignsRenameAsync);
        resetAsync(this.campaignsCancelAsync);
        resetAsync(this.campaignsCancelRequestAsync);
        resetAsync(this.campaignsMultiTargetUpdateCreateAsync);
    }

    createMultiTargetUpdate(data) {
        let updateObject = this._prepareUpdateObject(data);
        resetAsync(this.campaignsMultiTargetUpdateCreateAsync, true);
        return axios.post(API_GET_MULTI_TARGET_UPDATE_INDENTIFIER, updateObject)
            .then((response) => {
                this.campaignData.mtuId = response.data;
                this.campaignsMultiTargetUpdateCreateAsync = handleAsyncSuccess(response);
            })
            .catch((error) => {
                this.campaignsMultiTargetUpdateCreateAsync = handleAsyncError(error);
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

    fetchLegacyCampaigns(async = 'campaignsLegacyFetchAsync') {
        resetAsync(this[async], true);
        return axios.get(API_CAMPAIGNS_LEGACY_FETCH)
            .then(function (response) {
                let campaigns = response.data;
                if(campaigns.length) {
                    let after = _.after(campaigns.length, () => {
                        this.legacyCampaigns = campaigns;
                        this._prepareCampaigns();
                        this.overallLegacyCampaignsCount = campaigns.length;
                        this[async] = handleAsyncSuccess(response);
                    }, this);
                    _.each(campaigns, (campaign, index) => {
                        if(campaign.status === "Active")
                            axios.get(API_CAMPAIGNS_LEGACY_CAMPAIGN_STATISTICS + '/' + campaign.id + '/statistics')
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
                    this.legacyCampaigns = campaigns;
                    this._prepareCampaigns(this.campaignsFilter, this.campaignsSort);
                    this.overallLegacyCampaignsCount = campaigns.length;
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
                this.fetchLegacyCampaign(id, mainAsync, statsAsync);
            }.bind(this));
    }

    fetchLegacyCampaign(id, mainAsync = 'campaignsOneFetchAsync', statsAsync = 'campaignsOneStatisticsFetchAsync') {
        resetAsync(this[mainAsync], true);
        return axios.get(API_CAMPAIGNS_LEGACY_INDIVIDUAL_FETCH + '/' + id)
            .then(function (response) {
                resetAsync(this[statsAsync], true);
                this[mainAsync] = handleAsyncSuccess(response);
                axios.get(API_CAMPAIGNS_LEGACY_CAMPAIGN_STATISTICS + '/' + id + '/statistics')
                    .then(function (resp) {
                        let data = response.data;
                        data.statistics = resp.data;
                        this.campaign = {
                            ...data,
                            isLegacy: true
                        };
                        this[statsAsync] = handleAsyncSuccess(resp);
                    }.bind(this))
                    .catch(function (err) {
                        this[statsAsync] = handleAsyncError(err);
                    }.bind(this));
            }.bind(this))
            .catch(function (error) {
                this[mainAsync] = handleAsyncError(error);
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

    createLegacyCampaign(data) {
        resetAsync(this.campaignsLegacyCreateAsync, true);
        return axios.post(API_CAMPAIGNS_LEGACY_CREATE, data)
            .then(function (response) {
                this.campaignData.campaignId = response.data;
                this.campaignsLegacyCreateAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function (error) {
                this.campaignsLegacyCreateAsync = handleAsyncError(error);
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
                this.fetchCampaigns('campaignsSafeFetchAsync');
                this.campaignsLaunchAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function (error) {
                this.campaignsLaunchAsync = handleAsyncError(error);
            }.bind(this));
    }

    launchLegacyCampaign(id) {
        resetAsync(this.campaignsLegacyLaunchAsync, true);
        return axios.post(API_CAMPAIGNS_LEGACY_LAUNCH + '/' + id + '/launch')
            .then(function (response) {
                this.fetchLegacyCampaigns('campaignsLegacySafeFetchAsync');
                this.campaignsLegacyLaunchAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function (error) {
                this.campaignsLegacyLaunchAsync = handleAsyncError(error);
            }.bind(this));
    }

    renameCampaign(id, data) {
        resetAsync(this.campaignsRenameAsync, true);
        return axios.put(API_CAMPAIGNS_RENAME + '/' + id, data)
            .then(function (response) {
                this.campaignsRenameAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function (error) {
                this.campaignsRenameAsync = handleAsyncError(error);
            }.bind(this));
    }

    renameLegacyCampaign(id, data) {
        resetAsync(this.campaignsRenameAsync, true);
        return axios.put(API_CAMPAIGNS_LEGACY_RENAME + '/' + id + '/name', data)
            .then(function (response) {
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

    cancelLegacyCampaign(id) {
        resetAsync(this.campaignsCancelAsync, true);
        return axios.put(API_CAMPAIGNS_LEGACY_CANCEL + '/' + id + '/cancel')
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
        let legacyCampaigns = this.legacyCampaigns;
        this.preparedCampaigns = campaigns.sort((a, b) => {
          let aName = a.name;
          let bName = b.name;
            return aName.localeCompare(bName);
        });
        this.preparedLegacyCampaigns = legacyCampaigns.sort((a, b) => {
          let aName = a.name;
          let bName = b.name;
            return aName.localeCompare(bName);
        });
    }

    _getCampaign(id) {
        let campaign = null;
        campaign = this._getTufCampaign(id);
        if(!campaign) {
            campaign = this._getLegacyCampaign(id);
            campaign.isLegacy = true;
        }
        return campaign;
    }

    _getTufCampaign(id) {
        return _.findWhere(this.campaigns, {id: id});
    }

    _getLegacyCampaign(id) {
        return _.findWhere(this.legacyCampaigns, {id: id});
    }

    _updateLegacyCampaignData(id, data) {
        let legacyCampaign = this._getLegacyCampaign(id);
        _.each(data, (value, attr) => {
            legacyCampaign[attr] = value;
        });
        this._prepareCampaigns();
    }

    _updateTufCampaignData(id, data) {
        let campaign = this._getTufCampaign(id);
        _.each(data, (value, attr) => {
            campaign[attr] = value;
        });
       this._prepareCampaigns();
    }

    _resetWizard() {
        resetAsync(this.campaignsOneFetchAsync);
        resetAsync(this.campaignsOneSafeFetchAsync);
        resetAsync(this.campaignsOneStatisticsFetchAsync);
        resetAsync(this.campaignsOneSafeStatisticsFetchAsync);
        resetAsync(this.campaignsPackageSaveAsync);
        resetAsync(this.campaignsGroupsSaveAsync);
        resetAsync(this.campaignsLaunchAsync);
        resetAsync(this.campaignsLegacyLaunchAsync);
        this.campaign = {};
    }

    _reset() {
        resetAsync(this.campaignsFetchAsync);
        resetAsync(this.campaignsSafeFetchAsync);
        resetAsync(this.campaignsLegacyFetchAsync);
        resetAsync(this.campaignsLegacySafeFetchAsync);
        resetAsync(this.campaignsOneFetchAsync);
        resetAsync(this.campaignsOneSafeFetchAsync);
        resetAsync(this.campaignsOneStatisticsFetchAsync);
        resetAsync(this.campaignsOneSafeStatisticsFetchAsync);
        resetAsync(this.campaignsCreateAsync);
        resetAsync(this.campaignsLegacyCreateAsync);
        resetAsync(this.campaignsPackageSaveAsync);
        resetAsync(this.campaignsGroupsSaveAsync);
        resetAsync(this.campaignsLaunchAsync);
        resetAsync(this.campaignsLegacyLaunchAsync);
        resetAsync(this.campaignsRenameAsync);
        resetAsync(this.campaignsCancelAsync);
        resetAsync(this.campaignsCancelRequestAsync);
        resetAsync(this.campaignsMultiTargetUpdateCreateAsync);
        this.campaigns = [];
        this.preparedCampaigns = [];
        this.preparedLegacyCampaigns = [];
        this.overallCampaignsCount = null;
        this.overallLegacyCampaignsCount = null;
        this.campaignsFilter = null;
        this.campaignsSort = 'asc';
        this.campaign = {};
        this.campaignData = {};
        this.camapignMultiTargetUpdateIdentifier = null;
    }

    @computed get inPreparationCampaigns() {
        return _.filter(this.preparedCampaigns, (campaign) => {
            return !_.isUndefined(campaign.summary) && campaign.summary.status === "scheduled";
        });
    }

    @computed get runningCampaigns() {
        return _.filter(this.preparedCampaigns, (campaign) => {
            return !_.isUndefined(campaign.summary) && campaign.summary.status === "launched";
        });
    }

    @computed get runningLegacyCampaigns() {
        return _.filter(this.preparedLegacyCampaigns, (campaign) => {
            return campaign.status === "Active" && campaign.summary.overallDevicesCount !== campaign.summary.overallUpdatedDevicesCount
        });
    }

    @computed get finishedCampaigns() {
        return _.filter(this.preparedCampaigns, (campaign) => {
            return !_.isUndefined(campaign.summary) && (campaign.summary.status === "finished" || campaign.summary.status === "cancelled");
        });
    }

    @computed get finishedLegacyCampaigns() {
        return _.filter(this.preparedLegacyCampaigns, (campaign) => {
            return campaign.status === "Active" && campaign.summary.overallDevicesCount === campaign.summary.overallUpdatedDevicesCount;
        });
    }

    @computed get lastActiveCampaigns() {
        let campaigns = this.runningCampaigns;
        _.sortBy(campaigns, function(campaign) {
          return campaign.createdAt;
        }).reverse()
        return campaigns.slice(0,10);
    }

    @computed get overallCampaignStatistics() {
        if(this.campaign.isLegacy) {
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
        } else {
            let stats = {
                processed: 0,
                affected: 0,
                finished: 0,
                queued: 0,
                successful: 0,
                notImpacted: 0,
                failed: 0
            };
            _.each(this.campaign.statistics.stats, (statistic) => {
                stats.affected += statistic.affected;
                stats.processed += statistic.processed;
            });
            stats.notImpacted = stats.processed - stats.affected;
            stats.finished = this.campaign.statistics.finished;
            stats.queued = stats.affected - stats.finished;
            stats.failed = this.campaign.statistics.failed.length;
            stats.successful = stats.finished - stats.failed;
            
            return stats;
        }
    }
}