import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { Pie } from 'react-chartjs';
import { translate } from 'react-i18next';

@observer
class GroupsListItem extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { t, group, statistics, showCancelGroupModal, foundGroup } = this.props;
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
            <tr>
                <td className="name">
                    <div className="element-box group">
                        <div className="icon"></div>
                        <div className="desc">
                            <div className="title">
                                {foundGroup.groupName}
                            </div>
                            <div className="subtitle">
                                {t('common.deviceWithCount', {count: foundGroup.devices.total})}
                            </div>
                        </div>
                    </div>
                </td>
                <td className="stats">
                    <div className="devices-progress">
                        <div className="progress progress-blue">
                            <div className={"progress-bar" + (progress != 100 ? ' progress-bar-striped active': '')} role="progressbar" style={{width: progress + '%'}}></div>
                        </div>
                    </div>
                </td>
                <td className="chart">
                    <div className="wrapper-chart">
                        <Pie 
                            data={data} 
                            width="80"
                            height="80"
                            options={{showTooltips: false}}
                        />
                    </div>
                    <div className="wrapper-rate">
                        <div className="stat-big-count">
                            {Math.round(statistics.affected/Math.max(statistics.processed, 1)*100)} %
                        </div>
                        <div className="stat-small-title">
                            Affected
                        </div>
                    </div>
                </td>
            </tr>
        );
    }
}

GroupsListItem.propTypes = {
    group: PropTypes.string.isRequired,
    foundGroup: PropTypes.object.isRequired,
    statistics: PropTypes.object.isRequired,
    showCancelGroupModal: PropTypes.func.isRequired
}

export default translate()(GroupsListItem);