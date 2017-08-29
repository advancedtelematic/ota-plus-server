import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import _ from 'underscore';
import moment from 'moment';

@observer
class ActiveCampaignsItem extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { campaign, goToCampaignDetails, groupsStore } = this.props;

        let totalProcessed = 0;
        let totalFinished = 0;
        let totalDevices = 0;
        let failureRate = 0;

        let stats = campaign.summary.stats;
        totalFinished = campaign.summary.finished;
        _.each(stats, (stat, groupId) => {
            totalProcessed += stat.processed;
            let foundGroup = _.find(groupsStore.groups, (item, index) => { 
                return item.id === groupId; 
            });
            totalDevices += foundGroup.devices.total;                        
        });
        failureRate = Math.round(totalFinished/Math.max(totalProcessed, 1) * 100);
            
        return (
            <tr key={campaign.id} onClick={goToCampaignDetails.bind(this, campaign.id)}>
                <td>{campaign.name}</td>
                <td id={"campaign-start-date-" + campaign.name}>
                    {moment(campaign.createdAt).format("DD.MM.YYYY")}
                </td>
                <td id={"campaign-delta-switch-" + campaign.name}>
                    <div className="delta-switch">
                        OFF
                    </div>
                </td>
                <td id={"campaign-delta-generation-size-" + campaign.name}>
                    <span>
                        30 MB
                    </span>
                </td>
                <td id={"campaign-processed-" + campaign.name}>
                    <span>
                        <span>{totalProcessed}</span>
                        /
                        <span>{totalDevices}</span>
                    </span>
                </td>
                <td id={"campaign-finished-" + campaign.name}>
                    <span>
                        <span>{totalFinished}</span>
                        /
                        <span>{totalDevices}</span>
                    </span>
                </td>
                <td id={"campaign-failure-rate-" + campaign.name}>
                    <span>
                        <span>{failureRate} %</span>
                    </span>
                </td>
                <td className="additional-info" id={"campaign-additional-info-" + campaign.name}>
                    <div className="more-info" id="campaign-more-info">
                        More info
                    </div>
                </td>
            </tr>
        );
    }
}

ActiveCampaignsItem.propTypes = {
    campaign: PropTypes.object.isRequired,
    goToCampaignDetails: PropTypes.func.isRequired,
    groupsStore: PropTypes.object.isRequired
}

export default ActiveCampaignsItem;