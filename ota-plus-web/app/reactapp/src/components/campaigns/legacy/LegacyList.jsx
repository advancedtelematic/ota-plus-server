import React, { PropTypes, Component } from 'react';
import { observer } from 'mobx-react';
import moment from 'moment';
import _ from 'underscore';
import { Loader } from '../../../partials';
import CampaignsLegacyListItem from './LegacyListItem';

@observer
class LegacyList extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { campaignsStore, showRenameModal, goToCampaignDetails, onHomePage } = this.props;
        return (
            <span>
                {campaignsStore.preparedLegacyCampaigns.length ?
                    <div className="legacy-list">
                        {!onHomePage ?
                            <span>
                                <div className="section-header">
                                    Running campaigns
                                </div>
                                <div className="campaigns-list">
                                    {campaignsStore.runningLegacyCampaigns.length ?
                                        <span>
                                            <div className="heading">
                                                <div></div>
                                                <div className="column">Name</div>
                                                <div className="column">Start date</div>
                                                <div className="column">End date</div>
                                                <div className="column"></div>
                                                <div className="column"></div>
                                            </div>
                                            {_.map(campaignsStore.runningLegacyCampaigns, (campaign) => {
                                                return (
                                                    <CampaignsLegacyListItem 
                                                        goToCampaignDetails={goToCampaignDetails}
                                                        showRenameModal={showRenameModal}
                                                        campaign={campaign}
                                                        onHomePage={onHomePage}
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
                                    {campaignsStore.finishedLegacyCampaigns.length ?
                                        <span>
                                            <div className="heading">
                                                <div></div>
                                                <div className="column">Name</div>
                                                <div className="column">Start date</div>
                                                <div className="column">End date</div>
                                                <div className="column"></div>
                                                <div className="column"></div>
                                            </div>
                                            {_.map(campaignsStore.finishedLegacyCampaigns, (campaign) => {
                                                return (
                                                    <CampaignsLegacyListItem 
                                                        goToCampaignDetails={goToCampaignDetails}
                                                        showRenameModal={showRenameModal}
                                                        campaign={campaign}
                                                        onHomePage={onHomePage}
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
                            <span>
                                <div className="campaigns-list">
                                    {campaignsStore.runningLegacyCampaigns.length ?
                                        <span>
                                            <div className="heading">
                                                <div></div>
                                                <div className="column">Name</div>
                                                <div className="column">Start date</div>
                                                <div className="column">End date</div>
                                                <div className="column"></div>
                                                <div className="column"></div>
                                            </div>
                                            {_.map(campaignsStore.runningLegacyCampaigns, (campaign) => {
                                                return (
                                                    <CampaignsLegacyListItem 
                                                        goToCampaignDetails={goToCampaignDetails}
                                                        showRenameModal={showRenameModal}
                                                        campaign={campaign}
                                                        onHomePage={onHomePage}
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

LegacyList.propTypes = {
}

export default LegacyList;