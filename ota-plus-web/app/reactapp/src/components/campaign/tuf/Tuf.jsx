import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import _ from 'underscore';
import { Doughnut } from 'react-chartjs';
import { FlatButton } from 'material-ui';
import CampaignTufGroupsList from './TufGroupsList';

const AUTO_REFRESH_TIME = 10000;

@observer
class Tuf extends Component {
    constructor(props) {
        super(props);
        this.autoRefresh = this.autoRefresh.bind(this);
        setTimeout(this.autoRefresh, AUTO_REFRESH_TIME);
    }
    autoRefresh() {
        if(!_.isEmpty(this.props.campaignsStore.campaign) &&
            (this.props.campaignsStore.campaign.statistics.status === "prepared" || this.props.campaignsStore.campaign.statistics.status === "scheduled")) {
            this.props.campaignsStore.fetchCampaign(this.props.campaignsStore.campaign.id, 'campaignsOneSafeFetchAsync' ,'campaignsOneSafeStatisticsFetchAsync');
            setTimeout(this.autoRefresh, AUTO_REFRESH_TIME);
        }
    }
    render() {
        const { campaignsStore, groupsStore, showCancelGroupModal, showCancelCampaignModal } = this.props;
        let overallStatistics = campaignsStore.overallCampaignStatistics;
        const progress = Math.min(Math.round(overallStatistics.finished/Math.max(overallStatistics.affected, 1) * 100), 100);
        const failureRateData = [
            {
                value: overallStatistics.failed,
                color: "#FE0001",
                highlight: "#FE0001",
                label: "Failure rate"
            },
            {
                value: overallStatistics.finished,
                color: "#83D060",
                highlight: "#83D060",
                label: "Success rate"
            },
            {
                value: 0,
                color: "#CCCCCC",
                highlight: "#CCCCCC",
                label: "Cancelled rate"
            }
        ];
        let successRate = Math.min(Math.round(overallStatistics.successful/Math.max(overallStatistics.processed, 1) * 100), 100);
        let failureRate = Math.min(Math.round(overallStatistics.failed/Math.max(overallStatistics.processed, 1) * 100), 100);
        let queuedRate = Math.min(Math.round(overallStatistics.queued/Math.max(overallStatistics.processed, 1) * 100), 100);
        let notImpactedRate = Math.min(Math.round(overallStatistics.notImpacted/Math.max(overallStatistics.processed, 1) * 100), 100);

        let totalDevicesAmount = 0;
        _.each(campaignsStore.campaign.groups, (groupId, index) => {
            const foundGroup = _.findWhere(groupsStore.groups, {id: groupId});
            totalDevicesAmount += foundGroup.devices.total;
        });

        let notProceed = totalDevicesAmount - overallStatistics.processed;
        let notProceedRate = Math.min(Math.round(notProceed/Math.max(overallStatistics.processed, 1) * 100), 100);
        return (
            <span>
                <div className="subcontent tuf-campaign-wrapper">
                    <div className="container">
                        <div className="tuf-campaign">
                            <div className="row">
                                <div className="col-xs-6 col-xs-offset-3">
                                <div className="row">
                                    <div className="col-xs-12 section-title">
                                        Total progress
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-2 devices-stats">
                                        <div id="campaign-detail-devices-stats-processed" className="stat-big-count">
                                           {overallStatistics.processed}
                                        </div>
                                        <div className="stat-small-title">
                                            Processed
                                        </div>
                                    </div>
                                    <div className="col-xs-2 devices-stats">
                                        <div id="campaign-detail-devices-stats-affected" className="stat-big-count">
                                            {overallStatistics.affected}
                                        </div>
                                        <div className="stat-small-title">
                                            Affected
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="total-progress col-xs-12">
                                        <div className="devices-progress">
                                            <div className="bar">
                                                <div className="failure" style={{width: failureRate + '%'}}>
                                                </div>
                                                <div className="success" style={{width: successRate + '%'}}>
                                                </div>
                                                <div className="queued" style={{width: queuedRate + '%'}}>
                                                </div>
                                                <div className="not-impacted" style={{width: notImpactedRate + '%'}}>
                                                </div>
                                                <div className="not-proceed" style={{width: notProceedRate + '%'}}>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xs-12 status-block">
                                        <div className="row status-row">
                                            <div className="col-xs-5">
                                                <div className="row">
                                                    <div className="col-xs-6">
                                                        <span className="status failure">Failure</span>
                                                    </div>
                                                    <div className="col-xs-6">
                                                        <span className="status-value">{overallStatistics.failed}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-xs-6">
                                                <div className="row">
                                                    <div className="col-xs-6">
                                                        <span className="status not-impacted">Not impacted</span>
                                                    </div>
                                                    <div className="col-xs-6">
                                                        <span className="status-value">{overallStatistics.notImpacted}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row status-row">
                                            <div className="col-xs-5">
                                                <div className="row">
                                                    <div className="col-xs-6">
                                                        <span className="status successed">Successful</span>
                                                    </div>
                                                    <div className="col-xs-6">
                                                        <span className="status-value">{overallStatistics.successful}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-xs-6">
                                                <div className="row">
                                                    <div className="col-xs-6">
                                                        <span className="status not-proceed">Not proceed</span>
                                                    </div>
                                                    <div className="col-xs-6">
                                                        <span className="status-value">{notProceed}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row status-row">
                                            <div className="col-xs-5">
                                                <div className="row">
                                                    <div className="col-xs-6">
                                                        <span className="status queued">Queued</span>
                                                    </div>
                                                    <div className="col-xs-6">
                                                        <span className="status-value">{overallStatistics.queued}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                </div>
                                    <div className="col-xs-2 col-xs-offset-1">
                                    <span className="section-title">
                                        Failure rate
                                    </span>
                                    <div className="total-failure-rate" id="campaign-detail-total-failure-rate">
                                        <Doughnut
                                            data={failureRateData}
                                            options={{percentageInnerCutout: 40, showTooltips: false}}
                                            width="140"
                                            height="140"
                                        />
                                        <div className="rate">
                                            {Math.round(overallStatistics.failed/Math.max(overallStatistics.finished, 1) * 100)}%
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <CampaignTufGroupsList
                                showCancelGroupModal={showCancelGroupModal}
                                campaignsStore={campaignsStore}
                                groupsStore={groupsStore}
                            />
                        </div>
                    </div>
                </div>

            </span>
        );
    }
}

Tuf.propTypes = {
}

export default Tuf;