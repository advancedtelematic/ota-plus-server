import React, { PropTypes, Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable } from 'mobx';
import moment from 'moment';
import _ from 'underscore';
import { Loader } from '../../partials';
import ListItem from './ListItem';
import Statistics from './Statistics';
import { VelocityTransitionGroup } from 'velocity-react';

const headerHeight = 40;

@inject("stores")
@observer
class List extends Component {
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
        let page = document.querySelector('.campaigns');
        setTimeout(() => {
            page.scrollTop = scrollTo;
        }, 1000);
    }
    highlightCampaign(id) {
        const { campaignsStore } = this.props.stores;
        if(this.refs.list && id) {
            const name = _.filter(campaignsStore.campaigns, (obj) => {
                return obj.id === id;
            });
            this.props.toggleCampaign(name[0].name);
            this.scrollToElement(id);
        }
    }
    render() {
        const { highlightedCampaign, showCancelCampaignModal, showDependenciesModal, expandedCampaignName, toggleCampaign } = this.props;
        const { campaignsStore } = this.props.stores;
        return (
            <div className="campaigns__wrapper" ref="list">
                <div className="campaigns__section-header section-header">
                    <div className="campaigns__column">In preparation</div>
                </div>
                <div className="campaigns__section-list" id="in-preparation-campaigns">
                    {campaignsStore.inPreparationCampaigns.length ?
                        _.map(campaignsStore.inPreparationCampaigns, (campaign) => {
                            return (
                                <span key={campaign.id}>
                                    <ListItem 
                                        expandedCampaignName={expandedCampaignName}
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
                                            <Statistics 
                                                campaignId={campaign.id}
                                                showCancelCampaignModal={showCancelCampaignModal}
                                                showDependenciesModal={showDependenciesModal}
                                                key={campaign.id}
                                                hideCancel={false}
                                            />
                                        :
                                            null
                                        }
                                    </VelocityTransitionGroup>
                                </span>
                            );
                        })
                    :
                        <div className="campaigns__section-list--empty">
                            No running campaigns.
                        </div>
                    }
                </div>
                <div className="campaigns__section-header section-header">
                    <div className="campaigns__column">Running campaigns</div>
                    <div className="campaigns__column">Created at</div>
                    <div className="campaigns__column">Processed</div>
                    <div className="campaigns__column">Affected</div>
                    <div className="campaigns__column">Finished</div>
                    <div className="campaigns__column">Failure rate</div>
                </div>
                <div className="campaigns__section-list" id="running-campaigns">
                    {campaignsStore.runningCampaigns.length ?
                        _.map(campaignsStore.runningCampaigns, (campaign) => {
                            return (
                                <span key={campaign.id}>
                                    <ListItem 
                                        expandedCampaignName={expandedCampaignName}
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
                                        <Statistics
                                            showCancelCampaignModal={showCancelCampaignModal}
                                            showDependenciesModal={showDependenciesModal}
                                            campaignId={campaign.id}
                                            hideCancel={false}
                                        />
                                    :
                                        null
                                    }
                                    </VelocityTransitionGroup>
                                </span>
                            );
                        })
                    :
                        <div className="campaigns__section-list--empty">
                            No running campaigns.
                        </div>
                    }
                </div>
                <div className="campaigns__section-header section-header">
                    <div className="campaigns__column">Finished campaigns</div>
                </div>
                <div className="campaigns__section-list" id="finished-campaigns">
                    {campaignsStore.finishedCampaigns.length ?
                        _.map(campaignsStore.finishedCampaigns, (campaign) => {
                            return (
                                <span key={campaign.id}>
                                    <ListItem 
                                        expandedCampaignName={expandedCampaignName}
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
                                        <Statistics
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
                        <div className="campaigns__section-list--empty">
                            No finished campaigns.
                        </div>
                    }
                </div>
                <div className="campaigns__section-header section-header">
                    <div className="campaigns__column">Cancelled campaigns</div>
                </div>
                <div className="campaigns__section-list" id="cancelled-campaigns">
                    {campaignsStore.cancelledCampaigns.length ?
                        _.map(campaignsStore.cancelledCampaigns, (campaign) => {
                            return (
                                <span key={campaign.id}>
                                    <ListItem 
                                        expandedCampaignName={expandedCampaignName}
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
                                        <Statistics
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
                        <div className="campaigns__section-list--empty">
                            No cancelled campaigns.
                        </div>
                    }
                </div>
            </div>
        );
    }
}

List.propTypes = {
}

export default List;