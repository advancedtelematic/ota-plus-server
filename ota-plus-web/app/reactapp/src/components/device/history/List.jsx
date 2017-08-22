import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import _ from 'underscore';
import { Loader } from '../../../partials';
import ListItem from './ListItem';
import MultiTargetList from './MultiTargetList';
import { InfiniteScroll } from '../../../utils';

@observer

class List extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { packagesStore, device } = this.props;
        return (
            <div>
                {device.isDirector ?
                    <MultiTargetList 
                        packagesStore={packagesStore}
                        device={device}
                    />
                :
                    packagesStore.packagesDeviceHistoryFetchAsync.isFetching || packagesStore.packagesDeviceUpdatesLogsFetchAsync.isFetching ?
                        <ul className="list history">
                            <div className="wrapper-loader">
                                <Loader />
                            </div>
                        </ul>
                    :
                        Object.keys(packagesStore.deviceHistoryPerDevice[device.uuid]).length ?
                            <ul className="list history">
                                {_.map(packagesStore.deviceHistoryPerDevice[device.uuid], (request, index) => {
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
                            <div className="queue-empty-center">
                                Installation history is empty. <br />
                                The installation of the queued packages will start
                                automatically when your device connects.
                            </div>                    
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