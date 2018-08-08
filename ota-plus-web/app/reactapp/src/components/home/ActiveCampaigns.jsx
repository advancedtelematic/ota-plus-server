import React, { Component, PropTypes } from 'react';
import { observer, inject } from 'mobx-react';
import { Loader } from '../../partials';
import _ from 'underscore';
import ActiveCampaignItem from './ActiveCampaignItem';
import NoItems from './NoItems';

@inject("stores")
@observer
class ActiveCampaigns extends Component {
    constructor(props) {
        super(props);  
        this.createCampaign = this.createCampaign.bind(this);
    }
    createCampaign(e) {
        e.preventDefault();
        const { addNewWizard } = this.props;
        addNewWizard();
    }
    render() {
        const { addNewWizard } = this.props;
        const { campaignsStore } = this.props.stores;
        return (
            <span style={{height: '100%'}}>
                {campaignsStore.campaignsFetchAsync.isFetching ?
                    <div className="wrapper-center">
                        <Loader />
                    </div>
                :
                    campaignsStore.lastActiveTufCampaigns.length ?
                        _.map(campaignsStore.lastActiveTufCampaigns, (campaign) => {
                            return (
                                <ActiveCampaignItem
                                    campaign={campaign}
                                    key={campaign.id}
                                />
                            );
                        })
                    :
                        <NoItems 
                            itemName={"campaign"}
                            create={this.createCampaign}
                        />
                }
            </span>
        );
    }
}

ActiveCampaigns.propTypes = {
    stores: PropTypes.object
}

export default ActiveCampaigns;