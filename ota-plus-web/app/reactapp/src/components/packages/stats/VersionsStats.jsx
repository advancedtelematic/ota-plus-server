import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import _ from 'underscore';
import { Doughnut } from 'react-chartjs';
import { Loader } from '../../../partials';
import { FadeAnimation } from '../../../utils';

@observer
class VersionsStats extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { pack } = this.props;
        const mainColor = '#FA9D00';
        const availableColors = [
            mainColor,
            '#069F71',
            '#660195',
            '#B8B9BE',
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
                <div className={installedOnEcusTotal ? "wrapper-center" : "wrapper-center"}>
                    <div id="target_chart_device_count" className={installedOnEcusTotal ? "total-count" : "hide"}>
                        {installedOnEcusTotal}
                    </div>
                    {stats.length ?
                        <div>
                            <Doughnut 
                                data={stats} 
                                width="175" 
                                height="175" 
                                options={{
                                    percentageInnerCutout: 75, 
                                    segmentStrokeWidth: 5, 
                                    showTooltips: true
                                }}
                            />
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

VersionsStats.propTypes = {
    pack: PropTypes.object.isRequired,
}

export default VersionsStats;