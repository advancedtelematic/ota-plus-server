import React, { PropTypes, Component } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import moment from 'moment';
import _ from 'underscore';
import { Loader } from '../../../partials';
import CampaignsLegacyListItem from './LegacyListItem';
import { VelocityTransitionGroup } from 'velocity-react';
import CampaignsLegacyStatistics from './Statistics';

@observer
class LegacyList extends Component {
    @observable tmpIntervalId = null;
    @observable expandedCampaignName = null;

    constructor(props) {
        super(props);
        this.toggleCampaign = this.toggleCampaign.bind(this);
    }
    toggleCampaign(campaignName, e) {
        if(e) e.preventDefault();
        this.expandedCampaignName = (this.expandedCampaignName !== campaignName ? campaignName : null);
    }
    startIntervalListScroll() {
        clearInterval(this.tmpIntervalId);
        let intervalId = setInterval(() => {
        }, 10);
        this.tmpIntervalId = intervalId;
    }
    stopIntervalListScroll() {
        clearInterval(this.tmpIntervalId);
        this.tmpIntervalId = null;
    }
    render() {
        const { campaignsStore, groupsStore, showRenameModal, showCancelCampaignModal, showCancelGroupModal } = this.props;
        return (
            <div className="legacy-list">
                <div className="section-header font-medium">
                    Running campaigns
                </div>
                <div className="campaigns-list">
                    {campaignsStore.runningLegacyCampaigns.length ?
                        <span>
                            <div className="heading font-small">
                                <div></div>
                                <div className="column">Name</div>
                                <div className="column">Start date</div>
                                <div className="column">End date</div>
                                <div className="column"></div>
                                <div className="column"></div>
                            </div>
                            {_.map(campaignsStore.runningLegacyCampaigns, (campaign) => {
                                return (
                                    <span key={campaign.id} className="font-small">
                                        <CampaignsLegacyListItem 
                                            toggleCampaign={this.toggleCampaign}
                                            showRenameModal={showRenameModal}
                                            campaign={campaign}
                                            key={campaign.id}
                                        />
                                        <VelocityTransitionGroup 
                                            enter={{
                                                animation: "slideDown",
                                                begin: () => {this.startIntervalListScroll();},
                                                complete: () => {this.stopIntervalListScroll();}
                                            }}
                                            leave={{
                                                animation: "slideUp",
                                                begin: () => {this.startIntervalListScroll();},
                                                complete: () => {this.stopIntervalListScroll();}
                                            }}
                                        >
                                            {this.expandedCampaignName === campaign.name ?
                                                <CampaignsLegacyStatistics 
                                                    campaignsStore={campaignsStore}
                                                    groupsStore={groupsStore}
                                                    showCancelCampaignModal={showCancelCampaignModal}
                                                    showCancelGroupModal={showCancelGroupModal}
                                                    campaignId={campaign.id}
                                                />
                                            :
                                                null
                                            }
                                        </VelocityTransitionGroup>
                                    </span>
                                );
                            })}
                        </span>
                    :
                        <div className="empty font-small">
                            No running campaigns.
                        </div>
                    }
                </div>
                <div className="section-header font-medium">
                    Finished campaigns
                </div>
                <div className="campaigns-list">
                    {campaignsStore.finishedLegacyCampaigns.length ?
                        <span>
                            <div className="heading font-small">
                                <div></div>
                                <div className="column">Name</div>
                                <div className="column">Start date</div>
                                <div className="column">End date</div>
                                <div className="column"></div>
                                <div className="column"></div>
                            </div>
                            {_.map(campaignsStore.finishedLegacyCampaigns, (campaign) => {
                                return (
                                    <span key={campaign.id} className="font-small">
                                        <CampaignsLegacyListItem 
                                            toggleCampaign={this.toggleCampaign}
                                            showRenameModal={showRenameModal}
                                            campaign={campaign}
                                            key={campaign.id}
                                        />
                                        <VelocityTransitionGroup 
                                            enter={{
                                                animation: "slideDown",
                                                begin: () => {this.startIntervalListScroll();},
                                                complete: () => {this.stopIntervalListScroll();}
                                            }}
                                            leave={{
                                                animation: "slideUp",
                                                begin: () => {this.startIntervalListScroll();},
                                                complete: () => {this.stopIntervalListScroll();}
                                            }}
                                        >
                                            {this.expandedCampaignName === campaign.name ?
                                                <CampaignsLegacyStatistics 
                                                    campaignsStore={campaignsStore}
                                                    groupsStore={groupsStore}
                                                    showCancelCampaignModal={showCancelCampaignModal}
                                                    showCancelGroupModal={showCancelGroupModal}
                                                    campaignId={campaign.id}
                                                />
                                            :
                                                null
                                            }
                                        </VelocityTransitionGroup>
                                    </span>
                                );
                            })}
                        </span>
                    :
                        <div className="empty font-small">
                            No finished campaigns.
                        </div>
                    }
                </div>
            </div>
        );
    }
}

LegacyList.propTypes = {
}

export default LegacyList;