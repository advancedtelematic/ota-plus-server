import React, { PropTypes, Component } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Loader, DependenciesModal } from '../partials';
import { resetAsync } from '../utils/Common';
import { 
    CampaignsTooltip, 
    CampaignsRenameModal,
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
    @observable tooltipShown = false;
    @observable renameModalShown = false;
    @observable campaignIdToAction = null;
    @observable cancelGroupModalShown = false;
    @observable cancelCampaignModalShown = false;
    @observable updateRequestToCancel = {};
    @observable dependenciesModalShown = false;
    @observable activeCampaign = null;

    constructor(props) {
        super(props);
        this.showTooltip = this.showTooltip.bind(this);
        this.hideTooltip = this.hideTooltip.bind(this);
        this.hideRenameModal = this.hideRenameModal.bind(this);
        this.changeSort = this.changeSort.bind(this);
        this.changeFilter = this.changeFilter.bind(this);
        this.showWizard = this.showWizard.bind(this);
        this.showRenameModal = this.showRenameModal.bind(this);
        this.showCancelGroupModal = this.showCancelGroupModal.bind(this);
        this.hideCancelGroupModal = this.hideCancelGroupModal.bind(this);
        this.showCancelCampaignModal = this.showCancelCampaignModal.bind(this);
        this.hideCancelCampaignModal = this.hideCancelCampaignModal.bind(this);
        this.showDependenciesModal = this.showDependenciesModal.bind(this);
        this.hideDependenciesModal = this.hideDependenciesModal.bind(this);
    }
    showWizard(campaignId) {
        this.campaignIdToAction = campaignId;
    }
    showRenameModal(campaignId, e) {
        if(e) e.preventDefault();
        this.renameModalShown = true;
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
    showTooltip(e) {
        if(e) e.preventDefault();
        this.tooltipShown = true;
    }
    hideTooltip(e) {
        if(e) e.preventDefault();
        this.tooltipShown = false;
    }
    hideRenameModal(e) {
        if(e) e.preventDefault();
        this.renameModalShown = false;
        this.campaignIdToAction = null;
        resetAsync(this.props.campaignsStore.campaignsRenameAsync);
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
                {campaignsStore.campaignsFetchAsync.isFetching || campaignsStore.campaignsLegacyFetchAsync.isFetching ?
                    <div className="wrapper-center">
                        <Loader />
                    </div>
                : campaignsStore.overallCampaignsCount + campaignsStore.overallLegacyCampaignsCount ?
                    <CampaignsList
                        campaignsStore={campaignsStore}
                        groupsStore={groupsStore}
                        addNewWizard={addNewWizard}
                        showWizard={this.showWizard}
                        showRenameModal={this.showRenameModal}
                        otaPlusMode={otaPlusMode}
                        highlightedCampaign={highlightedCampaign}
                        showCancelCampaignModal={this.showCancelCampaignModal}
                        showCancelGroupModal={this.showCancelGroupModal}
                        showDependenciesModal={this.showDependenciesModal}
                    />
                :
                    <div className="wrapper-center">
                        <div className="page-intro">
                            <div>You haven't created any update campaigns yet.</div>
                            <div>
                                <FlatButton
                                    label="Add new campaign"
                                    id="add-new-campaign"
                                    type="button"
                                    className="btn-main"
                                    onClick={addNewWizard.bind(this, null)}
                                />
                            </div>
                        </div>
                    </div>
                }
                <CampaignsTooltip 
                    shown={this.tooltipShown}
                    hide={this.hideTooltip}
                />
                <CampaignsRenameModal 
                    shown={this.renameModalShown}
                    hide={this.hideRenameModal}
                    campaignsStore={campaignsStore}
                    campaignId={this.campaignIdToAction}
                />
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