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
        const { devicesStore, cancelMtuUpdate, alphaPlusEnabled, showSequencer } = this.props;
        const emptyQueue = (
            <div className="queue-modal__list">
                <div className="wrapper-center">
                    You haven't got any multi target updates pending.
                </div>
            </div>
        );
        return (
            <div>
                {devicesStore.mtuFetchAsync.isFetching || devicesStore.mtuCreateAsync.isFetching ?
                    <ul className="queue-modal__list">
                        <div className="wrapper-center">
                            <Loader />
                        </div>
                    </ul>
                :
                    devicesStore.multiTargetUpdates.length ?
                        <ul className={"queue-modal__list" + (!devicesStore.multiTargetUpdates.length ? " empty" : "")}>
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
                                            alphaPlusEnabled={alphaPlusEnabled}
                                            showSequencer={showSequencer}
                                            key={hardwareId}
                                        />
                                    );
                                });
                            })}
                        </ul>
                :
                    emptyQueue
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