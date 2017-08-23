import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import _ from 'underscore';
import { Loader } from '../../../partials';
import ListItem from './ListItem';
import MultiTargetItem from './MultiTargetItem';
import { InfiniteScroll } from '../../../utils';

@observer

class MultiTargetList extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { packagesStore, device } = this.props;
        return (
            <ul className="list history">
                <InfiniteScroll
                    className="wrapper-infinite-scroll"
                    hasMore={packagesStore.directorDeviceHistoryCurrentPage < packagesStore.directorDeviceHistoryTotalCount / packagesStore.directorDeviceHistoryLimit}
                    isLoading={packagesStore.packagesDirectorDeviceHistoryFetchAsync.isFetching}
                    useWindow={false}
                    threshold={50}
                    loadMore={() => {
                        packagesStore.fetchDirectorDevicePackagesHistory(device.uuid, packagesStore.directorDevicePackagesFilter)
                    }}
                >
                    {!_.isEmpty(packagesStore.directorDeviceHistoryPerDevice[device.uuid]) ?
                        _.map(packagesStore.directorDeviceHistoryPerDevice[device.uuid], (historyItem, index) => {
                            return (
                                <MultiTargetItem
                                    item={historyItem}
                                    key={index}
                                />
                            );
                        })
                    :
                        !packagesStore.packagesDirectorDeviceHistoryFetchAsync.isFetching ?
                            <div className="queue-empty-center">
                                Multi target update history is empty.
                            </div>
                        :
                            null                        
                    }
                     
                </InfiniteScroll>
            </ul>
        );
    }
}
MultiTargetList.propTypes = {
    packagesStore: PropTypes.object.isRequired,
    device: PropTypes.object.isRequired
}
export default MultiTargetList;