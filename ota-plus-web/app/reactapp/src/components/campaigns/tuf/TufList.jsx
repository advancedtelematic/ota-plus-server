import React, { PropTypes, Component } from 'react';
import { observer } from 'mobx-react';
import moment from 'moment';
import _ from 'underscore';
import { Loader } from '../../../partials';
import CampaignsTufListItem from './TufListItem';

@observer
class TufList extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { campaignsStore, showRenameModal, goToCampaignDetails } = this.props;
        return (
            <div className="tuf-list">
                <div className="section-header">
                    In preparation
                </div>
                <div className="campaigns-list" id="in-preparation-campaigns">
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
                                    <CampaignsTufListItem 
                                        goToCampaignDetails={goToCampaignDetails}
                                        showRenameModal={showRenameModal}
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
                <div className="campaigns-list" id="running-campaigns">
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
                                    <CampaignsTufListItem 
                                        goToCampaignDetails={goToCampaignDetails}
                                        showRenameModal={showRenameModal}
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
                <div className="campaigns-list" id="finished-campaigns">
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
                                    <CampaignsTufListItem 
                                        goToCampaignDetails={goToCampaignDetails}
                                        showRenameModal={showRenameModal}
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
                <div className="section-header">
                    Cancelled campaigns
                </div>
                <div className="campaigns-list" id="cancelled-campaigns">
                    {campaignsStore.cancelledCampaigns.length ?
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
                            {_.map(campaignsStore.cancelledCampaigns, (campaign) => {
                                return (
                                    <CampaignsTufListItem 
                                        goToCampaignDetails={goToCampaignDetails}
                                        showRenameModal={showRenameModal}
                                        campaign={campaign}
                                        type="cancelled"
                                        key={campaign.id}
                                    />
                                );
                            })}
                        </span>
                    :
                        <div className="empty">
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