import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import _ from 'underscore';
import { Loader } from '../../../partials';
import ListItem from './ListItem';

@observer

class List extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { packagesStore, device } = this.props;
        const emptyHistory = (
            <div className="queue-empty-center">
                Installation history is empty. <br />
                The installation of the queued packages will start
                automatically when your device connects.
            </div> 
        );
        return (
            <div>
                {packagesStore.packagesDeviceHistoryFetchAsync.isFetching || packagesStore.packagesDeviceUpdatesLogsFetchAsync.isFetching ?
                    <ul className="list history">
                        <div className="wrapper-loader">
                            <Loader />
                        </div>
                    </ul>
                :
                    packagesStore.deviceHistory.length ?
                        <ul className="list history">
                            {_.map(packagesStore.deviceHistory, (request, index) => {
                                const foundUpdateLog = _.findWhere(packagesStore.deviceUpdatesLogs, {updateId: request.updateId});
                                return (
                                    <ListItem
                                        request={request}
                                        updateLog={foundUpdateLog}
                                        packagesStore={packagesStore}
                                        key={index}
                                    />
                                );
                            })}
                        </ul>
                    :
                        emptyHistory                
                }
            </div>
        );
    }
}
List.propTypes = {
    packagesStore: PropTypes.object.isRequired,
    device: PropTypes.object.isRequired
}
export default List;