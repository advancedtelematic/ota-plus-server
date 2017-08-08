import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { Pie } from 'react-chartjs';
import { translate } from 'react-i18next';

@observer
class LegacyGroupsListItem extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { t, group, statistics, showCancelGroupModal, foundGroup } = this.props;
        const progress = Math.min(Math.round(statistics.updatedDevices/Math.max(statistics.deviceCount, 1) * 100), 100);
        const data = [
            {
              value: statistics.failedUpdates,
              color:"#FF0000",
              highlight: "#FF0000",
              label: "Failure rate"
            },
            {
              value: statistics.successfulUpdates,
              color: "#96DCD1",
              highlight: "#96DCD1",
              label: "Success rate"
            },
            {
              value: statistics.cancelledUpdates,
              color: "#CCCCCC",
              highlight: "#CCCCCC",
              label: "Cancelled rate"
            }
        ];
        return (
            <tr>
                <td className="name">
                    <div className="element-box group">
                        <div className="icon"></div>
                        <div className="desc">
                            <div className="title">
                                {foundGroup.groupName}
                            </div>
                            <div className="subtitle">
                                {t('common.deviceWithCount', {count: statistics.deviceCount})}
                            </div>
                        </div>
                    </div>
                </td>
                <td className="stats">
                    <div className="devices-stats">
                        {statistics.updatedDevices} of {t('common.deviceWithCount', {count: statistics.deviceCount})}
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
                                : null}
                            </div>
                        </div>
                    </div>
                </td>
                <td className="chart">
                    <div className="wrapper-chart">
                        <Pie 
                            data={data} 
                            width="50" 
                            height="50" 
                            options={{showTooltips: false}}
                        />
                    </div>
                    <div className="wrapper-rate">
                        <span className={statistics.failedUpdates == 0 ? "lightgrey" : ""}>
                            {Math.round(statistics.failedUpdates/Math.max(statistics.updatedDevices, 1)*100)} % failure rate
                        </span>
                    </div>
                </td>
                <td>
                    {statistics.updatedDevices !== statistics.deviceCount ?
                        <a 
                            href="#" 
                            className="cancel-campaign" 
                            id="campaign-detail-cancel"
                            title="Cancel the Campaign for this group" 
                            onClick={showCancelGroupModal.bind(this, {
                                groupName: foundGroup.groupName, 
                                updateRequest: group.updateRequest,
                                deviceCount: statistics.deviceCount
                            })}>
                            <strong>Cancel</strong>
                        </a>
                    : 
                        null
                    }
                </td>
            </tr>
        );
    }
}

LegacyGroupsListItem.propTypes = {
    group: PropTypes.object.isRequired,
    foundGroup: PropTypes.object.isRequired,
    statistics: PropTypes.object.isRequired,
    showCancelGroupModal: PropTypes.func.isRequired
}

export default translate()(LegacyGroupsListItem);