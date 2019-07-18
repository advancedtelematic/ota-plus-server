/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import moment from 'moment';
import _ from 'lodash';
import { withTranslation } from 'react-i18next';

const activeColor = '#48DAD0';
const inActiveColor = '#F3F3F4';

@observer
class Barchart extends Component {
  render() {
    const { connections, t } = this.props;
    const currentHour = moment().hour();
    const currentMinutes = moment().minutes();

    return (
      <div className="bar-chart">
        <div className="br">
          {_.map(connections.live, (count, hour) => {
            const bgColor = hour < currentHour ? activeColor : inActiveColor;
            const percentageFilled = hour === currentHour ? (currentMinutes / 60) * 100 : 100;
            const limit = connections.limit.split('.').join('');
            return (
              <div
                className={`bar${count === 0 ? ' empty' : ''}`}
                style={{
                  height: `${(count / limit) * 100}%`,
                  backgroundColor: bgColor,
                }}
                key={hour}
                data-hour={hour}
              >
                {percentageFilled !== 100 ? (
                  <div
                    className="bar-wrapper"
                    style={{
                      height: `${percentageFilled}%`,
                      backgroundColor: activeColor,
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                    }}
                  />
                ) : null}
              </div>
            );
          })}
        </div>
        <div className="period">
          <div className="start">0h</div>
          <div className="end">23h</div>
        </div>
        <div className="legends">
          <ul className="value-legend">
            <li>
              <div className="title-box">{t('devices.dashboard.limit')}</div>
              <div>{connections.limit}</div>
            </li>
            <li>
              <div className="title-box">{t('devices.dashboard.peak')}</div>
              <div>{connections.max}</div>
            </li>
            <li>
              <div className="title-box">{t('devices.dashboard.avg')}</div>
              <div>{connections.avg}</div>
            </li>
          </ul>
          <ul className="color-legend">
            <li>
              <div className="title-box">{t('devices.dashboard.reported')}</div>
              <div className="color-box" style={{ backgroundColor: activeColor }} />
            </li>
            <li>
              <div className="title-box">{t('devices.dashboard.forecast')}</div>
              <div className="color-box" style={{ backgroundColor: inActiveColor }} />
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

Barchart.propTypes = {
  connections: PropTypes.shape({}),
  t: PropTypes.func.isRequired
};

export default withTranslation()(Barchart);
