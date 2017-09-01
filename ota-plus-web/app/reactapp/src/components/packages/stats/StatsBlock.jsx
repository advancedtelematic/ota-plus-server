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
        let statsPackIndex = 0;
        let stats = [];
        let installedOnEcusTotal = 0;
        _.each(pack.versions, (version, index) => {
            if(version.installedOnEcus > 0) {
                if(statsPackIndex < availableColors.length) {
                    colorIndex++;
                    statsPackIndex++;
                    stats.push(
                        {
                            value: version.installedOnEcus,
                            color: availableColors[colorIndex],
                            highlight: availableColors[colorIndex],
                            label: (statsPackIndex === availableColors.length - 1 ? "Other" : version.id.version)
                        }
                  );
                } else if(statsPackIndex >= availableColors.length) {
                    stats[availableColors.length - 1].value = version.installedOnEcus + stats[availableColors.length - 1].value;
                }
                version.color = availableColors[colorIndex];
            }
            installedOnEcusTotal += version.installedOnEcus;
        });
        const content = (
            <div className="chart-panel" id={"package-" + pack.packageName + "-stats"}>
                <div className={installedOnEcusTotal ? "wrapper-center" : "wrapper-center left"}>
                    <div className={installedOnEcusTotal ? "total-count" : "hide"}>
                        {installedOnEcusTotal}
                    </div>
                    {stats.length ?
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
                        </div>
                    :
                        <div id={"package-" + pack.packageName + "-not-installed"}>
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

export default StatsBlock;