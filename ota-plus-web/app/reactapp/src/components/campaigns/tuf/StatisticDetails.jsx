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
        const { campaignsStore, groupsStore, showCancelCampaignModal, showDependenciesModal } = this.props;
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

        let notProcessed  = totalDevicesAmount - overallStatistics.processed;
        let notProcessedRate = Math.min(Math.round(notProcessed /Math.max(overallStatistics.processed, 1) * 100), 100);
        return (
            <div className="statistic-details">

                <CampaignTufSubHeader
                    campaignsStore={campaignsStore}
                    title={campaignsStore.campaign.name}
                />

                <div className="left-box">
                    <div className="title">
                        Failure rate
                    </div>

                    <div className="failure-rate-container">
                        <div className="failure-rate" id="campaign-detail-total-failure-rate">
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
                        {campaignsStore.campaign.statistics.status === 'launched' ?
                            <div className="cancel-campaign">
                                <FlatButton
                                    label="Cancel all"
                                    title="Cancel the Campaign for all groups"
                                    type="button"
                                    onClick={showCancelCampaignModal}
                                    className="btn-main btn-red"
                                    id="campaign-detail-cancel-all"
                                />
                            </div>
                        : 
                            null
                        }
                    </div>
                </div>

                <div className="right-box">
                    <div className="title">
                        Total progress
                    </div>

                    <div className="total-progress-container">
                        <div className="top-container">
                            <div className="block">
                                <div id="campaign-detail-devices-stats-processed">
                                   {overallStatistics.processed}
                                </div>
                                <div>
                                    Processed
                                </div>
                            </div>
                            <div className="block">
                                <div id="campaign-detail-devices-stats-affected">
                                    {overallStatistics.affected}
                                </div>
                                <div>
                                    Affected
                                </div>
                            </div>
                        </div>
                        <div className="middle-container">
                            <div className="devices-progress with-bar">
                                <div className="bar">
                                    <div className="failure" style={{width: failureRate + '%'}}>
                                    </div>
                                    <div className="success" style={{width: successRate + '%'}}>
                                    </div>
                                    <div className="queued" style={{width: queuedRate + '%'}}>
                                    </div>
                                    <div className="not-impacted" style={{width: notImpactedRate + '%'}}>
                                    </div>
                                    <div className="not-proceed" style={{width: notProcessedRate + '%'}}>
                                    </div>
                                </div>
                            </div>
                            <div className="show-dependencies">
                                <div className="my-tooltip">
                                    {tooltipText}
                                </div>
                                <img src="/assets/img/icons/dependencies-icon.svg" alt="icon" onClick={showDependenciesModal.bind(this, campaignsStore.campaign.name)} />
                            </div>
                        </div>
                        <div className="bottom-container">
                            <div className="status-block">
                                <div className="failure">
                                    <span></span>
                                    <span>Failure</span>
                                    <span>{overallStatistics.failed}</span>
                                </div>
                                <div className="cancelled">
                                    <span></span>
                                    <span>Cancelled</span>
                                    <span>{overallStatistics.cancelled}</span>
                                </div>
                                <div className="queued">
                                    <span></span>
                                    <span>Queued</span>
                                    <span>{overallStatistics.queued}</span>
                                </div>
                                <div className="not-proceed">
                                    <span></span>
                                    <span>Not processed</span>
                                    <span>{notProcessed }</span>
                                </div>
                                <div className="success">
                                    <span></span>
                                    <span>Successful</span>
                                    <span>{overallStatistics.successful}</span>
                                </div>
                                <div className="not-impacted">
                                    <span></span>
                                    <span>Not impacted</span>
                                    <span>{overallStatistics.notImpacted}</span>
                                </div>
                            </div> 
                        </div>
                                               
                    </div>

                    <CampaignTufGroupsList
                        campaignsStore={campaignsStore}
                        groupsStore={groupsStore}
                    />                
                </div>
                             
            </div>
        );
    }
}

StatisticDetails.propTypes = {
}

export default StatisticDetails;