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
    API_CAMPAIGNS_LEGACY_RENAME
} from '../config';
import { 
    resetAsync, 
    handleAsyncSuccess, 
    handleAsyncError 
} from '../utils/Common';
import _ from 'underscore';

export default class CampaignsStore {

    @observable campaignsFetchAsync = {};
    @observable campaignsLegacyFetchAsync = {};
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
    @observable overallCampaignsCount = null;
    @observable overallLegacyCampaignsCount = null;
    @observable campaignsFilter = '';
    @observable campaignsSort = 'asc';
    @observable campaign = {};
    @observable campaignData = {};

    constructor() {
        resetAsync(this.campaignsFetchAsync);
        resetAsync(this.campaignsLegacyFetchAsync);
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

    fetchCampaigns() {
        resetAsync(this.campaignsFetchAsync, true);
        return axios.get(API_CAMPAIGNS_FETCH)
            .then(function (response) {
                let campaignIds = response.data.values;
                let that = this;
                if(campaignIds.length) {
                    let after = _.after(campaignIds.length, () => {
                        let afterStats = _.after(this.campaigns.length, () => {
                            this.overallCampaignsCount = response.data.total;
                            this._prepareCampaigns(this.campaignsFilter, this.campaignsSort);
                            this.campaignsFetchAsync = handleAsyncSuccess(response);
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
                    this.campaignsFetchAsync = handleAsyncSuccess(response);
                }
            }.bind(this))
            .catch(function (error) {
                this.campaignsFetchAsync = handleAsyncError(error);
            }.bind(this));    
    }

    fetchLegacyCampaigns() {
        resetAsync(this.campaignsLegacyFetchAsync, true);
        return axios.get(API_CAMPAIGNS_LEGACY_FETCH)
            .then(function (response) {
                let campaigns = response.data;
                if(campaigns.length) {
                    let after = _.after(campaigns.length, () => {
                        this.legacyCampaigns = campaigns;
                        this._prepareCampaigns(this.campaignsFilter, this.campaignsSort);
                        this.overallLegacyCampaignsCount = campaigns.length;
                        this.campaignsLegacyFetchAsync = handleAsyncSuccess(response);
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
                    this.campaignsLegacyFetchAsync = handleAsyncSuccess(response);
                }
            }.bind(this))
            .catch(function (error) {
                this.campaignsLegacyFetchAsync = handleAsyncError(error);
            }.bind(this));    
    }

    fetchCampaign(id) {
        resetAsync(this.campaignsOneFetchAsync, true);
        return axios.get(API_CAMPAIGNS_INDIVIDUAL_FETCH + '/' + id)
            .then(function (response) {
                resetAsync(this.campaignsOneStatisticsFetchAsync, true);
                this.campaignsOneFetchAsync = handleAsyncSuccess(response);
                axios.get(API_CAMPAIGNS_CAMPAIGN_STATISTICS + '/' + id + '/stats')
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
                this.fetchLegacyCampaign(id);
            }.bind(this));
    }

    fetchCampaignSafe(id) {
        resetAsync(this.campaignsOneSafeFetchAsync, true);
        return axios.get(API_CAMPAIGNS_INDIVIDUAL_FETCH + '/' + id)
            .then(function (response) {
                resetAsync(this.campaignsOneSafeStatisticsFetchAsync, true);
                this.campaignsOneSafeFetchAsync = handleAsyncSuccess(response);
                axios.get(API_CAMPAIGNS_CAMPAIGN_STATISTICS + '/' + id + '/stats')
                    .then(function (resp) {
                        let data = response.data;
                        data.statistics = resp.data;
                        this.campaign = data;
                        this.campaignsOneSafeStatisticsFetchAsync = handleAsyncSuccess(resp);
                    }.bind(this))
                    .catch(function (err) {
                        this.campaignsOneSafeStatisticsFetchAsync = handleAsyncError(err);
                    }.bind(this));
            }.bind(this))
            .catch(function (error) {
                this.fetchLegacyCampaignSafe(id);
            }.bind(this));
    }

    fetchLegacyCampaignSafe(id) {
        resetAsync(this.campaignsOneSafeFetchAsync, true);
        return axios.get(API_CAMPAIGNS_LEGACY_INDIVIDUAL_FETCH + '/' + id)
            .then(function (response) {
                resetAsync(this.campaignsOneSafeStatisticsFetchAsync, true);
                this.campaignsOneSafeFetchAsync = handleAsyncSuccess(response);
                axios.get(API_CAMPAIGNS_LEGACY_CAMPAIGN_STATISTICS + '/' + id + '/statistics')
                    .then(function (resp) {
                        let data = response.data;
                        data.statistics = resp.data;
                        this.campaign = data;
                        this.campaign.isLegacy = true;
                        this.campaignsOneSafeStatisticsFetchAsync = handleAsyncSuccess(resp);
                    }.bind(this))
                    .catch(function (err) {
                        this.campaignsOneSafeStatisticsFetchAsync = handleAsyncError(err);
                    }.bind(this));
            }.bind(this))
            .catch(function (error) {
                this.campaignsOneFetchAsync = handleAsyncError(error);
            }.bind(this));
    }

    fetchLegacyCampaign(id) {
        resetAsync(this.campaignsOneFetchAsync, true);
        return axios.get(API_CAMPAIGNS_LEGACY_INDIVIDUAL_FETCH + '/' + id)
            .then(function (response) {
                resetAsync(this.campaignsOneStatisticsFetchAsync, true);
                this.campaignsOneFetchAsync = handleAsyncSuccess(response);
                axios.get(API_CAMPAIGNS_LEGACY_CAMPAIGN_STATISTICS + '/' + id + '/statistics')
                    .then(function (resp) {
                        let data = response.data;
                        data.statistics = resp.data;
                        this.campaign = {
                            ...data,
                            isLegacy:true
                        };
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
                this.fetchCampaigns();
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
                this.fetchLegacyCampaigns();
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
        let legacyCampaigns = this.legacyCampaigns;
        let mergedCampaigns = [];
        _.each(campaigns, (campaign, index) => {
            mergedCampaigns.push(campaign);
        });
        _.each(legacyCampaigns, (legacyCampaign, index) => {
            legacyCampaign.isLegacy = true;
            mergedCampaigns.push(legacyCampaign);
        });
        if(campaignsFilter)
            mergedCampaigns = _.filter(mergedCampaigns, (campaign) => {
                return campaign.name.indexOf(campaignsFilter) > -1;
            });
        this.preparedCampaigns = mergedCampaigns.sort((a, b) => {
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
       this._prepareCampaigns(this.campaignsFilter, this.campaignsSort);
    }

    _updateTufCampaignData(id, data) {
        let campaign = this._getTufCampaign(id);
        _.each(data, (value, attr) => {
            campaign[attr] = value;
        });
       this._prepareCampaigns(this.campaignsFilter, this.campaignsSort);
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
        resetAsync(this.campaignsLegacyFetchAsync);
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
        this.overallCampaignsCount = null;
        this.overallLegacyCampaignsCount = null;
        this.campaignsFilter = null;
        this.campaignsSort = 'asc';
        this.campaign = {};
        this.campaignData = {};
        this.camapignMultiTargetUpdateIdentifier = null;
    }


    @computed get campaignsCount() {
        return this.campaigns.length;
    }

    @computed get draftCampaigns() {
        return _.filter(this.preparedCampaigns, (campaign) => {
            return (!_.isUndefined(campaign.summary) && campaign.summary.status === "prepared") || campaign.status === "Draft";
        });
    }

    @computed get inPreparationCampaigns() {
        return _.filter(this.preparedCampaigns, (campaign) => {
            return !_.isUndefined(campaign.summary) && campaign.summary.status === "scheduled";
        });
    }

    @computed get runningCampaigns() {
        return _.filter(this.preparedCampaigns, (campaign) => {
            return (!_.isUndefined(campaign.summary) && campaign.summary.status === "launched") 
                || campaign.status === "Active" && campaign.summary.overallDevicesCount !== campaign.summary.overallUpdatedDevicesCount;
        });
    }

    @computed get finishedCampaigns() {
        return _.filter(this.preparedCampaigns, (campaign) => {
            return (!_.isUndefined(campaign.summary) && (campaign.summary.status === "finished" || campaign.summary.status === "cancelled"))
                || campaign.status === "Active" && campaign.summary.overallDevicesCount === campaign.summary.overallUpdatedDevicesCount;
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