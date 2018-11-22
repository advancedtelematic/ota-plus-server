import React, { PropTypes, Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { DependenciesModal } from '../partials';
import { resetAsync } from '../utils/Common';
import {
    CampaignsContentPanel,
} from '../components/campaigns';
import {
    CampaignCancelCampaignModal,
    CampaignCancelGroupModal
} from '../components/campaign';
import _ from 'underscore';
import { _contains } from "../utils/Collection";

@inject("stores")
@observer
export default class Campaigns extends Component {
    @observable cancelGroupModalShown = false;
    @observable cancelCampaignModalShown = false;
    @observable updateRequestToCancel = {};
    @observable dependenciesModalShown = false;
    @observable activeCampaign = null;

    @observable expandedCampaigns = [];

    static propTypes = {
        activeTab: PropTypes.string.isRequired,
        switchTab: PropTypes.func.isRequired,
        highlight: PropTypes.string,
    };

    constructor(props) {
        super(props);
        this.changeSort = this.changeSort.bind(this);
        this.changeFilter = this.changeFilter.bind(this);
        this.showWizard = this.showWizard.bind(this);
        this.showCancelGroupModal = this.showCancelGroupModal.bind(this);
        this.hideCancelGroupModal = this.hideCancelGroupModal.bind(this);
        this.showCancelCampaignModal = this.showCancelCampaignModal.bind(this);
        this.hideCancelCampaignModal = this.hideCancelCampaignModal.bind(this);
        this.showDependenciesModal = this.showDependenciesModal.bind(this);
        this.hideDependenciesModal = this.hideDependenciesModal.bind(this);
    }

    toggle = (campaign) => {
        if (!_.isEqual(this.expandedCampaigns.pop(), campaign)) {
            this.expandedCampaigns.push(campaign);
        }
    };

    showWizard(campaignId) {
        this.campaignIdToAction = campaignId;
    }

    showCancelGroupModal(updateRequest, e) {
        if (e) e.preventDefault();
        this.cancelGroupModalShown = true;
        this.updateRequestToCancel = updateRequest;
    }

    hideCancelGroupModal(e) {
        if (e) e.preventDefault();
        const { campaignsStore } = this.props.stores;
        this.cancelGroupModalShown = false;
        this.updateRequestToCancel = {};
        resetAsync(campaignsStore.campaignsCancelRequestAsync);
    }

    showCancelCampaignModal(e) {
        if (e) e.preventDefault();
        this.cancelCampaignModalShown = true;
    }

    hideCancelCampaignModal(e) {
        if (e) e.preventDefault();
        const { campaignsStore } = this.props.stores;
        this.cancelCampaignModalShown = false;
        resetAsync(campaignsStore.campaignsCancelAsync);
    }

    showDependenciesModal(activeCampaign, e) {
        if (e) e.preventDefault();
        this.dependenciesModalShown = true;
        this.activeCampaign = activeCampaign;
    }

    hideDependenciesModal(e) {
        if (e) e.preventDefault();
        this.dependenciesModalShown = false;
        this.activeCampaign = null;
    }

    changeSort(sort, e) {
        if (e) e.preventDefault();
        const { campaignsStore } = this.props.stores;
        campaignsStore._prepareCampaigns(campaignsStore.campaignsFilter, sort);
    }

    changeFilter(filter) {
        const { campaignsStore } = this.props.stores;
        campaignsStore._prepareCampaigns(filter, campaignsStore.campaignsSort);
    }

    render() {
        const { addNewWizard, highlight, activeTab, switchTab } = this.props;

        return (
            <span>
                <CampaignsContentPanel
                    status={ activeTab }
                    highlight={ highlight }
                    expandedCampaigns={ this.expandedCampaigns }
                    toggleCampaign={ this.toggle }
                    addNewWizard={ addNewWizard }
                    showWizard={ this.showWizard }
                    showCancelCampaignModal={ this.showCancelCampaignModal }
                    showDependenciesModal={ this.showDependenciesModal }
                />
                <CampaignCancelCampaignModal
                    shown={ this.cancelCampaignModalShown }
                    hide={ this.hideCancelCampaignModal }
                    switchTab={ switchTab }
                />
                <CampaignCancelGroupModal
                    shown={ this.cancelGroupModalShown }
                    hide={ this.hideCancelGroupModal }
                    updateRequest={ this.updateRequestToCancel }
                />
                {
                    this.dependenciesModalShown &&
                        <DependenciesModal
                            shown={ this.dependenciesModalShown }
                            hide={ this.hideDependenciesModal }
                            activeItemName={ this.activeCampaign }
                        />
                }
            </span>
        );
    }
}
