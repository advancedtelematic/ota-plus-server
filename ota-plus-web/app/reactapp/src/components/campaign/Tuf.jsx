import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import _ from 'underscore';
import { Doughnut } from 'react-chartjs';
import { FlatButton } from 'material-ui';
import CampaignGroupsList from './GroupsList';

@observer
class Tuf extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { campaignsStore, groupsStore, showCancelGroupModal } = this.props;
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
        let successRate = Math.min(Math.round(overallStatistics.successful/Math.max(overallStatistics.affected, 1) * 100), 100);
        let failureRate = Math.min(Math.round(overallStatistics.failed/Math.max(overallStatistics.affected, 1) * 100), 100);
        let queuedRate = Math.min(Math.round(overallStatistics.queued/Math.max(overallStatistics.affected, 1) * 100), 100);
        let notImpactedRate = Math.min(Math.round(overallStatistics.notImpacted/Math.max(overallStatistics.processed, 1) * 100), 100);

        return (
            <span>
                <div className="subcontent">
                    <div className="tuf-campaign">
                        <div className="col-xs-2 campaign-name-block">
                            <span className="campaign-name">
                                {
                                    !campaignsStore.campaignsOneFetchAsync.isFetching && !campaignsStore.campaignsOneStatisticsFetchAsync.isFetching ?
                                        campaignsStore.campaign.name
                                    :
                                        ""
                                }
                            </span>
                        </div>
                        <div className="col-xs-8">
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
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xs-12 status-block">
                                    <div className="row status-row">
                                        <div className="col-xs-4">
                                            <div className="row">
                                                <div className="col-xs-6">
                                                    <span className="status failure">Failure</span>
                                                </div>
                                                <div className="col-xs-6">
                                                    <span className="status-value">{overallStatistics.failed}/{overallStatistics.affected}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xs-4">
                                            <div className="row">
                                                <div className="col-xs-6">
                                                    <span className="status not-impacted">Not impacted</span>
                                                </div>
                                                <div className="col-xs-6">
                                                    <span className="status-value">{overallStatistics.notImpacted}/{overallStatistics.processed}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row status-row">
                                        <div className="col-xs-4">
                                            <div className="row">
                                                <div className="col-xs-6">
                                                    <span className="status successed">Successful</span>
                                                </div>
                                                <div className="col-xs-6">
                                                    <span className="status-value">{overallStatistics.successful}/{overallStatistics.affected}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row status-row">
                                        <div className="col-xs-4">
                                            <div className="row">
                                                <div className="col-xs-6">
                                                    <span className="status queued">Queued</span>
                                                </div>
                                                <div className="col-xs-6">
                                                    <span className="status-value">{overallStatistics.queued}/{overallStatistics.affected}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="col-xs-2">
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
                        <CampaignGroupsList 
                            showCancelGroupModal={showCancelGroupModal}
                            campaignsStore={campaignsStore}
                            groupsStore={groupsStore}
                        />
                        <div>
                            {campaignsStore.campaign.statistics.status !== 'cancelled' ?
                                <FlatButton
                                    label="Cancel all"
                                    title="Cancel the Campaign for all groups"
                                    type="button"
                                    onClick={this.showCancelCampaignModal}
                                    className="btn-main btn-red"
                                    id="campaign-detail-cancel-all"
                                />
                            : 
                                null
                            }
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