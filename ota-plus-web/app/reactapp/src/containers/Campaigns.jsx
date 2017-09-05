import React, { PropTypes, Component } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Loader } from '../partials';
import { resetAsync } from '../utils/Common';
import { 
    CampaignsTooltip, 
    CampaignsRenameModal,
    CampaignsList,
} from '../components/campaigns';
import { FlatButton } from 'material-ui';
import _ from 'underscore';

@observer
class Campaigns extends Component {
    @observable tooltipShown = false;
    @observable renameModalShown = false;
    @observable campaignIdToAction = null;

    constructor(props) {
        super(props);
        this.showTooltip = this.showTooltip.bind(this);
        this.hideTooltip = this.hideTooltip.bind(this);
        this.hideRenameModal = this.hideRenameModal.bind(this);
        this.changeSort = this.changeSort.bind(this);
        this.changeFilter = this.changeFilter.bind(this);
        this.showWizard = this.showWizard.bind(this);
        this.showRenameModal = this.showRenameModal.bind(this);
    }
    showWizard(campaignId) {
        this.campaignIdToAction = campaignId;
    }
    showRenameModal(campaignId, e) {
        if(e) e.preventDefault();
        this.renameModalShown = true;
        this.campaignIdToAction = campaignId;
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
        const { campaignsStore, packagesStore, groupsStore, hardwareStore, addNewWizard, goToCampaignDetails, otaPlusMode } = this.props;
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
                        goToCampaignDetails={goToCampaignDetails}
                        otaPlusMode={otaPlusMode}
                    />
                :
                    <div className="wrapper-center">
                        <div className="page-intro">
                            <div>You haven't created any update campaigns yet.</div>
                            <div>
                                <FlatButton
                                    label="Add new campaign"
                                    type="button"
                                    className="btn-main"
                                    onClick={addNewWizard.bind(this, null)}
                                />
                            </div>
                            <a href="#" onClick={this.showTooltip}>What is this?</a>
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