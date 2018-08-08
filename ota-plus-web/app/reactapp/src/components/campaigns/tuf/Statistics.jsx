import React, { Component, PropTypes } from 'react';
import { observer, inject } from 'mobx-react';
import _ from 'underscore';
import { Doughnut } from 'react-chartjs';
import { FlatButton } from 'material-ui';
import { Loader } from '../../../partials';
import CampaignsTufStatisticDetails from './StatisticDetails';

@inject("stores")
@observer
class Statistics extends Component {
    componentWillMount() {
        const { campaignsStore } = this.props.stores;
    	campaignsStore.fetchCampaign(this.props.campaignId);
    }
    render() {
        const { showCancelCampaignModal, showDependenciesModal, hideCancel } = this.props;
        const { campaignsStore } = this.props.stores;
        return (
            <div>
            	{campaignsStore.campaignsOneFetchAsync.isFetching || campaignsStore.campaignsOneStatisticsFetchAsync.isFetching ?
    	        	<div className="wrapper-center wrapper-center--dark">
    	        		<Loader />
    	        	</div>
            	:
            		<CampaignsTufStatisticDetails
                        showCancelCampaignModal={showCancelCampaignModal}
                        showDependenciesModal={showDependenciesModal}
                        hideCancel={hideCancel}
                    />
                }
            </div>
    	);
	}
}

Statistics.propTypes = {
}

export default Statistics;