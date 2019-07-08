/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';
import { Loader } from '../../partials';
import LastDevicesItem from './LastDevicesItem';
import NoItems from './NoItems';

@inject('stores')
@observer
class LastDevices extends Component {
  render() {
    const { stores } = this.props;
    const { devicesStore } = stores;
    const { lastDevices } = devicesStore;
    return (
      <span style={{ height: '100%' }}>
        {devicesStore.devicesFetchAsync.isFetching ? (
          <div className="wrapper-center">
            <Loader className="dark" />
          </div>
        ) : Object.keys(lastDevices).length ? (
          _.map(lastDevices, (device, index) => <LastDevicesItem key={device.uuid} index={index} device={device} />)
        ) : (
          <NoItems itemType="device" create={null} />
        )}
      </span>
    );
  }
}

LastDevices.propTypes = {
  stores: PropTypes.shape({}),
};

export default LastDevices;
