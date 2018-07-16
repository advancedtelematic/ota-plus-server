import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import _ from 'underscore';
import { Doughnut } from 'react-chartjs';
import { FlatButton } from 'material-ui';
import { Loader } from '../../../partials';
import CampaignsTufStatisticDetails from './StatisticDetails';

@observer
class Statistics extends Component {
    constructor(props) {
        super(props);
    }
    componentWillMount() {
    	this.props.campaignsStore.fetchCampaign(this.props.campaignId);
    }
    render() {
        const { campaignsStore, groupsStore, showCancelCampaignModal, showDependenciesModal, hideCancel } = this.props;
        return (
            <div>
            	{campaignsStore.campaignsOneFetchAsync.isFetching || campaignsStore.campaignsOneStatisticsFetchAsync.isFetching ?
    	        	<div className="wrapper-center wrapper-center--dark">
    	        		<Loader />
    	        	</div>
            	:
            		<CampaignsTufStatisticDetails
            			campaignsStore={campaignsStore}
                        groupsStore={groupsStore}
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