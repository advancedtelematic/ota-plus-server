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
        const { campaignsStore, groupsStore, addNewWizard, showWizard, showRenameModal, goToCampaignDetails } = this.props;
        return (
            <span>
                {campaignsStore.preparedLegacyCampaigns.length ?
                    <div className="legacy-list">
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
                                                groupsStore={groupsStore}
                                                goToCampaignDetails={goToCampaignDetails}
                                                showRenameModal={showRenameModal}
                                                campaign={campaign}
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
                                                groupsStore={groupsStore}
                                                goToCampaignDetails={goToCampaignDetails}
                                                showRenameModal={showRenameModal}
                                                campaign={campaign}
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

LegacyList.contextTypes = {
    router: React.PropTypes.object.isRequired
}

LegacyList.propTypes = {
    
}

export default LegacyList;