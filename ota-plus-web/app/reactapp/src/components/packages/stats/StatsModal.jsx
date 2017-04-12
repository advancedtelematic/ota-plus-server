import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import _ from 'underscore';
import { Doughnut } from 'react-chartjs';
import { Loader, Modal } from '../../../partials';
import { FadeAnimation } from '../../../utils';

@observer
class StatsModal extends Component {
    constructor(props) {
        super(props);
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.packageName !== this.props.packageName) {
            this.props.packagesStore.fetchPackageStatistics(nextProps.packageName);
        }
    }
    componentWillUnmount() {
        //reset
    }
    render() {
        const { shown, hide, packagesStore, packageName } = this.props;
        let content = null;
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
        const packageStats = _.sortBy(packagesStore.packageStats, (stat) => {
            return stat.deviceCount;
        }).reverse();

        if(packageStats.length) {
            _.each(packageStats, (stateObject, index) => {
                if(index < availableColors.length) {
                    colorIndex++;
                    stats.push(
                        {
                        value: stateObject.deviceCount,
                            groupsCount: stateObject.groupsCount,
                            color: availableColors[colorIndex],
                            highlight: availableColors[colorIndex],
                            label: (index === availableColors.length - 1 ? groupedStatsName : " " + stateObject.packageVersion)
                        }
                  );
                } else if(index >= availableColors.length) {
                    stats[availableColors.length - 1].value = stateObject.value + stats[availableColors.length - 1].value;
                    stats[availableColors.length - 1].groupIds = _.union(stateObject.groupIds, stats[availableColors.length - 1].groupIds);
                }
            });

            const legend = _.map(stats, (stat) => {
                return (
                    <li key={"color-" + stat.label + "-" + stat.color}>
                        <div className="color-box" style={{backgroundColor: stat.color}}></div> 
                        <div className="title-box">{stat.label}</div>
                        <div className="subtitle-box">{stat.value} Devices</div>
                        <div className="subtitle-box">{stat.groupsCount} Groups</div>
                    </li>
                );
            });

            content = (
                <div className="chart-panel">
                    <div className="wrapper-center">
                        <div>
                            <Doughnut 
                                data={stats} 
                                width="250" 
                                height="250" 
                                options={{
                                    percentageInnerCutout: 60, 
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

        return (
            <Modal 
                title={(
                    <span>
                        <img src="/assets/img/icons/pie_chart.png" className="icon" alt="" />&nbsp;
                        Statistics - Package {packageName}
                        <button className="close" onClick={hide}></button>
                    </span>
                )}
                content={
                    <div className="inner">
                        {packagesStore.packageStatisticsFetchAsync.isFetching ?
                            <div className="wrapper-center">
                                <Loader />
                            </div>
                        :
                            content
                        }
                    </div>
                }
                shown={shown}
                className="package-stats-modal"
            />
        );
    }
}

StatsModal.propTypes = {
    shown: PropTypes.bool.isRequired,
    hide: PropTypes.func.isRequired,
    packagesStore: PropTypes.object.isRequired,
    packageName: PropTypes.string,
}

export default StatsModal;