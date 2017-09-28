import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import _ from 'underscore';
import { Doughnut } from 'react-chartjs';
import { Loader } from '../../partials';
import { FadeAnimation } from '../../utils';

@observer
class Stats extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { data } = this.props;

        let availableColors = [
            '#7d726f',
            '#d4d9d7',
            '#e89478'
        ];
        if('expired' in data) {
            availableColors = [
                '#8dc869',
                '#fc1e0a',
                '#e7be33'
            ];
        }
        let colorIndex = -1;
        let stats = [];
        _.each(data, (item, name) => {
            colorIndex++;
            stats.push(
                {
                    value: item,
                    color: availableColors[colorIndex],
                    highlight: availableColors[colorIndex],
                    label: name
                }
            );
        });
        const legend = _.map(stats, (stat) => {
            return (
                <li key={"color-" + stat.label + "-" + stat.color}>
                    <div className="color-box" style={{backgroundColor: stat.color}}></div> 
                    <div className="title-box">{stat.label}</div>
                </li>
            );
        });
        const content = (
            <div className="gateway-chart">
                <div>
                    <Doughnut 
                        data={stats} 
                        width="100" 
                        height="100" 
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