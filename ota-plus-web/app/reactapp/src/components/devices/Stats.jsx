import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import _ from 'underscore';
import { Doughnut } from 'react-chartjs';

@observer
class Stats extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { data, indicatorColors } = this.props;

        const defaultColors = [
            '#00908A',
            '#99E9E3',
            '#F3F3F4'
        ];
        const customColors = [
            "#48DAD0",
            "#FA9D00",
            "#C41C33"
        ];
        const colors = indicatorColors ? customColors : defaultColors;

        let colorIndex = -1;
        let stats = [];
        _.each(data, (item, name) => {
            colorIndex++;
            stats.push(
                {
                    value: item,
                    color: colors[colorIndex],
                    highlight: colors[colorIndex],
                    label: name
                }
            );
        });
        const legend = _.map(stats, (stat) => {
            return (
                <li key={"color-" + stat.label + "-" + stat.color}>
                    <div className="title-box">{stat.label}</div>
                    <div className="color-box" style={{backgroundColor: stat.color}}></div> 
                </li>
            );
        });
        const values = _.map(stats, (stat) => {
            return (
                <li key={"color-" + stat.label + "-" + stat.color}>
                    <div className="title-box">{stat.label}</div>
                    <div>{stat.value}</div>
                </li>
            );
        });
        const content = (
            <div className="devices-chart-wrapper">
                <Doughnut 
                    data={stats} 
                    width="100" 
                    height="100" 
                    options={{
                        percentageInnerCutout: 75, 
                        segmentStrokeWidth: 0, 
                        segmentShowStroke: false
                    }}
                />
                <div>
                    <ul className="value-legend">
                        {values}
                    </ul>
                    <ul className="color-legend">
                        {legend}
                    </ul>
                </div>
            </div>
        );
        return (
            content
        )
    }
}

Stats.propTypes = {
    data: PropTypes.object.isRequired,
}

export default Stats;