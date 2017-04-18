import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import _ from 'underscore';
import { Pie } from 'react-chartjs';

@observer
class ActiveCampaignsItem extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { campaign, goToDetails } = this.props;
        let progress = Math.min(Math.round(campaign.summary.overallUpdatedDevicesCount/Math.max(campaign.summary.overallDevicesCount, 1) * 100), 100);
        let data = [
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
        return (
            <tr key={campaign.id} onClick={goToDetails.bind(this, campaign.id)}>
                <td>{campaign.name}</td>
                <td>none</td>
                <td>none</td>
                <td>
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
                </td>
                <td>
                    <Pie data={data} width="30" height="30" options={{showTooltips: false}}/>
                </td>
            </tr>
        );
    }
}

ActiveCampaignsItem.propTypes = {
    campaign: PropTypes.object.isRequired,
    goToDetails: PropTypes.func.isRequired
}

export default ActiveCampaignsItem;