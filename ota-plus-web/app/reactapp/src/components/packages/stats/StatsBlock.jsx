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
        const { pack, size, type } = this.props;
        let availableColors = [];
        if (type === 'groups' || type === 'devices') {
            availableColors = [
                '#FA9D00',
                '#069F71',
                '#670195',
                '#B7B9BC',
            ]
        } else if (type === 'results') {
            availableColors = [
                '#06B87C',
                '#D0021B'
            ]
        } else {
            availableColors = [
                '#1D5E6F',
                '#9DDDD4',
                '#fff',
                '#D3D3D3'
            ];
        }

        let colorIndex = -1;
        let statsPackIndex = 0;
        let stats = [];
        let installedOnEcusTotal = 0;
        let data = pack.versions;
        if (type === 'groups') {
            data = pack.stats.groups;
        } else if (type === 'results') {
            data = pack.stats.installationResults;
        }

        _.each(data, (version, index) => {
            if(version.installedOnEcus > 0 || version) {
                if(statsPackIndex < availableColors.length) {
                    colorIndex++;
                    statsPackIndex++;
                    if (type === 'groups' || type === 'results') {
                        stats.push(
                            {
                                value: version,
                                color: availableColors[colorIndex],
                                highlight: availableColors[colorIndex],
                                label: index
                            }
                        );
                    } else {
                        stats.push(
                            {
                                value: version.installedOnEcus,
                                color: availableColors[colorIndex],
                                highlight: availableColors[colorIndex],
                                label: (type === 'devices' ? index :
                                    (statsPackIndex === availableColors.length - 1 ? "Other" : version.id.version))
                            }
                        );
                    }

                } else if(statsPackIndex >= availableColors.length) {
                    stats[availableColors.length - 1].value = version.installedOnEcus + stats[availableColors.length - 1].value;
                }
                if (!type) {
                    version.color = availableColors[colorIndex];
                }
            }
            installedOnEcusTotal += version.installedOnEcus;
        });
        const content = (
            <div className="chart-panel" id={"package-" + pack.packageName + "-stats"}>
                <div className={installedOnEcusTotal ? "wrapper-center" : "wrapper-center"}>
                    <div className={installedOnEcusTotal ? "total-count" : "hide"}>
                        {installedOnEcusTotal}
                    </div>
                    {type === 'results' ? <div className="total-count">{stats[1].value}%</div> : ''}
                    {stats.length ?
                        <div className="canvas-wrapper">
                            <Doughnut 
                                data={stats} 
                                width={size.width || 250}
                                height={size.height || 250}
                                options={{
                                    percentageInnerCutout: 60, 
                                    segmentStrokeWidth: 5, 
                                    showTooltips: true
                                }}
                            />
                            <div className="colors-info">
                                {type ? _.map(stats, (element, key) => {
                                    return (
                                        <p key={key}>
                                            <span className="square" style={{backgroundColor: `${element.color}`}}/>
                                            {element.label}
                                        </p>
                                    )
                                }) : ''}
                            </div>
                        </div>
                    :
                        <div id={"package-" + pack.packageName + "-not-installed"} style={{textAlign: 'left'}}>
                            This package has not been installed yet.
                        </div>
                    }
                    
                </div>
            </div>
        );
        return (
            <div className="packages-stats">
                {content}
            </div>
        )
    }
}

StatsBlock.propTypes = {
    pack: PropTypes.object.isRequired,
}

StatsBlock.defaultProps = {
    size: {width: '250', height: '250'}
}

export default StatsBlock;