import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import _ from 'underscore';
import { Doughnut } from 'react-chartjs';
import { Loader, Modal } from '../../../partials';
import { FadeAnimation } from '../../../utils';

@observer
class StatsModal extends Component {
    @observable package = null;

    constructor(props) {
        super(props);
    }
    componentWillReceiveProps(nextProps) {
        _.map(this.props.packagesStore.preparedPackages, (packages, letter) => {
            _.map(packages, (pack, index) => {
                if(pack.packageName === nextProps.packageName) {
                    pack.versions = _.sortBy(pack.versions, (element) => {
                        return element.installedOnEcus;
                    }).reverse();
                    this.package = pack;
                }
            });
        });
        
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
        let colorIndex = -1;
        let stats = [];

        if(this.package) {            
            _.each(this.package.versions, (version, index) => {
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
                }
            });

            const legend = _.map(stats, (stat) => {
                return (
                    <li key={"color-" + stat.label + "-" + stat.color} id={"version-" + stat.label + "-stats"}>
                        <div className="color-box" id={"version-color-" + stat.color} style={{backgroundColor: stat.color}}></div> 
                        <div className="title-box" id={"version-hash-" + stat.label}>{stat.label}</div>
                        <div className="subtitle-box">
                            <span id={"version-" + stat.label + "-devices-count"}>{stat.value}</span> Devices
                        </div>
                    </li>
                );
            });
            content = (
                <div className="chart-panel" id={"package-" + this.package.packageName + "-stats"}>
                    <div className="wrapper-center">
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
                                <ul>
                                    {legend}
                                </ul>
                            </div>
                        :
                            <div id={"package-" + this.package.packageName + "-not-installed"}>
                                This package has not been installed yet.
                            </div>
                        }
                        
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
                        <button className="close" id="package-stats-close" onClick={hide}></button>
                    </span>
                )}
                content={
                    <div className="inner">
                        {content}
                    </div>
                }
                shown={shown}
                className="package-stats-modal"
                onRequestClose={hide}
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