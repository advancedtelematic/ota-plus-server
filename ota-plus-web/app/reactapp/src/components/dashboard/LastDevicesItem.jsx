/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import { withTranslation } from 'react-i18next';

import { DEVICE_STATUSES } from '../../constants/deviceConstants';

@observer
class LastDevicesItem extends Component {
  render() {
    const { device, index, t } = this.props;
    const link = `device/${device.uuid}`;
    const lastSeenDate = new Date(device.lastSeen);
    let deviceStatus = t('devices.statuses.unknown');
    switch (device.deviceStatus) {
      case DEVICE_STATUSES.UP_TO_DATE:
        deviceStatus = t('devices.statuses.synchronized');
        break;
      case DEVICE_STATUSES.OUTDATED:
        deviceStatus = t('devices.statuses.unsynchronized');
        break;
      case DEVICE_STATUSES.ERROR:
        deviceStatus = t('devices.statuses.error');
        break;
      default:
        break;
    }
    return (
      <Link to={`${link}`} className="dashboard__list-item" title={device.deviceName} id={`link-devicedetails-${index}`}>
        <div className="dashboard__body-col" id={`link-devicedetails-${device.uuid}`}>
          {device.deviceName}
        </div>
        <div className="dashboard__body-col">
          {deviceStatus !== t('devices.statuses.unknown') ? <span>{`${lastSeenDate.toDateString()} ${lastSeenDate.toLocaleTimeString()}`}</span> : <span>Never seen online</span>}
        </div>
        <div className="dashboard__body-col">{deviceStatus}</div>
      </Link>
    );
  }
}

LastDevicesItem.propTypes = {
  device: PropTypes.shape({}).isRequired,
  index: PropTypes.number.isRequired,
  t: PropTypes.func.isRequired
};

export default withTranslation()(LastDevicesItem);
