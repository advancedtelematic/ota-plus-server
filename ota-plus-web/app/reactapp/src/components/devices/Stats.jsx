/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import _ from 'lodash';
import { Doughnut } from 'react-chartjs-2';

@observer
class Stats extends Component {
  render() {
    const { data, indicatorColors } = this.props;

    const defaultColors = ['#00908A', '#99E9E3', '#F3F3F4'];
    const customColors = ['#48DAD0', '#FA9D00', '#C41C33'];
    const colors = indicatorColors ? customColors : defaultColors;

    let colorIndex = -1;
    let stats = {
      datasets: [
        {
          data: [],
          label: [],
          backgroundColor: [],
          hoverBackgroundColor: [],
          borderWidth: 0,
        },
      ],
    };

    _.each(data, (item, name) => {
      colorIndex++;
      stats.datasets[0].data.push(item);
      stats.datasets[0].label.push(name);
      stats.datasets[0].backgroundColor.push(colors[colorIndex]);
      stats.datasets[0].hoverBackgroundColor.push(colors[colorIndex]);
    });

    const values = _.map(stats.datasets[0].label, (label, index) => {
      return (
        <li className='devices-panel__stats-item' key={'color-' + label + '-' + stats.datasets[0].backgroundColor[index]}>
          <div className='title-box'>{label}</div>
          <div>{stats.datasets[0].data[index]}</div>
        </li>
      );
    });

    const legend = _.map(stats.datasets[0].label, (label, index) => {
      return (
        <li className='devices-panel__stats-item' key={'color-' + label + '-' + stats.datasets[0].backgroundColor[index]}>
          <div className='title-box'>{label}</div>
          <div className='color-box' style={{ backgroundColor: stats.datasets[0].backgroundColor[index] }} />
        </li>
      );
    });

    const content = (
      <div className='devices-panel__chart-wrapper'>
        <div>
          <Doughnut
            data={stats}
            width={120}
            height={120}
            options={{
              cutoutPercentage: 75,
            }}
          />
        </div>

        <div>
          <ul className='devices-panel__legend-values'>{values}</ul>
          <ul className='devices-panel__legend-colors'>{legend}</ul>
        </div>
      </div>
    );
    return content;
  }
}

Stats.propTypes = {
  data: PropTypes.object.isRequired,
};

export default Stats;
