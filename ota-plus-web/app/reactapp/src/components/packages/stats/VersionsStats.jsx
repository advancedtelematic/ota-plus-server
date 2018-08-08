import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import _ from 'underscore';
import { Doughnut } from 'react-chartjs';
import { Loader } from '../../../partials';
import { FadeAnimation } from '../../../utils';

@observer
class VersionsStats extends Component {
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
                            label: (statsPackIndex === availableColors.length - 1 ? "Other" : version.id.version),
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
            <div id={"package-" + pack.packageName + "-stats"}>
                <div id="target_chart_device_count" className={installedOnEcusTotal ? "c-package__chart-total" : "hide"}>
                    {installedOnEcusTotal}
                </div>
                {stats.length ?
                    <div className="c-package__chart-wrapper">
                        <Doughnut 
                            data={stats} 
                            width="175" 
                            height="175" 
                            options={{
                                percentageInnerCutout: 75, 
                                segmentStrokeWidth: 0,
                                showTooltips: true,
                                segmentShowStroke: false
                            }}
                        />
                    </div>
                :
                    <div id={"package-" + pack.packageName + "-not-installed"} className="not-installed">
                        This package has not been installed yet.
                    </div>
                }
            </div>
        );
        return (
            <div className="c-package__stats">
                {content}
            </div>
        )
    }
}

VersionsStats.propTypes = {
    pack: PropTypes.object.isRequired,
}

export default VersionsStats;