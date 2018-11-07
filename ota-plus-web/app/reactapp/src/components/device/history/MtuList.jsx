import React, { Component, PropTypes } from 'react';
import { observer, inject } from 'mobx-react';
import _ from 'underscore';
import { Loader } from '../../../partials';
import MtuListItem from './MtuListItem';
import { InfiniteScroll } from '../../../utils';

@inject("stores")
@observer
class MtuList extends Component {
    render() {
        const { device } = this.props;
        const { packagesStore, devicesStore } = this.props.stores;
        const emptyHistory = (
            <div className="wrapper-center">
                <span className={'overview-panel__empty'}>Multi target update history is empty.</span>
            </div>
        );
        return (
            <ul className="overview-panel__list">
                <InfiniteScroll
                    className="wrapper-infinite-scroll"
                    hasMore={packagesStore.packagesHistoryCurrentPage < packagesStore.packagesHistoryTotalCount / packagesStore.packagesHistoryLimit}
                    isLoading={packagesStore.packagesHistoryFetchAsync.isFetching}
                    useWindow={false}
                    loadMore={() => {
                        packagesStore.fetchPackagesHistory(device.uuid, packagesStore.packagesHistoryFilter)
                    }}
                >
                    {packagesStore.packagesHistory.length ?
                        _.map(packagesStore.packagesHistory, (historyItem, index) => {
                            let itemEvents = devicesStore.deviceEvents.filter(el => {
                               if (el.payload.correlationId) {
                                   return el.payload.correlationId.search(historyItem.updateId) >= 0
                               }
                            })
                            return (
                                <MtuListItem
                                    item={historyItem}
                                    key={index}
                                    events={itemEvents}
                                />
                            );
                        })
                        :
                        emptyHistory
                    }
                </InfiniteScroll>
            </ul>
        );
    }
}

MtuList.propTypes = {
    stores: PropTypes.object,
    device: PropTypes.object.isRequired
}

export default MtuList;