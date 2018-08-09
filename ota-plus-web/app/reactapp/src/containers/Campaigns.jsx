import React, { PropTypes, Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Loader, DependenciesModal } from '../partials';
import { resetAsync } from '../utils/Common';
import { 
    CampaignsContentPanel,
} from '../components/campaigns';
import { 
    CampaignCancelCampaignModal,
    CampaignCancelGroupModal
} from '../components/campaign';
import { FlatButton } from 'material-ui';
import _ from 'underscore';

@inject("stores")
@observer
class Campaigns extends Component {
    @observable cancelGroupModalShown = false;
    @observable cancelCampaignModalShown = false;
    @observable updateRequestToCancel = {};
    @observable dependenciesModalShown = false;
    @observable activeCampaign = null;

    @observable prevExpandedCampaignName = null;
    @observable expandedCampaignName = null;

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
        this.toggleCampaign = this.toggleCampaign.bind(this);
    }
    toggleCampaign(campaignName, e) {
        if(e) e.preventDefault();
        this.prevExpandedCampaignName = this.expandedCampaignName;
        this.expandedCampaignName = null;
        let that = this;
        setTimeout(() => {
            that.expandedCampaignName = (campaignName !== that.prevExpandedCampaignName) ? campaignName : null;
        }, 400);
    }
    showWizard(campaignId) {
        this.campaignIdToAction = campaignId;
    }
    showCancelGroupModal(updateRequest, e) {
        if(e) e.preventDefault();
        this.cancelGroupModalShown = true;
        this.updateRequestToCancel = updateRequest;
    }
    hideCancelGroupModal(e) {
        if(e) e.preventDefault();
        const { campaignsStore } = this.props.stores;
        this.cancelGroupModalShown = false;
        this.updateRequestToCancel = {};
        resetAsync(campaignsStore.campaignsCancelRequestAsync);
    }
    showCancelCampaignModal(e) {
        if(e) e.preventDefault();
        this.cancelCampaignModalShown = true;
    }
    hideCancelCampaignModal(e) {
        if(e) e.preventDefault();
        const { campaignsStore } = this.props.stores;
        this.cancelCampaignModalShown = false;
        resetAsync(campaignsStore.campaignsCancelAsync);
    }
    showDependenciesModal(activeCampaign, e) {
        if(e) e.preventDefault();
        this.dependenciesModalShown = true;
        this.activeCampaign = activeCampaign;
    }
    hideDependenciesModal(e) {
        if(e) e.preventDefault();
        this.dependenciesModalShown = false;
        this.activeCampaign = null;
    }
    changeSort(sort, e) {
        if(e) e.preventDefault();
        const { campaignsStore } = this.props.stores;
        campaignsStore._prepareCampaigns(campaignsStore.campaignsFilter, sort);
    }
    changeFilter(filter) {
        const { campaignsStore } = this.props.stores;
        campaignsStore._prepareCampaigns(filter, campaignsStore.campaignsSort);
    }
    render() {
        const { addNewWizard, highlightedCampaign } = this.props;
        const { campaignsStore } = this.props.stores;
        return (
            <span>
                {campaignsStore.campaignsFetchAsync.isFetching ?
                    <div className="wrapper-center">
                        <Loader />
                    </div>
                : campaignsStore.overallCampaignsCount ?
                    <CampaignsContentPanel
                        addNewWizard={addNewWizard}
                        showWizard={this.showWizard}
                        highlightedCampaign={highlightedCampaign}
                        showCancelCampaignModal={this.showCancelCampaignModal}
                        showDependenciesModal={this.showDependenciesModal}
                        expandedCampaignName={this.expandedCampaignName}
                        toggleCampaign={this.toggleCampaign}
                    />
                :
                    <div className="wrapper-center">
                        <div className="page-intro">
                            <div>
                                <img src="/assets/img/icons/white/campaigns.svg" alt="Icon" />
                            </div>
                            <div>
                                You haven't created any update campaigns yet.
                            </div>
                            <div>
                                <a href="#" className="add-button light" id="add-new-campaign" onClick={(e) => { e.preventDefault(); addNewWizard() }} >
                                    <span>
                                        +
                                    </span>
                                    <span>
                                        Add new campaign
                                    </span>
                                </a>
                            </div>
                        </div>
                    </div>
                }
                <CampaignCancelCampaignModal
                    shown={this.cancelCampaignModalShown}
                    hide={this.hideCancelCampaignModal}
                />
                <CampaignCancelGroupModal
                    shown={this.cancelGroupModalShown}
                    hide={this.hideCancelGroupModal}
                    updateRequest={this.updateRequestToCancel}
                />
                {this.dependenciesModalShown ?
                    <DependenciesModal 
                        shown={this.dependenciesModalShown}
                        hide={this.hideDependenciesModal}
                        activeItemName={this.activeCampaign}
                    />
                :
                    null
                }
            </span>
        );
    }
}

Campaigns.propTypes = {
    stores: PropTypes.object,
}

export default Campaigns;