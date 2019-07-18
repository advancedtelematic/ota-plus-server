/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';
import { withTranslation } from 'react-i18next';

import MtuListItem from './MtuListItem';
import { InfiniteScroll } from '../../../utils';

@inject('stores')
@observer
class MtuList extends Component {
  render() {
    const { device, stores, t } = this.props;
    const { softwareStore, devicesStore } = stores;
    const emptyHistory = (
      <div className="wrapper-center">
        <span className="overview-panel__empty">
          {t('devices.mtu.history.no_updates')}
        </span>
      </div>
    );
    return (
      <ul className="overview-panel__list">
        <InfiniteScroll
          className="wrapper-infinite-scroll"
          hasMore={
            softwareStore.packagesHistoryCurrentPage
            < (softwareStore.packagesHistoryTotalCount / softwareStore.packagesHistoryLimit)
          }
          isLoading={softwareStore.packagesHistoryFetchAsync.isFetching}
          useWindow={false}
          loadMore={() => {
            softwareStore.fetchPackagesHistory(device.uuid, softwareStore.packagesHistoryFilter);
          }}
        >
          {softwareStore.packagesHistory.length
            ? _.map(softwareStore.packagesHistory, (historyItem, index) => {
              if (!_.isEmpty(devicesStore.deviceEvents)) {
                const itemEvents = devicesStore.deviceEvents.filter((el) => {
                  if (el.payload.correlationId) {
                    return el.payload.correlationId === historyItem.correlationId;
                  }
                  return null;
                });
                return <MtuListItem item={historyItem} key={index} events={itemEvents} />;
              }
              return null;
            })
            : emptyHistory}
        </InfiniteScroll>
      </ul>
    );
  }
}

MtuList.propTypes = {
  device: PropTypes.shape({}).isRequired,
  stores: PropTypes.shape({}),
  t: PropTypes.func.isRequired
};

export default withTranslation()(MtuList);
