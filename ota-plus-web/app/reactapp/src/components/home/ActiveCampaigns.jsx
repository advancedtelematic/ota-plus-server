import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { Loader } from '../../partials';
import _ from 'underscore';
import ActiveCampaignsItem from './ActiveCampaignsItem';

@observer
class ActiveCampaigns extends Component {
    constructor(props) {
        super(props);        
    }    
    render() {
        const { campaignsStore, groupsStore, goToCampaignDetails } = this.props;
        const { lastActiveCampaigns } = campaignsStore;
        return (
            <span>
                <table className={"table" + (campaignsStore.campaignsFetchAsync.isFetching || !Object.keys(lastActiveCampaigns).length ? " empty" : "")}>
                    <thead>
                        <tr>
                            <td>Name</td>
                            <td>Created at</td>
                            <td>Delta switch</td>
                            <td>Delta generation size</td>
                            <td>Processed</td>
                            <td>Finished</td>
                            <td>Failure rate</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {campaignsStore.campaignsFetchAsync.isFetching || groupsStore.groupsFetchAsync.isFetching || campaignsStore.campaignsLegacyFetchAsync.isFetching ?
                            <tr>
                                <td colSpan="8">
                                    <Loader 
                                        className="dark"
                                    />
                                </td>
                            </tr>
                        :
                            Object.keys(lastActiveCampaigns).length ?
                                _.map(campaignsStore.lastActiveCampaigns, (campaign) => {
                                    return (
                                        <ActiveCampaignsItem 
                                            key={campaign.id}
                                            campaign={campaign}
                                            goToCampaignDetails={goToCampaignDetails}
                                            groupsStore={groupsStore}
                                        />
                                    );
                                })
                            :
                                <tr>
                                    <td colSpan="8">
                                        <span>
                                            No running campaigns.
                                        </span>
                                    </td>
                                </tr>
                        }
                    </tbody>
                </table>
            </span>
        );
    }
}

ActiveCampaigns.propTypes = {
    campaignsStore: PropTypes.object
}

export default ActiveCampaigns;