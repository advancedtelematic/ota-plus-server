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
                    <div className="column">In preparation</div>
                </div>
                <div className="campaigns-list" id="in-preparation-campaigns">
                    {campaignsStore.inPreparationCampaigns.length ?
                        _.map(campaignsStore.inPreparationCampaigns, (campaign) => {
                            return (
                                <span key={campaign.id}>
                                    <CampaignsTufListItem 
                                        toggleCampaign={toggleCampaign}
                                        campaign={campaign}
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
                        })
                    :
                        <div className="no-items">
                            No running campaigns.
                        </div>
                    }
                </div>
                <div className="section-header">
                    <div className="column">Running campaigns</div>
                    <div className="column font-extra-small">Created at</div>
                    <div className="column font-extra-small">Processed</div>
                    <div className="column font-extra-small">Affected</div>
                    <div className="column font-extra-small">Finished</div>
                    <div className="column font-extra-small">Failure rate</div>
                </div>
                <div className="campaigns-list" id="running-campaigns">
                    {campaignsStore.runningCampaigns.length ?
                        _.map(campaignsStore.runningCampaigns, (campaign) => {
                            return (
                                <span key={campaign.id}>
                                    <CampaignsTufListItem 
                                        toggleCampaign={toggleCampaign}
                                        campaign={campaign}
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
                        })
                    :
                        <div className="no-items">
                            No running campaigns.
                        </div>
                    }
                </div>
                <div className="section-header">
                    <div className="column">Finished campaigns</div>
                </div>
                <div className="campaigns-list" id="finished-campaigns">
                    {campaignsStore.finishedCampaigns.length ?
                        _.map(campaignsStore.finishedCampaigns, (campaign) => {
                            return (
                                <span key={campaign.id}>
                                    <CampaignsTufListItem 
                                        toggleCampaign={toggleCampaign}
                                        campaign={campaign}
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
                        })
                    :
                        <div className="no-items">
                            No finished campaigns.
                        </div>
                    }
                </div>
                <div className="section-header">
                    <div className="column">Cancelled campaigns</div>
                </div>
                <div className="campaigns-list" id="cancelled-campaigns">
                    {campaignsStore.cancelledCampaigns.length ?
                        _.map(campaignsStore.cancelledCampaigns, (campaign) => {
                            return (
                                <span key={campaign.id}>
                                    <CampaignsTufListItem 
                                        toggleCampaign={toggleCampaign}
                                        campaign={campaign}
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
                        })
                    :
                        <div className="no-items">
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