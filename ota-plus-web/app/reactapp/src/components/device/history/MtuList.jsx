import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import _ from 'underscore';
import { Loader } from '../../../partials';
import ListItem from './ListItem';
import MtuListItem from './MtuListItem';
import { InfiniteScroll } from '../../../utils';

@observer
class MtuList extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { packagesStore, device } = this.props;
        const emptyHistory = (
            <div className="wrapper-center">
                Multi target update history is empty.
            </div>
        );
        return (
            <ul className="list history">
                <InfiniteScroll
                    className="wrapper-infinite-scroll"
                    hasMore={packagesStore.directorDeviceHistoryCurrentPage < packagesStore.directorDeviceHistoryTotalCount / packagesStore.directorDeviceHistoryLimit}
                    isLoading={packagesStore.packagesDirectorDeviceHistoryFetchAsync.isFetching}
                    useWindow={false}
                    className={'wrapper-infinite-scroll'}
                    loadMore={() => {
                        packagesStore.fetchDirectorDevicePackagesHistory(device.uuid, packagesStore.directorDevicePackagesFilter)
                    }}
                >
                    {packagesStore.directorDeviceHistory.length ?
                        _.map(packagesStore.directorDeviceHistory, (historyItem, index) => {
                            return (
                                <MtuListItem
                                    item={historyItem}
                                    key={index}
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
    packagesStore: PropTypes.object.isRequired,
    device: PropTypes.object.isRequired
}

export default MtuList;