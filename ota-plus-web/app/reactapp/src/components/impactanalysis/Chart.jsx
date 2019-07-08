/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Doughnut } from 'react-chartjs-2';
import _ from 'lodash';
import { withTranslation } from 'react-i18next';

@inject('stores')
@observer
class Chart extends Component {
  render() {
    const { t, stores } = this.props;
    const { softwareStore } = stores;
    const blacklist = softwareStore.preparedBlacklistRaw;
    const availableColors = ['#DFF9F8', '#B2E7E5', '#7ED7D3', '#4CC7C4', '#00AFAA'];
    const groupedStatsName = 'Other';
    let colorIndex = -1;
    const stats = {
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
    _.each(
      blacklist,
      (pack, index) => {
        const colorsCount = availableColors.length - 1;
        if (pack.deviceCount && index < availableColors.length) {
          colorIndex += 1;
          stats.datasets[0].data.push(pack.deviceCount);
          stats.datasets[0].label.push(index === colorsCount ? groupedStatsName : pack.packageName);
          stats.datasets[0].backgroundColor.push(availableColors[colorIndex]);
          stats.datasets[0].hoverBackgroundColor.push(availableColors[colorIndex]);
        } else if (pack.deviceCount && index >= availableColors.length) {
          stats.datasets[0].data[colorsCount] = pack.deviceCount + stats.datasets[0].data[colorsCount];
        }
      },
      this,
    );
    const legend = _.map(
      stats.datasets[0].data,
      (stat, index) => (
        <li key={`color-${stats.datasets[0].backgroundColor[index]}-${stats.datasets[0].backgroundColor[index]}`}>
          <div className="color-box" style={{ backgroundColor: stats.datasets[0].backgroundColor[index] }} />
          <div className="title-box">{stats.datasets[0].label[index]}</div>
          <div className="subtitle-box">{t('devices.device_count', { count: stat })}</div>
        </li>
      ),
      this,
    );
    return (
      <div className="chart-panel">
        <div className="section-header" />
        <div className="wrapper-center">
          <div>
            <Doughnut
              data={stats}
              width={400}
              height={400}
              options={{
                cutoutPercentage: 75,
              }}
            />
            <ul>{legend}</ul>
          </div>
        </div>
      </div>
    );
  }
}

Chart.propTypes = {
  stores: PropTypes.shape({}),
  t: PropTypes.func.isRequired
};

export default withTranslation()(Chart);
