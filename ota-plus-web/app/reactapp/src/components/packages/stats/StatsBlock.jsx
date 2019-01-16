/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import _ from 'lodash';
import { Doughnut } from 'react-chartjs-2';
import { Loader } from '../../../partials';
import { FadeAnimation } from '../../../utils';

@observer
class StatsBlock extends Component {
  render() {
    const { pack, size, type } = this.props;
    let availableColors = [];
    if (type === 'groups' || type === 'devices') {
      availableColors = ['#FA9D00', '#069F71', '#670195', '#B7B9BC'];
    } else if (type === 'results') {
      availableColors = ['#06B87C', '#D0021B'];
    } else {
      availableColors = ['#1D5E6F', '#9DDDD4', '#fff', '#D3D3D3'];
    }

    let colorIndex = -1;
    let statsPackIndex = 0;
    let stats = {
      datasets: [
        {
          data: [],
          label: [],
          backgroundColor: [],
          hoverBackgroundColor: [],
          borderWidth: 5,
          hoverBorderWidth: 5,
        },
      ],
    };
    let installedOnEcusTotal = 0;
    let data = pack.versions;
    if (type === 'groups') {
      data = pack.stats.groups;
    } else if (type === 'results') {
      data = pack.stats.installationResults;
    }

    _.each(data, (version, index) => {
      if (version.installedOnEcus > 0 || version) {
        if (statsPackIndex < availableColors.length) {
          colorIndex++;
          statsPackIndex++;
          if (type === 'groups' || type === 'results') {
            stats.datasets[0].data.push(version);
            stats.datasets[0].label.push(index);
            stats.datasets[0].backgroundColor.push(availableColors[colorIndex]);
            stats.datasets[0].hoverBackgroundColor.push(availableColors[colorIndex]);
          } else {
            stats.datasets[0].data.push(version.installedOnEcus);
            stats.datasets[0].label.push(type === 'devices' ? index : statsPackIndex === availableColors.length - 1 ? 'Other' : version.id.version);
            stats.datasets[0].backgroundColor.push(availableColors[colorIndex]);
            stats.datasets[0].hoverBackgroundColor.push(availableColors[colorIndex]);
          }
        } else if (statsPackIndex >= availableColors.length) {
          stats.datasets[0].data[availableColors.length - 1] = version.installedOnEcus + stats.datasets[0].data[availableColors.length - 1];
        }
        if (!type) {
          version.color = availableColors[colorIndex];
        }
      }
      installedOnEcusTotal += version.installedOnEcus;
    });
    const content = (
      <div className='chart-panel' id={'package-' + pack.packageName + '-stats'}>
        <div className={installedOnEcusTotal ? 'wrapper-center' : 'wrapper-center'}>
          <div className={installedOnEcusTotal ? 'total-count' : 'hide'}>{installedOnEcusTotal}</div>
          {type === 'results' ? <div className='total-count'>{stats.datasets[0].data[1]}%</div> : ''}
          {stats.datasets[0].data.length ? (
            <div className='canvas-wrapper'>
              <Doughnut
                data={stats}
                width={size.width || 250}
                height={size.height || 250}
                options={{
                  cutoutPercentage: 60,
                }}
              />
              <div className='colors-info'>
                {type
                  ? _.map(stats.datasets[0].label, (label, index) => {
                      return (
                        <p key={index}>
                          <span className='square' style={{ backgroundColor: `${stats.datasets[0].backgroundColor[index]}` }} />
                          {label}
                        </p>
                      );
                    })
                  : ''}
              </div>
            </div>
          ) : (
            <div id={'package-' + pack.packageName + '-not-installed'} style={{ textAlign: 'left' }}>
              This package has not been installed yet.
            </div>
          )}
        </div>
      </div>
    );
    return <div className='packages-stats'>{content}</div>;
  }
}

StatsBlock.propTypes = {
  pack: PropTypes.object.isRequired,
};

StatsBlock.defaultProps = {
  size: { width: '250', height: '250' },
};

export default StatsBlock;
