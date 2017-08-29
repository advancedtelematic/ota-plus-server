import React, { PropTypes, Component } from 'react';
import { observer } from 'mobx-react';
import moment from 'moment';
import _ from 'underscore';
import { Loader } from '../../../partials';
import { Pie } from 'react-chartjs';

@observer
class LegacyListItem extends Component {
    constructor(props) {
        super(props);
    }
    rename(e) {
        e.stopPropagation();
        this.props.showRenameModal(this.props.campaign.id);
    }
    render() {
        const { groupsStore, campaign, goToCampaignDetails } = this.props;

        if(campaign.status === "Active") {
            var progress = Math.min(Math.round(campaign.summary.overallUpdatedDevicesCount/Math.max(campaign.summary.overallDevicesCount, 1) * 100), 100);
            var data = [
                {
                    value: campaign.summary.overallFailedUpdates,
                    color:"#FF0000",
                    highlight: "#FF0000",
                    label: "Failure rate"
                },
                {
                    value: campaign.summary.overallSuccessfulUpdates,
                    color: "#96DCD1",
                    highlight: "#96DCD1",
                    label: "Success rate"
                },
                {
                    value: campaign.summary.overallCancelledUpdates,
                    color: "#CCCCCC",
                    highlight: "#CCCCCC",
                    label: "Cancelled rate"
                }
            ];
        }
        
        return (
            <div className="item" onClick={goToCampaignDetails.bind(this, campaign.id)}>
                <div className="actions">
                    <ul>
                        <li id={"rename-campaign-" + campaign.name} onClick={this.rename.bind(this)}>
                            <img src="/assets/img/icons/edit_white.png" alt="" />
                            <span>Rename</span>
                        </li>
                    </ul>
                </div>
                <div className="column" id={"campaign-" + campaign.name}>
                    {campaign.name}
                </div>
                <div className="column" id={"campaign-start-date" + campaign.name}>
                    none
                </div>
                <div className="column" id={"campaign-end-date" + campaign.name}>
                    none
                </div>
                <div className="column">
                    {campaign.status === "Active" ?
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
                                : null}
                            </div>
                        </div>
                    : null}
                </div>
                <div className="column">
                    <div className="pie">
                        {campaign.status === "Active" ?
                            <Pie data={data} width="30" height="30" options={{showTooltips: false}}/>
                        : null}
                    </div>
                </div>
            </div>
        );
    }
}

LegacyListItem.propTypes = {
    groupsStore: PropTypes.object.isRequired,
    campaign: PropTypes.object.isRequired,
    goToCampaignDetails: PropTypes.func.isRequired,
    showRenameModal: PropTypes.func.isRequired,
}

export default LegacyListItem;