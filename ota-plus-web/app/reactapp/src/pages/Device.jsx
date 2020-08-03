/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { withTranslation } from 'react-i18next';
import { MetaData, FadeAnimation } from '../utils';
import { DeviceContainer } from '../containers';
import { PAGE_DEVICE } from '../constants';

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
    match: PropTypes.shape({}),
    t: PropTypes.func.isRequired
  };

  componentDidMount() {
    const { stores, match } = this.props;
    const { softwareStore, devicesStore } = stores;
    const { params } = match;
    softwareStore.page = PAGE_DEVICE;
    devicesStore.fetchDevice(params.id);
    softwareStore.fetchPackages();
    softwareStore.fetchPackagesHistory(params.id, softwareStore.packagesHistoryFilter);
    devicesStore.fetchDeviceNetworkInfo(params.id);
    devicesStore.fetchMultiTargetUpdates(params.id);
    devicesStore.fetchEvents(params.id);
    devicesStore.getDeviceSpecificTags(params.id);
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
    const { stores, t } = this.props;
    const { hardwareStore } = stores;
    return (
      <FadeAnimation>
        <span>
          <MetaData
            title={hardwareStore.activeEcu.hardwareId
              ? t('devices.device_control_units') : t('devices.device_overview')}
          >
            <DeviceContainer />
          </MetaData>
        </span>
      </FadeAnimation>
    );
  }
}

export default withTranslation()(Device);
