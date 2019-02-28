/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import _ from 'lodash';
import { Doughnut } from 'react-chartjs-2';

@observer
class VersionsStats extends Component {
  render() {
    const { pack } = this.props;
    const mainColor = '#FA9D00';
    const availableColors = [mainColor, '#069F71', '#660195', '#B8B9BE'];
    let colorIndex = -1;
    let statsPackIndex = 0;
    let stats = {
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
    };
    let installedOnEcusTotal = 0;
    _.each(pack.versions, (version, index) => {
      if (version.installedOnEcus > 0) {
        if (statsPackIndex < availableColors.length) {
          colorIndex++;
          statsPackIndex++;
          stats.datasets[0].data.push(version.installedOnEcus);
          stats.datasets[0].label.push(statsPackIndex === availableColors.length - 1 ? 'Other' : version.id.version);
          stats.datasets[0].backgroundColor.push(availableColors[colorIndex]);
          stats.datasets[0].hoverBackgroundColor.push(availableColors[colorIndex]);
        } else if (statsPackIndex >= availableColors.length) {
          stats.datasets[0].data[availableColors.length - 1] = version.installedOnEcus + stats.datasets[0].data[availableColors.length - 1];
        }
        version.color = availableColors[colorIndex];
      }
      installedOnEcusTotal += version.installedOnEcus;
    });
    const content = (
      <div id={'package-' + pack.packageName + '-stats'}>
        <div id='target_chart_device_count' className={installedOnEcusTotal ? 'c-package__chart-total' : 'hide'}>
          {installedOnEcusTotal}
        </div>
        {stats.datasets[0].data.length ? (
          <div>
            <Doughnut
              data={stats}
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
    );
    return <div className='c-package__stats'>{content}</div>;
  }
}

VersionsStats.propTypes = {
  pack: PropTypes.object.isRequired,
};

export default VersionsStats;
