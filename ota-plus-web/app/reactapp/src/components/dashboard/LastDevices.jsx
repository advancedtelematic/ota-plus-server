/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';
import { withTranslation } from 'react-i18next';
import { Loader } from '../../partials';
import LastDevicesItem from './LastDevicesItem';
import NoItems from './NoItems';
import { URL_QUICKSTART } from '../../constants/urlConstants';

@inject('stores')
@observer
class LastDevices extends Component {
  render() {
    const { stores, t } = this.props;
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
          <NoItems
            actionText={(
              <a
                href={URL_QUICKSTART}
                rel="noopener noreferrer"
                target="_blank"
                id="no-devices-link"
              >
                {t('dashboard.no_items.action_devices')}
              </a>
            )}
            description={t('dashboard.no_items.desc_devices')}
            create={null}
          />
        )}
      </span>
    );
  }
}

LastDevices.propTypes = {
  stores: PropTypes.shape({}),
  t: PropTypes.func.isRequired
};

export default withTranslation()(LastDevices);
