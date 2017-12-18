import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import _ from 'underscore';
import { translate } from 'react-i18next';
import { Doughnut } from 'react-chartjs';
import { FlatButton } from 'material-ui';
import { CampaignLegacyGroupsList } from '../../campaign/legacy';

@observer
class StatisticDetails extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { t, campaignsStore, groupsStore, showCancelCampaignModal, showCancelGroupModal } = this.props;
        const overallStatistics = campaignsStore.overallCampaignStatistics;
        const progress = Math.min(Math.round(overallStatistics.updatedDevicesCount/Math.max(overallStatistics.devicesCount, 1) * 100), 100);
        const failureRateData = [
            {
                value: overallStatistics.failedUpdates,
                color: "#FF0000",
                highlight: "#FF0000",
                label: "Failure rate"
            },
            {
                value: overallStatistics.successfulUpdates,
                color: "#96DCD1",
                highlight: "#96DCD1",
                label: "Success rate"
            },
            {
                value: overallStatistics.cancelledUpdates,
                color: "#CCCCCC",
                highlight: "#CCCCCC",
                label: "Cancelled rate"
            }
        ];
        return (
            <div className="statistic-details">

                <div className="left-box">
                    <div className="title">
                        Failure rate
                    </div>
                    <div className="failure-rate-container">
                        <div className="failure-rate" id="campaign-detail-total-failure-rate">
                            <Doughnut 
                                data={failureRateData} 
                                options={{percentageInnerCutout: 40}} 
                                width="120" 
                                height="120" 
                                options={{showTooltips: false}}
                            />
                            <div className="rate">
                                {Math.round(overallStatistics.failedUpdates/Math.max(overallStatistics.updatedDevicesCount, 1) * 100)}%
                            </div>
                        </div>
                        {overallStatistics.updatedDevicesCount !== overallStatistics.devicesCount ?
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
                        <div className="devices-stats">
                            <span id="campaign-detail-devices-stats">
                                {overallStatistics.updatedDevicesCount} of {t('common.deviceWithCount', {count: overallStatistics.devicesCount})}
                            </span>
                        </div>
                        <div className="devices-progress">
                            <div className="progress progress-blue">
                                <div className={"progress-bar" + (progress != 100 ? ' progress-bar-striped active': '')} role="progressbar" style={{width: progress + '%'}}></div>
                                <div className="progress-count">
                                  {progress}%
                                </div>
                                <div className="progress-status">
                                    {progress == 100 ?
                                        <span className="fa-stack">
                                            <i className="fa fa-circle fa-stack-1x"></i>
                                            <i className="fa fa-check-circle fa-stack-1x fa-inverse"></i>
                                        </span>
                                    : 
                                        null
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <CampaignLegacyGroupsList 
                        showCancelGroupModal={showCancelGroupModal}
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

export default translate()(StatisticDetails);