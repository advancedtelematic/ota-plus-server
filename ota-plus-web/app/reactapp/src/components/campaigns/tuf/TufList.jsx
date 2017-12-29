import React, { PropTypes, Component } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import moment from 'moment';
import _ from 'underscore';
import { Loader } from '../../../partials';
import CampaignsTufListItem from './TufListItem';
import CampaignsTufStatistics from './Statistics';
import { VelocityTransitionGroup } from 'velocity-react';

const headerHeight = 40;

@observer
class TufList extends Component {
    @observable prevExpandedCampaignName = null;
    @observable expandedCampaignName = null;

    constructor(props) {
        super(props);
        this.toggleCampaign = this.toggleCampaign.bind(this);
        this.scrollToElement = this.scrollToElement.bind(this);
    }
    componentDidMount() {
        this.highlightCampaign(this.props.highlightedCampaign);
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.highlightedCampaign !== this.props.highlightedCampaign) {
            this.highlightCampaign(nextProps.highlightedCampaign);
        }
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
    scrollToElement(id) {
        const wrapperPosition = this.refs.list.getBoundingClientRect();
        const elementCoords = document.getElementById("item-" + id).getBoundingClientRect();
        let scrollTo = elementCoords.top - wrapperPosition.top + elementCoords.height;
        let page = document.querySelector('span.content-container');
        setTimeout(() => {
            page.scrollTop = scrollTo;
        }, 400)
    }
    highlightCampaign(id) {
        if(this.refs.list && id) {
            const name = _.filter(this.props.campaignsStore.campaigns, (obj) => {
                return obj.id === id;
            });
            this.expandedCampaignName = name[0].name;
            this.scrollToElement(id);
        }
    }
    render() {
        const { campaignsStore, groupsStore, showRenameModal, highlightedCampaign, showCancelCampaignModal, showDependenciesModal } = this.props;
        return (
            <div className="tuf-list" ref="list">
                <div className="section-header font-medium">
                    In preparation
                </div>
                <div className="campaigns-list" id="in-preparation-campaigns">
                    {campaignsStore.inPreparationCampaigns.length ?
                        <span>
                            <div className="heading font-small">
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
                                    <span key={campaign.id} className="font-small">
                                        <CampaignsTufListItem 
                                            toggleCampaign={this.toggleCampaign}
                                            showRenameModal={showRenameModal}
                                            campaign={campaign}
                                            expandedCampaignName={this.expandedCampaignName}
                                            type="inPreparation"
                                        />
                                        <VelocityTransitionGroup 
                                            enter={{
                                                animation: "slideDown",
                                            }}
                                            leave={{
                                                animation: "slideUp",
                                                duration: 1000
                                            }}
                                        >
                                            {this.expandedCampaignName === campaign.name ?
                                                <CampaignsTufStatistics 
                                                    campaignsStore={campaignsStore}
                                                    groupsStore={groupsStore}
                                                    campaignId={campaign.id}
                                                    showCancelCampaignModal={showCancelCampaignModal}
                                                    showDependenciesModal={showDependenciesModal}
                                                    key={campaign.id}
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
                    Running campaigns
                </div>
                <div className="campaigns-list" id="running-campaigns">
                    {campaignsStore.runningCampaigns.length ?
                        <span>
                            <div className="heading font-small">
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
                                    <span key={campaign.id} className="font-small">
                                        <CampaignsTufListItem 
                                            toggleCampaign={this.toggleCampaign}
                                            showRenameModal={showRenameModal}
                                            campaign={campaign}
                                            expandedCampaignName={this.expandedCampaignName}
                                            type="running"
                                        />
                                        <VelocityTransitionGroup 
                                            enter={{
                                                animation: "slideDown",
                                            }}
                                            leave={{
                                                animation: "slideUp",
                                            }}
                                        >
                                        {this.expandedCampaignName === campaign.name?
                                            <CampaignsTufStatistics
                                                campaignsStore={campaignsStore}
                                                groupsStore={groupsStore}
                                                showCancelCampaignModal={showCancelCampaignModal}
                                                showDependenciesModal={showDependenciesModal}
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
                <div className="campaigns-list" id="finished-campaigns">
                    {campaignsStore.finishedCampaigns.length ?
                        <span>
                            <div className="heading font-small">
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
                                    <span key={campaign.id} className="font-small">
                                        <CampaignsTufListItem 
                                            toggleCampaign={this.toggleCampaign}
                                            showRenameModal={showRenameModal}
                                            campaign={campaign}
                                            expandedCampaignName={this.expandedCampaignName}
                                            type="finished"
                                        />
                                        <VelocityTransitionGroup 
                                            enter={{
                                                animation: "slideDown",
                                            }}
                                            leave={{
                                                animation: "slideUp",
                                            }}
                                        >
                                        {this.expandedCampaignName === campaign.name ?
                                            <CampaignsTufStatistics
                                                campaignsStore={campaignsStore}
                                                groupsStore={groupsStore}
                                                showCancelCampaignModal={showCancelCampaignModal}
                                                showDependenciesModal={showDependenciesModal}
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
                <div className="section-header font-medium">
                    Cancelled campaigns
                </div>
                <div className="campaigns-list" id="cancelled-campaigns">
                    {campaignsStore.cancelledCampaigns.length ?
                        <span>
                            <div className="heading font-small">
                                <div></div>
                                <div className="column">Name</div>
                                <div className="column">Created at</div>
                                <div className="column">Processed</div>
                                <div className="column">Affected</div>
                                <div className="column">Finished</div>
                                <div className="column">Failure rate</div>
                            </div>
                            {_.map(campaignsStore.cancelledCampaigns, (campaign) => {
                                return (
                                    <span key={campaign.id} className="font-small">
                                        <CampaignsTufListItem 
                                            toggleCampaign={this.toggleCampaign}
                                            showRenameModal={showRenameModal}
                                            campaign={campaign}
                                            expandedCampaignName={this.expandedCampaignName}
                                            type="cancelled"
                                        />
                                        <VelocityTransitionGroup 
                                            enter={{
                                                animation: "slideDown",
                                            }}
                                            leave={{
                                                animation: "slideUp",
                                            }}
                                        >
                                        {this.expandedCampaignName === campaign.name ?
                                            <CampaignsTufStatistics
                                                campaignsStore={campaignsStore}
                                                groupsStore={groupsStore}
                                                showCancelCampaignModal={showCancelCampaignModal}
                                                showDependenciesModal={showDependenciesModal}
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
                            No cancelled campaigns.
                        </div>
                    }
                </div>
            </div>
        );
    }
}

TufList.propTypes = {
}

export default TufList;