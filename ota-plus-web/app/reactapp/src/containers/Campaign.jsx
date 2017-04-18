import React, { PropTypes, Component } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Loader } from '../partials';
import { resetAsync } from '../utils/Common';
import { CampaignGroupsList, CampaignCancelCampaignModal, CampaignCancelGroupModal } from '../components/campaign';
import { Doughnut } from 'react-chartjs';
import { FlatButton } from 'material-ui';
import { translate } from 'react-i18next';

@observer
class Campaign extends Component {
    @observable cancelCampaignModalShown = false;
    @observable cancelGroupModalShown = false;
    @observable updateRequestToCancel = {};

    constructor(props) {
        super(props);
        this.showCancelCampaignModal = this.showCancelCampaignModal.bind(this);
        this.hideCancelCampaignModal = this.hideCancelCampaignModal.bind(this);
        this.showCancelGroupModal = this.showCancelGroupModal.bind(this);
        this.hideCancelGroupModal = this.hideCancelGroupModal.bind(this);
    }
    showCancelCampaignModal(e) {
        if(e) e.preventDefault();
        this.cancelCampaignModalShown = true;
    }
    hideCancelCampaignModal(e) {
        if(e) e.preventDefault();
        this.cancelCampaignModalShown = false;
        resetAsync(this.props.campaignsStore.campaignsCancelAsync);
    }
    showCancelGroupModal(updateRequest, e) {
        if(e) e.preventDefault();
        this.cancelGroupModalShown = true;
        this.updateRequestToCancel = updateRequest;
    }
    hideCancelGroupModal(e) {
        if(e) e.preventDefault();
        this.cancelGroupModalShown = false;
        this.updateRequestToCancel = {};
        resetAsync(this.props.campaignsStore.campaignsCancelRequestAsync);
    }
    render() {
        const { t, campaignsStore, groupsStore } = this.props;
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
            <span>
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
                            <div className="col-xs-7">
                                <span className="section-title">
                                    Total progress
                                </span>
                                <div className="total-progress">
                                    <div className="devices-stats">
                                        <span>
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
                                <div className="total-failure-rate">
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
                            <CampaignGroupsList 
                                showCancelGroupModal={this.showCancelGroupModal}
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
                                    />
                                : 
                                    null
                                }
                            </div>
                        </div>
                    </span>
                }
                <CampaignCancelCampaignModal 
                    shown={this.cancelCampaignModalShown}
                    hide={this.hideCancelCampaignModal}
                    campaignsStore={campaignsStore}
                    campaign={campaignsStore.campaign}
                    overallStatistics={overallStatistics}
                />
                <CampaignCancelGroupModal 
                    shown={this.cancelGroupModalShown}
                    hide={this.hideCancelGroupModal}
                    campaign={campaignsStore.campaign}
                    campaignsStore={campaignsStore}
                    updateRequest={this.updateRequestToCancel}
                />
            </span>
        );
    }
}

Campaign.propTypes = {
    campaignsStore: PropTypes.object.isRequired,
    groupsStore: PropTypes.object.isRequired
}

export default translate()(Campaign);