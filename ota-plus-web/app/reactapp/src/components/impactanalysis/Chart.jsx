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
        const blacklist = packagesStore.preparedBlacklistRaw;
        const availableColors = [
            '#DFF9F8',
            '#B2E7E5',
            '#7ED7D3',
            '#4CC7C4',
            '#00AFAA'
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
                <div className="section-header"></div>
                <div className="wrapper-center">
                    <div>
                        <Doughnut 
                            data={stats} 
                            width="400" 
                            height="400" 
                            options={{
                                percentageInnerCutout: 50, 
                                segmentStrokeWidth: 15, 
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