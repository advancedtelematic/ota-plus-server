import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { Pie } from 'react-chartjs';
import { translate } from 'react-i18next';

@observer
class GroupsListItem extends Component {
    render() {
        const { t, group, statistics, foundGroup, campaign } = this.props;
        const progress = Math.min(Math.round(statistics.processed/Math.max(foundGroup.total, 1) * 100), 100);
        const progressForIdTag = foundGroup.total !== 0 ? progress : '100';
        const data = [
            {
              value: statistics.affected,
              color:"#FE0001",
              highlight: "#FF0000",
              label: "Failure rate"
            },
            {
              value: statistics.processed,
              color: "#83D060",
              highlight: "#96DCD1",
              label: "Success rate"
            },
            {
              value: 0,
              color: "#CCCCCC",
              highlight: "#CCCCCC",
              label: "Cancelled rate"
            }
        ];
        return (
            <div className="groups__item">
                <div className="groups__box groups__box--left">
                    <div className="groups__item-name">
                        <div className="element-box group">
                            <div className="icon"/>
                            <div className="desc">
                                <div className="small-title" id={`target_group_${foundGroup.groupName}`} title={foundGroup.groupName}>
                                    {foundGroup.groupName}
                                </div>
                                <div className="subtitle" id={`target_group_devicecount_${foundGroup.total}`}>
                                    {t('common.deviceWithCount', {count: foundGroup.total})}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="groups__item-progress">
                        <div className="groups__item-progress-wrapper">
                            <div className={"groups__item-progress-bar progress progress-bar" + (campaign.statistics.status !== 'finished'
                                                            && campaign.statistics.status !== 'cancelled'
                                                            && progress !== 100 ? ' progress-bar-striped active': '')}
                                 role="progressbar"
                                 style={{width: foundGroup.total !== 0 ? progress + '%' : '100%'}}>
                            </div>
                        </div>
                        <div className="groups__item-progress-value" id={`target_wrapper_rate_value_${progressForIdTag}`}>
                            {foundGroup.total !== 0 ? progress + '%' : '100%'}
                        </div>
                    </div>
                </div>
                <div className="groups__box groups__box--right">
                    <div>
                        {statistics.processed} processed
                    </div>
                    <div>
                        {statistics.affected} affected
                    </div>
                </div>
            </div>
        );
    }
}

GroupsListItem.propTypes = {
    group: PropTypes.string.isRequired,
    foundGroup: PropTypes.object.isRequired,
    statistics: PropTypes.object.isRequired,
}

export default translate()(GroupsListItem);