/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';
import MtuListItem from './MtuListItem';
import { InfiniteScroll } from '../../../utils';

@inject('stores')
@observer
class MtuList extends Component {
  render() {
    const { device } = this.props;
    const { softwareStore, devicesStore } = this.props.stores;
    const emptyHistory = (
      <div className='wrapper-center'>
        <span className={'overview-panel__empty'}>
          {'This device hasn\'t installed any updates yet.'}
        </span>
      </div>
    );
    return (
      <ul className='overview-panel__list'>
        <InfiniteScroll
          className='wrapper-infinite-scroll'
          hasMore={softwareStore.packagesHistoryCurrentPage < softwareStore.packagesHistoryTotalCount / softwareStore.packagesHistoryLimit}
          isLoading={softwareStore.packagesHistoryFetchAsync.isFetching}
          useWindow={false}
          loadMore={() => {
            softwareStore.fetchPackagesHistory(device.uuid, softwareStore.packagesHistoryFilter);
          }}
        >
          {softwareStore.packagesHistory.length
            ? _.map(softwareStore.packagesHistory, (historyItem, index) => {
                let itemEvents = devicesStore.deviceEvents.filter(el => {
                  if (el.payload.correlationId) {
                    return el.payload.correlationId === historyItem.correlationId;
                  }
                });
                return <MtuListItem item={historyItem} key={index} events={itemEvents} />;
              })
            : emptyHistory}
        </InfiniteScroll>
      </ul>
    );
  }
}

MtuList.propTypes = {
  stores: PropTypes.object,
  device: PropTypes.object.isRequired,
};

export default MtuList;
