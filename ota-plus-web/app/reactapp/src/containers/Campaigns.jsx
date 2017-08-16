import React, { PropTypes, Component } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Loader } from '../partials';
import { resetAsync } from '../utils/Common';
import { 
    CampaignsHeader,
    CampaignsTooltip, 
    CampaignsRenameModal,
    CampaignsListItem
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
        this.showRenameModal = this.showRenameModal.bind(this);
        this.hideRenameModal = this.hideRenameModal.bind(this);
        this.goToDetails = this.goToDetails.bind(this);
        this.changeSort = this.changeSort.bind(this);
        this.changeFilter = this.changeFilter.bind(this);
        this.showWizard = this.showWizard.bind(this);
    }
    showWizard(campaignId) {

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
    showRenameModal(campaignId, e) {
        if(e) e.preventDefault();
        this.renameModalShown = true;
        this.campaignIdToAction = campaignId;
    }
    hideRenameModal(e) {
        if(e) e.preventDefault();
        this.renameModalShown = false;
        this.campaignIdToAction = null;
        resetAsync(this.props.campaignsStore.campaignsRenameAsync);
    }    
    goToDetails(campaignId, e) {
        this.context.router.push(`/campaign/${campaignId}`);
    }
    changeSort(sort, e) {
        if(e) e.preventDefault();
        this.props.campaignsStore._prepareCampaigns(this.props.campaignsStore.campaignsFilter, sort);
    }
    changeFilter(filter) {
        this.props.campaignsStore._prepareCampaigns(filter, this.props.campaignsStore.campaignsSort);
    }
    render() {
        const { campaignsStore, packagesStore, groupsStore, hardwareStore, addNewWizard } = this.props;        
        return (
            <span>
                {(campaignsStore.overallCampaignsCount === null && campaignsStore.campaignsFetchAsync.isFetching) 
                    || (campaignsStore.overallLegacyCampaignsCount === null && campaignsStore.campaignsLegacyFetchAsync.isFetching) ?
                        <div className="wrapper-center">
                            <Loader />
                        </div>
                :
                    campaignsStore.overallCampaignsCount + campaignsStore.overallLegacyCampaignsCount ? 
                        <span>
                            <CampaignsHeader
                                addNewWizard={addNewWizard}
                                campaignsSort={campaignsStore.campaignsSort}
                                changeSort={this.changeSort}
                                campaignsFilter={campaignsStore.campaignsFilter}
                                changeFilter={this.changeFilter}
                            />
                            {campaignsStore.preparedCampaigns.length ?
                                <span className="content-container">
                                    <div className="section-header">
                                        Draft campaigns
                                    </div>
                                    <div className="campaigns-list draft">
                                        {campaignsStore.draftCampaigns.length ?
                                            <span>
                                                <div className="heading">
                                                    <div></div>
                                                    <div className="column">Name</div>
                                                    <div className="column text-center">Created at</div>
                                                    <div className="column text-center">Processed</div>
                                                    <div className="column text-center">Affected</div>
                                                    <div className="column text-center">Finished</div>
                                                    <div className="column text-center">Failure rate</div>
                                                </div>
                                                {_.map(campaignsStore.draftCampaigns, (campaign) => {
                                                    return (
                                                        <CampaignsListItem
                                                            groupsStore={groupsStore}
                                                            goToDetails={this.goToDetails}
                                                            showWizard={this.showWizard}
                                                            addNewWizard={addNewWizard}
                                                            showRenameModal={this.showRenameModal}
                                                            campaign={campaign}
                                                            type="draft"
                                                            key={campaign.id}
                                                        />
                                                    );
                                                })}
                                            </span>
                                        :
                                            <div className="empty">
                                                No draft campaigns.
                                            </div>
                                        }
                                    </div>
                                    <div className="section-header">
                                        In preparation
                                    </div>
                                    <div className="campaigns-list">
                                        {campaignsStore.inPreparationCampaigns.length ?
                                            <span>
                                                <div className="heading">
                                                    <div></div>
                                                    <div className="column">Name</div>
                                                    <div className="column">Created at</div>
                                                    <div className="column">Processed</div>
                                                    <div className="column">Affected</div>
                                                    <div className="column">Finished</div>
                                                    <div className="column">Failure rate</div>
                                                </div>
                                                {_.map(campaignsStore.inPreparationCampaigns, (campaign) => {
                                                    return (
                                                        <CampaignsListItem 
                                                            groupsStore={groupsStore}
                                                            goToDetails={this.goToDetails}
                                                            showWizard={this.showWizard}
                                                            addNewWizard={addNewWizard}
                                                            showRenameModal={this.showRenameModal}
                                                            campaign={campaign}
                                                            type="inPreparation"
                                                            key={campaign.id}
                                                        />
                                                    );
                                                })}
                                            </span>
                                        :
                                            <div className="empty">
                                                No running campaigns.
                                            </div>
                                        }
                                    </div>
                                    <div className="section-header">
                                        Running campaigns
                                    </div>
                                    <div className="campaigns-list">
                                        {campaignsStore.runningCampaigns.length ?
                                            <span>
                                                <div className="heading">
                                                    <div></div>
                                                    <div className="column">Name</div>
                                                    <div className="column">Created at</div>
                                                    <div className="column">Processed</div>
                                                    <div className="column">Affected</div>
                                                    <div className="column">Finished</div>
                                                    <div className="column">Failure rate</div>
                                                </div>
                                                {_.map(campaignsStore.runningCampaigns, (campaign) => {
                                                    return (
                                                        <CampaignsListItem 
                                                            groupsStore={groupsStore}
                                                            goToDetails={this.goToDetails}
                                                            showWizard={this.showWizard}
                                                            addNewWizard={addNewWizard}
                                                            showRenameModal={this.showRenameModal}
                                                            campaign={campaign}
                                                            type="running"
                                                            key={campaign.id}
                                                        />
                                                    );
                                                })}
                                            </span>
                                        :
                                            <div className="empty">
                                                No running campaigns.
                                            </div>
                                        }
                                    </div>
                                    <div className="section-header">
                                        Finished campaigns
                                    </div>
                                    <div className="campaigns-list">
                                        {campaignsStore.finishedCampaigns.length ?
                                            <span>
                                                <div className="heading">
                                                    <div></div>
                                                    <div className="column">Name</div>
                                                    <div className="column">Created at</div>
                                                    <div className="column">Processed</div>
                                                    <div className="column">Affected</div>
                                                    <div className="column">Finished</div>
                                                    <div className="column">Failure rate</div>
                                                </div>
                                                {_.map(campaignsStore.finishedCampaigns, (campaign) => {
                                                    return (
                                                        <CampaignsListItem 
                                                            groupsStore={groupsStore}
                                                            goToDetails={this.goToDetails}
                                                            showWizard={this.showWizard}
                                                            addNewWizard={addNewWizard}
                                                            showRenameModal={this.showRenameModal}
                                                            campaign={campaign}
                                                            type="finished"
                                                            key={campaign.id}
                                                        />
                                                    );
                                                })}
                                            </span>
                                        :
                                            <div className="empty">
                                                No finished campaigns.
                                            </div>
                                        }
                                    </div>
                                </span>
                            : 
                                <span className="content-empty">
                                    <div className="wrapper-center">
                                        No matching campaigns found.
                                    </div>
                                </span>
                            }
                        </span>
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

Campaigns.contextTypes = {
    router: React.PropTypes.object.isRequired
}

Campaigns.propTypes = {
    campaignsStore: PropTypes.object.isRequired,
    packagesStore: PropTypes.object.isRequired,
    groupsStore: PropTypes.object.isRequired,
    hardwareStore: PropTypes.object
}

export default Campaigns;