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
    constructor(props) {
        super(props);
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
    scrollToElement(id) {
        const wrapperPosition = this.refs.list.getBoundingClientRect();
        const elementCoords = document.getElementById("item-" + id).getBoundingClientRect();
        let scrollTo = elementCoords.top - wrapperPosition.top + 35;
        let page = document.querySelector('span.content-container');
        setTimeout(() => {
            page.scrollTop = scrollTo;
        }, 1000);
    }
    highlightCampaign(id) {
        if(this.refs.list && id) {
            const name = _.filter(this.props.campaignsStore.campaigns, (obj) => {
                return obj.id === id;
            });
            this.props.toggleCampaign(name[0].name);
            this.scrollToElement(id);
        }
    }
    render() {
        const { campaignsStore, groupsStore, highlightedCampaign, showCancelCampaignModal, showDependenciesModal, expandedCampaignName, toggleCampaign } = this.props;
        return (
            <span ref="list">
                <div className="section-header">
                    In preparation
                </div>
                <div className="campaigns-list" id="in-preparation-campaigns">
                    {campaignsStore.inPreparationCampaigns.length ?
                        <span>
                            <div className="heading font-small">
                                <div></div>
                                <div className="column name">Name</div>
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
                                            toggleCampaign={toggleCampaign}
                                            campaign={campaign}
                                            expandedCampaignName={expandedCampaignName}
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
                                            {expandedCampaignName === campaign.name ?
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
                <div className="section-header">
                    Running campaigns
                </div>
                <div className="campaigns-list" id="running-campaigns">
                    {campaignsStore.runningCampaigns.length ?
                        <span>
                            <div className="heading font-small">
                                <div></div>
                                <div className="column name">Name</div>
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
                                            toggleCampaign={toggleCampaign}
                                            campaign={campaign}
                                            expandedCampaignName={expandedCampaignName}
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
                                        {expandedCampaignName === campaign.name?
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
                <div className="section-header">
                    Finished campaigns
                </div>
                <div className="campaigns-list" id="finished-campaigns">
                    {campaignsStore.finishedCampaigns.length ?
                        <span>
                            <div className="heading font-small">
                                <div></div>
                                <div className="column name">Name</div>
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
                                            toggleCampaign={toggleCampaign}
                                            campaign={campaign}
                                            expandedCampaignName={expandedCampaignName}
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
                                        {expandedCampaignName === campaign.name ?
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
                <div className="section-header">
                    Cancelled campaigns
                </div>
                <div className="campaigns-list" id="cancelled-campaigns">
                    {campaignsStore.cancelledCampaigns.length ?
                        <span>
                            <div className="heading font-small">
                                <div></div>
                                <div className="column name">Name</div>
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
                                            toggleCampaign={toggleCampaign}
                                            campaign={campaign}
                                            expandedCampaignName={expandedCampaignName}
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
                                        {expandedCampaignName === campaign.name ?
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
            </span>
        );
    }
}

TufList.propTypes = {
}

export default TufList;