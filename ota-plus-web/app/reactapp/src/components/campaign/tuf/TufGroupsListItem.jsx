import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { Pie } from 'react-chartjs';
import { translate } from 'react-i18next';

@observer
class TufGroupsListItem extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { t, group, statistics, foundGroup, campaign } = this.props;
        const progress = Math.min(Math.round(statistics.processed/Math.max(foundGroup.devices.total, 1) * 100), 100);
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
            <div className="group-wrapper">
                <div className="name">
                    <div className="element-box group">
                        <div className="icon"/>
                        <div className="desc">
                            <div className="title" title={foundGroup.groupName}>
                                {foundGroup.groupName}
                            </div>
                            <div className="subtitle">
                                {t('common.deviceWithCount', {count: foundGroup.devices.total})}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="stats">
                    <div className="devices-progress">
                        <div className="progress progress-blue">
                            <div className={"progress-bar" + (campaign.statistics.status !== 'finished'
                                                                && campaign.statistics.status !== 'cancelled'
                                                                && progress !== 100 ? ' progress-bar-striped active': '')}
                                 role="progressbar"
                                 style={{width: foundGroup.devices.total !== 0 ? progress + '%' : '100%'}}>
                                <div className="wrapper-rate">
                                    <span className="wrapper-rate-value">
                                        {foundGroup.devices.total !== 0
                                            ? progress + '%'
                                            : '100%'
                                        }
                                    </span>
                                    <i className="fa fa-check" aria-hidden="true" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="status-group">
                    <p>
                        <span>
                            {statistics.processed} processed
                        </span>
                        <span>
                            {statistics.affected} affected
                        </span>
                    </p>
                </div>
            </div>
        );
    }
}

TufGroupsListItem.propTypes = {
    group: PropTypes.string.isRequired,
    foundGroup: PropTypes.object.isRequired,
    statistics: PropTypes.object.isRequired,
}

export default translate()(TufGroupsListItem);