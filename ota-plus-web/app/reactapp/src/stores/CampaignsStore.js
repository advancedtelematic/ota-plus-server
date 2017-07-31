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
    @observable campaignsMultiTargetUpdateCreateAsync = {};
    @observable campaigns = [];
    @observable preparedCampaigns = [];
    @observable overallCampaignsCount = null;
    @observable campaignsFilter = '';
    @observable campaignsSort = 'asc';
    @observable campaign = {};
    @observable campaignData = {};

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
        return axios.put(API_CAMPAIGNS_RENAME + '/' + id, data)
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
        resetAsync(this.campaignsMultiTargetUpdateCreateAsync);
        this.campaigns = [];
        this.preparedCampaigns = [];
        this.overallCampaignsCount = null;
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
            return campaign.summary.status === "prepared";
        });
    }

    @computed get inPreparationCampaigns() {
        return _.filter(this.preparedCampaigns, (campaign) => {
            return campaign.summary.status === "scheduled";
        });
    }

    @computed get runningCampaigns() {
        return _.filter(this.preparedCampaigns, (campaign) => {
            return campaign.summary.status === "launched";
        });
    }

    @computed get finishedCampaigns() {
        return _.filter(this.preparedCampaigns, (campaign) => {
            return campaign.summary.status === "finished" || campaign.summary.status === "cancelled";
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
        let stats = {
            processed: 0,
            affected: 0,
            finished: 0,
            queued: 0,
            successful: 0,
            notImpacted: 0,
            failed: 0
        };
        if(!this.campaignsOneFetchAsync.isFetching && !this.campaignsOneStatisticsFetchAsync.isFetching) {
            _.each(this.campaign.statistics.stats, (statistic) => {
                stats.affected += statistic.affected;
                stats.processed += statistic.processed;
            });
            stats.notImpacted = stats.processed - stats.affected;
            stats.finished = stats.finished;
            stats.queued = stats.affected - stats.finished;
            stats.failed = this.campaign.statistics.failed.length;
            stats.successful = stats.finished - stats.failed;
        }
        return stats;
    }

}