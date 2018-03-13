import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { Doughnut } from 'react-chartjs';
import _ from 'underscore';
import { translate } from 'react-i18next';

@observer
class Chart extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { t, packagesStore } = this.props;
        const blacklist = packagesStore.preparedBlacklist;
        const availableColors = [
            '#1D5E6F',
            '#9DDDD4',
            '#D3D3D3',
            '#9B9B9B',
            '#4A4A4A'
        ];
        const groupedStatsName = 'Other';
        let colorIndex = -1;
        let stats = [];
        _.each(blacklist, (pack, index) => {
            if(pack.deviceCount && index < availableColors.length) {
                colorIndex++;
                stats.push(
                    {
                        value: pack.deviceCount,
                        groupIds: pack.groupIds,
                        color: availableColors[colorIndex],
                        highlight: availableColors[colorIndex],
                        label: (index === availableColors.length - 1 ? groupedStatsName : pack.packageName)
                    }
                );
            } else if(pack.deviceCount && index >= availableColors.length) {
                stats[availableColors.length - 1].value = pack.deviceCount + stats[availableColors.length - 1].value;
                stats[availableColors.length - 1].groupIds = _.union(pack.groupIds, stats[availableColors.length - 1].groupIds);
            }
        }, this);
        const legend = _.map(stats, (stat) => {
            return (
                <li key={"color-" + stat.label + "-" + stat.color}>
                    <div className="color-box" style={{backgroundColor: stat.color}}></div> 
                        <div className="title-box">
                            {stat.label}
                        </div>
                    <div className="subtitle-box">
                        {t('common.deviceWithCount', {count: stat.value})}
                    </div>
                </li>
            );
        }, this);

        return (
            <div className="chart-panel">
                <div className="wrapper-center">
                    <div>
                        <Doughnut 
                            data={stats} 
                            width="300" 
                            height="300" 
                            options={{
                                percentageInnerCutout: 65, 
                                segmentStrokeWidth: 5, 
                                showTooltips: true
                            }}
                        />
                        <ul>
                            {legend}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

Chart.propTypes = {
    packagesStore: PropTypes.object.isRequired
}

export default translate()(Chart);