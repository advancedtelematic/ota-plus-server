import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import _ from 'underscore';
import { Doughnut } from 'react-chartjs';
import { Loader } from '../../../partials';
import { FadeAnimation } from '../../../utils';

@observer
class StatsBlock extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { pack } = this.props;
        const availableColors = [
            '#1D5E6F',
            '#9DDDD4',
            '#D3D3D3',
            '#fff',
        ];
        let colorIndex = -1;
        let stats = [];
        let installedOnEcusTotal = 0;
        _.each(pack.versions, (version, index) => {
            if(version.installedOnEcus > 0) {
                if(index < availableColors.length) {
                    colorIndex++;
                    stats.push(
                        {
                            value: version.installedOnEcus,
                            color: availableColors[colorIndex],
                            highlight: availableColors[colorIndex],
                            label: (index === availableColors.length - 1 ? "Other" : version.id.version)
                        }
                  );
                } else if(index >= availableColors.length) {
                    stats[availableColors.length - 1].value = version.installedOnEcus + stats[availableColors.length - 1].value;
                }
                version.color = availableColors[colorIndex];
            }
            installedOnEcusTotal += version.installedOnEcus;
        });        
        const legend = _.map(stats, (stat) => {
            return (
                <li key={"color-" + stat.label + "-" + stat.color} id={"version-" + stat.label + "-stats"}>
                    <div className="color-box" id={"version-color-" + stat.color} style={{backgroundColor: stat.color}}></div> 
                    <div className="title-box" id={"version-hash-" + stat.label}>Version: {stat.label}</div>
                </li>
            );
        });
        const barData = _.map(stats, (stat, index) => {
            let percentage = Math.min(stat.value/Math.max(installedOnEcusTotal, 1) * 100, 100);
            return (
                <div className="bar-item" style={{width: percentage + '%', backgroundColor: stat.color}} key={index}>
                </div>
            );
        });
        return (
            <div className="packages-stats">
                <div className="bar">
                    {barData}
                </div>
                <ul className="legend">
                    {legend}
                </ul>
            </div>
        )
    }
}

StatsBlock.propTypes = {
    pack: PropTypes.object.isRequired,
}

export default StatsBlock;