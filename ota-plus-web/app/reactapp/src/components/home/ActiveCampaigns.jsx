import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { Loader } from '../../partials';
import _ from 'underscore';
import ActiveCampaignItem from './ActiveCampaignItem';

@observer
class ActiveCampaigns extends Component {
    constructor(props) {
        super(props);        
    }    
    render() {
        const { campaignsStore } = this.props;
        const noCampaigns = 'No active campaigns';
        return (
            <span>
                {campaignsStore.campaignsFetchAsync.isFetching || campaignsStore.campaignsLegacyFetchAsync.isFetching ?
                    <div className="wrapper-center">
                        <Loader />
                    </div>
                :
                    campaignsStore.lastActiveMixedCampaigns.length ?
                        _.map(campaignsStore.lastActiveMixedCampaigns, (campaign) => {
                            return (
                                <ActiveCampaignItem
                                    campaign={campaign}
                                    key={campaign.id}
                                />
                            );
                        })
                    :
                        <div className="wrapper-center">
                            {noCampaigns}
                        </div>
                }
            </span>
        );
    }
}

ActiveCampaigns.propTypes = {
    campaignsStore: PropTypes.object
}

export default ActiveCampaigns;