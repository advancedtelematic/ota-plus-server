/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { MetaData, FadeAnimation } from '../utils';
import { DeviceContainer } from '../containers';

const title = 'Device';

@inject('stores')
@observer
class Device extends Component {
  @observable
  sequencerShown = false;

  static propTypes = {
    stores: PropTypes.object,
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  };

  componentDidMount() {
    const { softwareStore, devicesStore } = this.props.stores;
    const { params } = this.props.match;
    softwareStore.page = 'device';
    devicesStore.fetchDevice(params.id);
    softwareStore.fetchPackages();
    softwareStore.fetchPackagesHistory(params.id, softwareStore.packagesHistoryFilter);
    devicesStore.fetchDeviceNetworkInfo(params.id);
    devicesStore.fetchMultiTargetUpdates(params.id);
    devicesStore.fetchEvents(params.id);
    devicesStore.fetchApprovalPendingCampaigns(params.id);
  }

  componentWillUnmount() {
    const { softwareStore, devicesStore, hardwareStore } = this.props.stores;
    devicesStore._reset();
    softwareStore._reset();
    hardwareStore._reset();
  }

  render() {
    return (
      <FadeAnimation>
        <span>
          <MetaData title={title}>
            <DeviceContainer />
          </MetaData>
        </span>
      </FadeAnimation>
    );
  }
}

export default Device;
