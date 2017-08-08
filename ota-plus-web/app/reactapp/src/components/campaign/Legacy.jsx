import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import _ from 'underscore';
import { translate } from 'react-i18next';
import { Doughnut } from 'react-chartjs';
import { FlatButton } from 'material-ui';
import CampaignLegacyGroupsList from './LegacyGroupsList';

@observer
class Legacy extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { t, campaignsStore, groupsStore, showCancelGroupModal } = this.props;
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
            <div>
                {campaignsStore.campaignsOneFetchAsync.isFetching || campaignsStore.campaignsOneStatisticsFetchAsync.isFetching || groupsStore.groupsFetchAsync.isFetching ?
                    <div className="wrapper-center">
                        <Loader />
                    </div>
                :
                    <span>
                        <div className="black-header">
                            Campaign detailed view
                        </div>
                        <div className="subcontent">
                            <div className="legacy-campaign">
                                <div className="col-xs-7">
                                    <span className="section-title">
                                        Total progress
                                    </span>
                                    <div className="total-progress">
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
                                </div>
                                <div className="col-xs-5">
                                    <span className="section-title">
                                        Failure rate
                                    </span>
                                    <div className="total-failure-rate" id="campaign-detail-total-failure-rate">
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
                                </div>
                                <CampaignLegacyGroupsList 
                                    showCancelGroupModal={showCancelGroupModal}
                                    campaignsStore={campaignsStore}
                                    groupsStore={groupsStore}
                                />
                                <div>
                                    {overallStatistics.updatedDevicesCount !== overallStatistics.devicesCount ?
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
                }
            </div>
        );
    }
}

Legacy.propTypes = {
}

export default translate()(Legacy);