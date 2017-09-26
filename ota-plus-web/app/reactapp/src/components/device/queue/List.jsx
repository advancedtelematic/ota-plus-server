import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import _ from 'underscore';
import { Loader } from '../../../partials';
import ListItem from './ListItem';
import MultiTargetItem from './MultiTargetItem';

@observer
    
class List extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const {packagesStore, devicesStore, cancelInstallation, cancelMtuUpdate, device } = this.props;
        return (
            <div>
                {device.isDirector ?
                    devicesStore.multiTargetUpdatesFetchAsync.isFetching || devicesStore.multiTargetUpdateCreateAsync.isFetching ?
                        <ul className="list queue">
                            <div className="wrapper-loader">
                                <Loader />
                            </div>
                        </ul>
                    :
                        Object.keys(devicesStore.multiTargetUpdates[device.uuid]).length ?
                            <ul className={"list queue director-queue" + (!Object.keys(devicesStore.multiTargetUpdates[device.uuid]).length ? " empty" : "")}>
                                {_.map(devicesStore.multiTargetUpdates[device.uuid], (update, index) => {
                                    return _.map(update.targets, (target, hardwareId) => {
                                        return (
                                            <MultiTargetItem
                                                item={target}
                                                hardwareId={hardwareId}
                                                updateId={update.updateId}
                                                inFlight={update.inFlight}
                                                deviceId={device.uuid}
                                                length={target.image.fileinfo.length}
                                                cancelMtuUpdate={cancelMtuUpdate}
                                                key={hardwareId}
                                            />
                                        );
                                    });
                                })}
                            </ul>
                    :
                        <div className="queue-empty-center">
                            You haven't got any multi target updates pending. <br />
                        </div>
                :
                    packagesStore.packagesDeviceQueueFetchAsync.isFetching ?
                        <ul className={"list queue" + (!packagesStore.deviceQueue.length ? " empty" : "")}>
                            <div className="wrapper-loader">
                                <Loader />
                            </div>
                        </ul>
                        :
                        packagesStore.deviceQueue.length ?
                            <ul className={"list queue" + (!packagesStore.deviceQueue.length ? " empty" : "")}>
                                {_.map(packagesStore.deviceQueue, (request, index) => {
                                    return (
                                        <ListItem
                                            request={request}
                                            cancelInstallation={cancelInstallation}
                                            key={index}
                                        />
                                    );
                                })}
                            </ul>
                            :
                            <div className="queue-empty-center">
                                Installation queue is empty. <br />
                                Click on a package you want to install and
                                select a version to add it to the queue.
                            </div>
                }
            </div>
        );
    }
}
List.propTypes = {
    packagesStore: PropTypes.object.isRequired,
    devicesStore: PropTypes.object.isRequired,
    cancelInstallation: PropTypes.func.isRequired,
    device: PropTypes.object.isRequired,
}
export default List;