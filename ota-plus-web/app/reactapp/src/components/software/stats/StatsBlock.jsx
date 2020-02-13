/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import _ from 'lodash';
import { Doughnut } from 'react-chartjs-2';
import { withTranslation } from 'react-i18next';
import { DATA_TYPE } from '../../../constants';

const RESULTS_TYPE = 'results';
const CHARTS_CONFIG = {
  BORDER_WIDTH: 5,
  DEFAULT_HEIGHT: 250,
  DEFAULT_WIDTH: 250,
  CUTOUT_PERCENTAGE: 60
};

@observer
class StatsBlock extends Component {
  render() {
    const { pack, size, type, t } = this.props;
    let availableColors = [];
    if (type === DATA_TYPE.GROUPS || type === DATA_TYPE.DEVICES) {
      availableColors = ['#FA9D00', '#069F71', '#670195', '#B7B9BC'];
    } else if (type === RESULTS_TYPE) {
      availableColors = ['#06B87C', '#D0021B'];
    } else {
      availableColors = ['#1D5E6F', '#9DDDD4', '#fff', '#D3D3D3'];
    }

    let colorIndex = -1;
    let statsPackIndex = 0;
    const stats = {
      datasets: [
        {
          data: [],
          label: [],
          backgroundColor: [],
          hoverBackgroundColor: [],
          borderWidth: CHARTS_CONFIG.BORDER_WIDTH,
          hoverBorderWidth: CHARTS_CONFIG.BORDER_WIDTH,
        },
      ],
    };
    let installedOnEcusTotal = 0;
    let data = pack.versions;
    if (type === DATA_TYPE.GROUPS) {
      data = pack.stats.groups;
    } else if (type === RESULTS_TYPE) {
      data = pack.stats.installationResults;
    }

    _.each(data, (version, index) => {
      if (version.installedOnEcus > 0 || version) {
        if (statsPackIndex < availableColors.length) {
          colorIndex += 1;
          statsPackIndex += 1;
          if (type === DATA_TYPE.GROUPS || type === RESULTS_TYPE) {
            stats.datasets[0].data.push(version);
            stats.datasets[0].label.push(index);
            stats.datasets[0].backgroundColor.push(availableColors[colorIndex]);
            stats.datasets[0].hoverBackgroundColor.push(availableColors[colorIndex]);
          } else {
            stats.datasets[0].data.push(version.installedOnEcus);
            stats.datasets[0].label.push(
              type === DATA_TYPE.DEVICES
                ? index
                : statsPackIndex === availableColors.length - 1 ? 'Other' : version.id.version
            );
            stats.datasets[0].backgroundColor.push(availableColors[colorIndex]);
            stats.datasets[0].hoverBackgroundColor.push(availableColors[colorIndex]);
          }
        } else if (statsPackIndex >= availableColors.length) {
          const installedCount = version.installedOnEcus + stats.datasets[0].data[availableColors.length - 1];
          stats.datasets[0].data[availableColors.length - 1] = installedCount;
        }
        if (!type) {
          // eslint-disable-next-line no-param-reassign
          version.color = availableColors[colorIndex];
        }
      }
      installedOnEcusTotal += version.installedOnEcus;
    });
    const content = (
      <div className="chart-panel" id={`package-${pack.packageName}-stats`}>
        <div className={installedOnEcusTotal ? 'wrapper-center' : 'wrapper-center'}>
          <div className={installedOnEcusTotal ? 'total-count' : 'hide'}>{installedOnEcusTotal}</div>
          {type === RESULTS_TYPE ? (
            <div className="total-count">
              {`${stats.datasets[0].data[1]}%`}
            </div>
          ) : ''}
          {stats.datasets[0].data.length ? (
            <div className="canvas-wrapper">
              <Doughnut
                data={stats}
                width={size.width || CHARTS_CONFIG.DEFAULT_WIDTH}
                height={size.height || CHARTS_CONFIG.DEFAULT_HEIGHT}
                options={{
                  cutoutPercentage: CHARTS_CONFIG.CUTOUT_PERCENTAGE,
                }}
              />
              <div className="colors-info">
                {type
                  ? _.map(stats.datasets[0].label, (label, index) => (
                    <p key={index}>
                      <span className="square" style={{ backgroundColor: `${stats.datasets[0].backgroundColor[index]}` }} />
                      {label}
                    </p>
                  ))
                  : ''}
              </div>
            </div>
          ) : (
            <div id={`package-${pack.packageName}-not-installed`} style={{ textAlign: 'left' }}>
              {t('software.not_installed')}
            </div>
          )}
        </div>
      </div>
    );
    return <div className="packages-stats">{content}</div>;
  }
}

StatsBlock.propTypes = {
  pack: PropTypes.shape({}).isRequired,
  size: PropTypes.shape({}),
  type: PropTypes.string,
  t: PropTypes.func.isRequired
};

StatsBlock.defaultProps = {
  size: { width: '250', height: '250' },
};

export default withTranslation()(StatsBlock);
