import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import _ from 'underscore';
import { Doughnut } from 'react-chartjs';
import { FlatButton } from 'material-ui';
import { Loader } from '../../../partials';
import { CampaignTufGroupsList, CampaignTufSubHeader } from '../../campaign/tuf';

const AUTO_REFRESH_TIME = 10000;
const tooltipText = "Show dependencies";

@observer
class StatisticDetails extends Component {
    @observable tmpIntervalId = null;

    constructor(props) {
        super(props);
        this.autoRefresh = this.autoRefresh.bind(this);
        this.tmpIntervalId = setInterval(this.autoRefresh, AUTO_REFRESH_TIME);
    }
    autoRefresh() {
        if(this.props.campaignsStore.campaign.statistics.status === "prepared" || this.props.campaignsStore.campaign.statistics.status === "scheduled") {
            this.props.campaignsStore.fetchCampaign(this.props.campaignsStore.campaign.id, 'campaignsOneSafeFetchAsync' ,'campaignsOneSafeStatisticsFetchAsync');
        }
    }
    componentWillUnmount() {
        clearInterval(this.tmpIntervalId);
    }
    render() {
        const { campaignsStore, groupsStore, showCancelCampaignModal, showDependenciesModal, hideCancel } = this.props;
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
                value: overallStatistics.failed === 0 ? 1 : overallStatistics.finished,
                color: "#44CA9D",
                highlight: "#44CA9D",
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
        _.each(campaignsStore.campaign.groups, group => {
            totalDevicesAmount += group.total;
        });

        let notProcessed  = totalDevicesAmount - overallStatistics.processed;
        let notProcessedRate = Math.min(Math.round(notProcessed /Math.max(overallStatistics.processed, 1) * 100), 100);
        let cancelledRate = Math.min(Math.round(overallStatistics.cancelled /Math.max(overallStatistics.processed, 1) * 100), 100);
        return (
            <div className="statistics">

                <CampaignTufSubHeader
                    campaignsStore={campaignsStore}
                    title={campaignsStore.campaign.name}
                    showCancelCampaignModal={showCancelCampaignModal}
                    hideCancel={hideCancel}
                />

                <div className="statistics__wrapper">
                    <div className="statistics__box statistics__box--left">
                        <div className="statistics__box-title">
                            Failure rate
                        </div>
                        <div className="statistics__failure-chart" id="campaign-detail-total-failure-rate">
                            <div className="statistics__failure-chart-wrapper">
                                <Doughnut
                                    data={failureRateData}
                                    options={{percentageInnerCutout: 75, showTooltips: false, segmentStrokeWidth: 0, segmentShowStroke: false}}
                                    width="140"
                                    height="140"
                                />
                            </div>
                            <div className="statistics__failure-rate">
                                {Math.round(overallStatistics.failed/Math.max(overallStatistics.finished, 1) * 100)}%
                            </div>
                        </div>
                    </div>

                    <div className="statistics__box statistics__box--right">
                        <div className="statistics__progress">
                            <div className="statistics__box-title">
                                Total progress
                            </div>
                            <div className="statistics__blocks">
                                <div className="statistics__processed">
                                    <span className="statistics__count" id="campaign-detail-devices-stats-processed">
                                       {overallStatistics.processed}
                                    </span>
                                    Processed
                                </div>
                                <div className="statistics__affected">
                                    <span className="statistics__count" id="campaign-detail-devices-stats-affected">
                                        {overallStatistics.affected}
                                    </span>
                                    Affected
                                </div>
                            </div>                                
                            <div className="statistics__installation">
                                <div className="statistics__bar-wrapper">
                                    <div className="statistics__bar">
                                        <div className="statistics__bar-item statistics__bar-item--failure" style={{width: failureRate + '%'}}></div>
                                        <div className="statistics__bar-item statistics__bar-item--success" style={{width: successRate + '%'}}></div>
                                        <div className="statistics__bar-item statistics__bar-item--queued" style={{width: queuedRate + '%'}}></div>
                                        <div className="statistics__bar-item statistics__bar-item--not-impacted" style={{width: notImpactedRate + '%'}}></div>
                                        <div className="statistics__bar-item statistics__bar-item--not-proceed" style={{width: notProcessedRate + '%' }}></div>
                                        <div className="statistics__bar-item statistics__bar-item--cancelled" style={{width: cancelledRate + '%' }}></div>
                                    </div>
                                    <div className="statistics__legend">
                                        <div className="statistics__legend-item">
                                            <span className="statistics__legend-item-color statistics__legend-item-color--success"></span>
                                            <span className="statistics__legend-item-title">Success</span>
                                            <span className="statistics__legend-item-count" id="target_stats_success">{overallStatistics.successful}</span>
                                        </div>
                                        <div className="statistics__legend-item">
                                            <span className="statistics__legend-item-color statistics__legend-item-color--queued"></span>
                                            <span className="statistics__legend-item-title">Queued</span>
                                            <span className="statistics__legend-item-count" id="target_stats_queued">{overallStatistics.queued}</span>
                                        </div>
                                        <div className="statistics__legend-item">
                                            <span className="statistics__legend-item-color statistics__legend-item-color--failure"></span>
                                            <span className="statistics__legend-item-title">Failure</span>
                                            <span className="statistics__legend-item-count" id="target_stats_failure">{overallStatistics.failed}</span>
                                        </div>
                                        <div className="statistics__legend-item">
                                            <span className="statistics__legend-item-color statistics__legend-item-color--not-proceed"></span>
                                            <span className="statistics__legend-item-title">Not processed</span>
                                            <span className="statistics__legend-item-count" id="target_stats_not_proceed">{notProcessed}</span>
                                        </div>                            
                                        <div className="statistics__legend-item">
                                            <span className="statistics__legend-item-color statistics__legend-item-color--not-impacted"></span>
                                            <span className="statistics__legend-item-title">Not impacted</span>
                                            <span className="statistics__legend-item-count" id="target_stats_not_impacted">{overallStatistics.notImpacted}</span>
                                        </div>
                                        <div className="statistics__legend-item">
                                            <span className="statistics__legend-item-color statistics__legend-item-color--cancelled"></span>
                                            <span className="statistics__legend-item-title">Cancelled</span>
                                            <span className="statistics__legend-item-count" id="target_stats_cancelled">{overallStatistics.cancelled}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="statistics__dependencies">
                                    <a href="#" className="add-button" id="target_show_dependencies" onClick={showDependenciesModal.bind(this, campaignsStore.campaign.name)}>
                                        <span>
                                            Show dependencies
                                        </span>
                                    </a>
                                </div>
                            </div>                            
                                                   
                        </div>

                        <CampaignTufGroupsList
                            campaignsStore={campaignsStore}
                            groupsStore={groupsStore}
                        />                
                    </div>
                </div>       
            </div>
        );
    }
}

StatisticDetails.propTypes = {
}

export default StatisticDetails;