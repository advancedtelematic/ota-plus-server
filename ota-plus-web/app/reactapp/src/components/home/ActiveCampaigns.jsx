import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { Loader } from '../../partials';
import _ from 'underscore';
import { CampaignsTabsSwitcher } from '../../components/campaigns';

@observer
class ActiveCampaigns extends Component {
    constructor(props) {
        super(props);        
    }    
    render() {
        const { campaignsStore, goToCampaignDetails, otaPlusMode } = this.props;
        return (
            campaignsStore.campaignsFetchAsync.isFetching || campaignsStore.campaignsLegacyFetchAsync.isFetching ?
                <div className="wrapper-center">
                    <Loader />
                </div>
            :
                <CampaignsTabsSwitcher 
                    campaignsStore={campaignsStore}
                    showRenameModal={null}
                    goToCampaignDetails={goToCampaignDetails}
                    onHomePage={true}
                    otaPlusMode={otaPlusMode}
                />                     
        );
    }
}

ActiveCampaigns.propTypes = {
    campaignsStore: PropTypes.object
}

export default ActiveCampaigns;