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
        const link = "campaigns/" + campaign.id;
        let totalFailed = 0;
        let totalFinished = 0;
        let totalAffected = 0;
        let failureRate = 0;
        const stats = campaign.summary.stats;
        _.each(stats, (stat, groupId) => {
            totalAffected += stat.affected;
        });
        totalFailed = campaign.summary.failed.length;
        totalFinished = campaign.summary.finished;
        failureRate = Math.round(totalFailed/Math.max(totalFinished, 1) * 100);
        return (
            <Link
                to={`${link}`}
                className="element-box campaign" 
                title={campaign.name}
                id={"link-campaignwizard-" + campaign.id}>
                    <div className="desc">
                        <div className="title">
                            {campaign.name}
                        </div>
                        <div className="subtitle">
                            Finished: {totalFinished}/{totalAffected}
                        </div>
                        <div className="subtitle">
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