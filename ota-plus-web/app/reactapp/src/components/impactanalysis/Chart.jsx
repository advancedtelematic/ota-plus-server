/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Doughnut } from 'react-chartjs-2';
import _ from 'lodash';
import { translate } from 'react-i18next';

@inject('stores')
@observer
class Chart extends Component {
  render() {
    console.log("render Chart");
    const { t } = this.props;
    const { packagesStore } = this.props.stores;
    const blacklist = packagesStore.preparedBlacklistRaw;
    const availableColors = ['#DFF9F8', '#B2E7E5', '#7ED7D3', '#4CC7C4', '#00AFAA'];
    const groupedStatsName = 'Other';
    let colorIndex = -1;
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
    _.each(
      blacklist,
      (pack, index) => {
        if (pack.deviceCount && index < availableColors.length) {
          colorIndex++;
          stats.datasets[0].data.push(pack.deviceCount);
          stats.datasets[0].label.push(index === availableColors.length - 1 ? groupedStatsName : pack.packageName);
          stats.datasets[0].backgroundColor.push(availableColors[colorIndex]);
          stats.datasets[0].hoverBackgroundColor.push(availableColors[colorIndex]);

        } else if (pack.deviceCount && index >= availableColors.length) {
          stats.datasets[0].data[availableColors.length - 1] = pack.deviceCount + stats.datasets[0].data[availableColors.length - 1];
        }
      },
      this,
    );
    const legend = _.map(
      stats.datasets[0].data,
      (stat, index) => {
        return (
          <li
            key={'color-' + stats.datasets[0].backgroundColor[index] + '-' + stats.datasets[0].backgroundColor[index]}>
            <div className='color-box' style={{ backgroundColor: stats.datasets[0].backgroundColor[index] }}/>
            <div className='title-box'>{stats.datasets[0].label[index]}</div>
            <div className='subtitle-box'>{t('common.deviceWithCount', { count: stat })}</div>
          </li>
        );
      },
      this,
    );
    console.log(stats, 'stats');
    return (
      <div className='chart-panel'>
        <div className='section-header'/>
        <div className='wrapper-center'>
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
  stores: PropTypes.object,
};

export default translate()(Chart);
