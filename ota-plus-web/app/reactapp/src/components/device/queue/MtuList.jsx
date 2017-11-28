import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import _ from 'underscore';
import { Loader } from '../../../partials';
import MtuListItem from './MtuListItem';

@observer    
class MtuQueueList extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const {devicesStore, cancelMtuUpdate } = this.props;
        return (
            <div>
                {devicesStore.multiTargetUpdatesFetchAsync.isFetching || devicesStore.multiTargetUpdateCreateAsync.isFetching ?
                    <ul className="list queue">
                        <div className="wrapper-loader">
                            <Loader />
                        </div>
                    </ul>
                :
                    devicesStore.multiTargetUpdates.length ?
                        <ul className={"list queue director-queue" + (!devicesStore.multiTargetUpdates.length ? " empty" : "")}>
                            {_.map(devicesStore.multiTargetUpdates, (update, index) => {
                                return _.map(update.targets, (target, hardwareId) => {
                                    return (
                                        <MtuListItem
                                            item={target}
                                            hardwareId={hardwareId}
                                            updateId={update.updateId}
                                            inFlight={update.inFlight}
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
                }
            </div>
        );
    }
}
MtuQueueList.propTypes = {
    devicesStore: PropTypes.object.isRequired,
    cancelMtuUpdate: PropTypes.func.isRequired,
}
export default MtuQueueList;