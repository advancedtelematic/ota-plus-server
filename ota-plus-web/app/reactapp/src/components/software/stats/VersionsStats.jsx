/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observable, toJS } from 'mobx';
import { observer } from 'mobx-react';
import _ from 'lodash';
import { Doughnut } from 'react-chartjs-2';

@observer
class VersionsStats extends Component {
  @observable installedOnEcusTotal = 0;
  @observable stats = this.baseStats();

  baseStats = () => ({
    datasets: [
      {
        data: [],
        label: [],
        backgroundColor: [],
        hoverBackgroundColor: [],
        borderWidth: 0,
        hoverBorderWidth: 0,
      },
    ],
  });

  componentDidMount() {
    this.calculateStats(this.props.pack);
  }

  componentDidUpdate(prevProps) {
    const { pack } = this.props;
    if (pack.versions.length !== prevProps.pack.versions.length) {
      this.calculateStats(pack);
    }
  }

  clearVersionStatsData = () => {
    this.installedOnEcusTotal = 0;
    this.stats = this.baseStats();
  };

  calculateStats = (pack) => {
    this.clearVersionStatsData();
    const mainColor = '#FA9D00';
    const availableColors = [mainColor, '#069F71', '#660195', '#B8B9BE'];
    let colorIndex = -1;
    let statsPackIndex = 0;
    
    _.each(pack.versions, (version, index) => {
      if (version.installedOnEcus > 0) {
        if (statsPackIndex < availableColors.length) {
          colorIndex++;
          statsPackIndex++;
          this.stats.datasets[0].data.push(version.installedOnEcus);
          this.stats.datasets[0].label.push(statsPackIndex === availableColors.length - 1 ? 'Other' : version.id.version);
          this.stats.datasets[0].backgroundColor.push(availableColors[colorIndex]);
          this.stats.datasets[0].hoverBackgroundColor.push(availableColors[colorIndex]);
        } else if (statsPackIndex >= availableColors.length) {
          this.stats.datasets[0].data[availableColors.length - 1] = version.installedOnEcus + this.stats.datasets[0].data[availableColors.length - 1];
        }
        version.color = availableColors[colorIndex];
      }
      this.installedOnEcusTotal += version.installedOnEcus;
    });
  };

  render() {
    const { pack } = this.props;
    return (
      <div className='c-package__stats'>
        <div id={'package-' + pack.packageName + '-stats'}>
          <div id='target_chart_device_count' className={this.installedOnEcusTotal ? 'c-package__chart-total' : 'hide'}>
            {this.installedOnEcusTotal}
          </div>
          {this.stats.datasets[0].data.length ? (
            <div>
              <Doughnut
                data={toJS(this.stats)}
                width={175}
                height={175}
                options={{
                  cutoutPercentage: 75,
                }}
              />
            </div>
          ) : (
            <div id={'package-' + pack.packageName + '-not-installed'} className='not-installed'>
              This software has not been installed yet.
            </div>
          )}
        </div>
      </div>
    );
  }
}

VersionsStats.propTypes = {
  pack: PropTypes.object.isRequired,
};

export default VersionsStats;
