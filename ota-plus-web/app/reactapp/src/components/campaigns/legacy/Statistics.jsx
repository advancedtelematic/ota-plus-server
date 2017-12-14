import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import _ from 'underscore';
import { Doughnut } from 'react-chartjs';
import { FlatButton } from 'material-ui';
import { Loader } from '../../../partials';
import CampaignsLegacyStatisticDetails from './StatisticDetails';

@observer
class Statistics extends Component {
    constructor(props) {
        super(props);
    }
    componentWillMount() {
    	this.props.campaignsStore.fetchLegacyCampaign(this.props.campaignId);
    }
    render() {
        const { campaignsStore, groupsStore, showCancelCampaignModal, showCancelGroupModal } = this.props;
        return (
        	campaignsStore.campaignsOneFetchAsync.isFetching || campaignsStore.campaignsOneStatisticsFetchAsync.isFetching ?
	        	<div className="wrapper-center">
	        		<Loader />
	        	</div>
        	:
        		<CampaignsLegacyStatisticDetails
        			campaignsStore={campaignsStore}
                    groupsStore={groupsStore}
                    showCancelCampaignModal={showCancelCampaignModal}
        			showCancelGroupModal={showCancelGroupModal}
        		/>
    	);
	}
}

Statistics.propTypes = {
}

export default Statistics;