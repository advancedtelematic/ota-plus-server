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
    stores: PropTypes.shape({}),
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
    match: PropTypes.shape({})
  };

  componentDidMount() {
    const { stores, match } = this.props;
    const { softwareStore, devicesStore } = stores;
    const { params } = match;
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
    const { stores } = this.props;
    const { softwareStore, devicesStore, hardwareStore } = stores;
    devicesStore.reset();
    softwareStore.reset();
    hardwareStore.reset();
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
