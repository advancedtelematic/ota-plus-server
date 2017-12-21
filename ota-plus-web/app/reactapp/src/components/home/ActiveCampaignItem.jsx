import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { observer } from 'mobx-react';
import _ from 'underscore';

@observer
class ActiveCampaignItem extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { campaign } = this.props;
        const link = "campaign/" + campaign.id;

        let totalFailed = 0;
        let totalFinished = 0;
        let totalAffected = 0;
        let failureRate = 0;

        if(campaign.isLegacy) {
            totalFailed = campaign.summary.overallFailedUpdates;
            totalFinished = campaign.summary.overallCancelledUpdates + campaign.summary.overallSuccessfulUpdates;
            totalAffected = campaign.summary.overallCancelledUpdates + campaign.summary.overallFailedUpdates + campaign.summary.overallSuccessfulUpdates;
            failureRate = Math.round(totalFailed/Math.max(totalAffected, 1) * 100);
        } else {
            const stats = campaign.summary.stats;
            _.each(stats, (stat, groupId) => {
                totalAffected += stat.affected;
            });
            totalFailed = campaign.summary.failed.length;
            totalFinished = campaign.summary.finished;
            failureRate = Math.round(totalFailed/Math.max(totalFinished, 1) * 100);
        }
        return (
            <Link
                to={`${link}`}
                className="element-box campaign" 
                title={campaign.name}
                id={"link-campaignwizard-" + campaign.id}>
                    <div className="icon"></div>
                    <div className="desc">
                        <div className="title font-medium-bold">
                            {campaign.name}
                        </div>
                        <div className="subtitle font-small">
                            Finished: {totalFinished}/{totalAffected}
                        </div>
                        <div className="subtitle font-small">
                            Failure rate: {failureRate}%
                        </div>
                    </div>
            </Link>
        );
    }
}

ActiveCampaignItem.propTypes = {
}

export default ActiveCampaignItem;