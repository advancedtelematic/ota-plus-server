/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import _ from 'lodash';

@observer
class LastDevicesItem extends Component {
  render() {
    const { device, index } = this.props;
    const link = 'device/' + device.uuid;
    const lastSeenDate = new Date(device.lastSeen);
    let deviceStatus = 'Status unknown';
    switch (device.deviceStatus) {
      case 'UpToDate':
        deviceStatus = 'Device synchronized';
        break;
      case 'Outdated':
        deviceStatus = 'Device unsynchronized';
        break;
      case 'Error':
        deviceStatus = 'Installation error';
        break;
      default:
        break;
    }
    return (
      <Link to={`${link}`} className='home__list-item' title={device.deviceName} id={'link-devicedetails-' + index}>
        <div className='home__body-col' id={'link-devicedetails-' + device.uuid}>
          {device.deviceName}
        </div>
        <div className='home__body-col'>
          {deviceStatus !== 'Status unknown' ? <span>{lastSeenDate.toDateString() + ' ' + lastSeenDate.toLocaleTimeString()}</span> : <span>Never seen online</span>}
        </div>
        <div className='home__body-col'>{deviceStatus}</div>
      </Link>
    );
  }
}

LastDevicesItem.propTypes = {
  device: PropTypes.object.isRequired,
};

export default LastDevicesItem;
