import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { Loader } from '../../partials';
import _ from 'underscore';
import ActiveCampaignsItem from './ActiveCampaignsItem';

@observer
class ActiveCampaigns extends Component {
    constructor(props) {
        super(props);
        this.goToDetails = this.goToDetails.bind(this);
    }
    goToDetails(campaignId, e) {
        if(e) e.preventDefault();
        this.context.router.push(`/campaign/${campaignId}`);
    }
    render() {
        const { campaignsStore } = this.props;
        const { lastActiveCampaigns } = campaignsStore;
        return (
            <span>
                <table className={"table" + (campaignsStore.campaignsFetchAsync.isFetching || !Object.keys(lastActiveCampaigns).length ? " empty" : "")}>
                    <thead>
                        <tr>
                            <td>Name</td>
                            <td>Start date</td>
                            <td>End date</td>
                            <td>Status</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {campaignsStore.campaignsFetchAsync.isFetching ?
                            <tr>
                                <td colSpan="5">
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
                                            goToDetails={this.goToDetails}
                                        />
                                    );
                                })
                            :
                                <tr>
                                    <td colSpan="5">
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

ActiveCampaigns.contextTypes = {
    router: React.PropTypes.object.isRequired
}

ActiveCampaigns.propTypes = {
    campaignsStore: PropTypes.object
}

export default ActiveCampaigns;