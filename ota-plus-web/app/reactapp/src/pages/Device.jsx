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
    const { packagesStore, devicesStore } = this.props.stores;
    const { params } = this.props.match;
    packagesStore.page = 'device';
    devicesStore.fetchDevice(params.id);
    packagesStore.fetchPackages();
    packagesStore.fetchPackagesHistory(params.id, packagesStore.packagesHistoryFilter);
    devicesStore.fetchDeviceNetworkInfo(params.id);
    devicesStore.fetchMultiTargetUpdates(params.id);
    devicesStore.fetchEvents(params.id);
    devicesStore.fetchApprovalPendingCampaigns(params.id);
  }

  componentWillUnmount() {
    const { packagesStore, devicesStore, hardwareStore } = this.props.stores;
    devicesStore._reset();
    packagesStore._reset();
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
