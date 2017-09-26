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
        const { campaignsStore, groupsStore, showRenameModal, goToCampaignDetails, onHomePage } = this.props;
        return (
            <span>
                {campaignsStore.preparedCampaigns.length ?
                    <div className="tuf-list">
                        {!onHomePage ?
                            <span>
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
                                                    <CampaignsTufListItem 
                                                        groupsStore={groupsStore}
                                                        goToCampaignDetails={goToCampaignDetails}
                                                        showRenameModal={showRenameModal}
                                                        campaign={campaign}
                                                        onHomePage={onHomePage}
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
                                                    <CampaignsTufListItem 
                                                        groupsStore={groupsStore}
                                                        goToCampaignDetails={goToCampaignDetails}
                                                        showRenameModal={showRenameModal}
                                                        campaign={campaign}
                                                        onHomePage={onHomePage}
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
                                                    <CampaignsTufListItem 
                                                        groupsStore={groupsStore}
                                                        goToCampaignDetails={goToCampaignDetails}
                                                        showRenameModal={showRenameModal}
                                                        campaign={campaign}
                                                        onHomePage={onHomePage}
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
                                <div className="campaigns-list">
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
                                                        groupsStore={groupsStore}
                                                        goToCampaignDetails={goToCampaignDetails}
                                                        showRenameModal={showRenameModal}
                                                        campaign={campaign}
                                                        onHomePage={onHomePage}
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
                            </span>
                        :
                            <span>
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
                                                    <CampaignsTufListItem 
                                                        groupsStore={groupsStore}
                                                        goToCampaignDetails={goToCampaignDetails}
                                                        showRenameModal={showRenameModal}
                                                        campaign={campaign}
                                                        onHomePage={onHomePage}
                                                        type="running"
                                                        key={campaign.id}
                                                    />
                                                );
                                            })}
                                        </span>
                                    :
                                        <div className="wrapper-center">
                                            No running campaigns.
                                        </div>
                                    }
                                </div>
                            </span>
                        }
                    </div>
                : 
                    <span className="content-empty">
                        <div className="wrapper-center">
                            No matching campaigns found.
                        </div>
                    </span>
                }
            </span>
        );
    }
}

TufList.propTypes = {
}

export default TufList;