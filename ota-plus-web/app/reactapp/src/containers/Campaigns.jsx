import React, { PropTypes, Component } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Loader, DependenciesModal } from '../partials';
import { resetAsync } from '../utils/Common';
import { 
    CampaignsList,
} from '../components/campaigns';
import { 
    CampaignCancelCampaignModal,
    CampaignCancelGroupModal
} from '../components/campaign';
import { FlatButton } from 'material-ui';
import _ from 'underscore';

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
        this.cancelGroupModalShown = false;
        this.updateRequestToCancel = {};
        resetAsync(this.props.campaignsStore.campaignsCancelRequestAsync);
    }
    showCancelCampaignModal(e) {
        if(e) e.preventDefault();
        this.cancelCampaignModalShown = true;
    }
    hideCancelCampaignModal(e) {
        if(e) e.preventDefault();
        this.cancelCampaignModalShown = false;
        resetAsync(this.props.campaignsStore.campaignsCancelAsync);
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
        this.props.campaignsStore._prepareCampaigns(this.props.campaignsStore.campaignsFilter, sort);
    }
    changeFilter(filter) {
        this.props.campaignsStore._prepareCampaigns(filter, this.props.campaignsStore.campaignsSort);
    }
    render() {
        const { campaignsStore, packagesStore, groupsStore, hardwareStore, devicesStore, addNewWizard, otaPlusMode, highlightedCampaign } = this.props;
        return (
            <span>
                {campaignsStore.campaignsFetchAsync.isFetching ?
                    <div className="wrapper-center">
                        <Loader />
                    </div>
                : campaignsStore.overallCampaignsCount ?
                    <CampaignsList
                        campaignsStore={campaignsStore}
                        groupsStore={groupsStore}
                        addNewWizard={addNewWizard}
                        showWizard={this.showWizard}
                        otaPlusMode={otaPlusMode}
                        highlightedCampaign={highlightedCampaign}
                        showCancelCampaignModal={this.showCancelCampaignModal}
                        showCancelGroupModal={this.showCancelGroupModal}
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
                                <a href="#" className="add-button light" id="add-new-campaign" onClick={addNewWizard.bind(this, null)}>
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
                    campaignsStore={campaignsStore}
                    campaign={campaignsStore.campaign}
                />
                <CampaignCancelGroupModal
                    shown={this.cancelGroupModalShown}
                    hide={this.hideCancelGroupModal}
                    campaign={campaignsStore.campaign}
                    campaignsStore={campaignsStore}
                    updateRequest={this.updateRequestToCancel}
                />
                {this.dependenciesModalShown ?
                    <DependenciesModal 
                        shown={this.dependenciesModalShown}
                        hide={this.hideDependenciesModal}
                        activeItemName={this.activeCampaign}
                        packagesStore={packagesStore}
                        campaignsStore={campaignsStore}
                        devicesStore={devicesStore}
                    />
                :
                    null
                }
            </span>
        );
    }
}

Campaigns.propTypes = {
    campaignsStore: PropTypes.object.isRequired,
    packagesStore: PropTypes.object.isRequired,
    groupsStore: PropTypes.object.isRequired,
    hardwareStore: PropTypes.object
}

export default Campaigns;