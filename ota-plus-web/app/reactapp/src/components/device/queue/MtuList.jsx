import React, { Component, PropTypes } from 'react';
import { observer, inject } from 'mobx-react';
import _ from 'underscore';
import { Loader } from '../../../partials';
import MtuListItem from './MtuListItem';

@inject("stores")
@observer
class MtuQueueList extends Component {
    render() {
        const { cancelMtuUpdate, showSequencer } = this.props;
        const { devicesStore } = this.props.stores;
        const emptyQueue = (
            <div className="overview-panel__list">
                <div className="wrapper-center">
                    <span className={'overview-panel__empty'}>You haven't got any multi target updates pending.</span>
                </div>
            </div>
        );
        return (
            <div>
                {devicesStore.mtuFetchAsync.isFetching || devicesStore.mtuCreateAsync.isFetching || devicesStore.eventsFetchAsync.isFetching ?
                    <ul className="overview-panel__list">
                        <div className="wrapper-center">
                            <Loader />
                        </div>
                    </ul>
                :
                    devicesStore.multiTargetUpdates.length ?
                        <ul className={"overview-panel__list" + (!devicesStore.multiTargetUpdates.length ? " empty" : "")}>
                            {_.map(devicesStore.multiTargetUpdates, (update, index) => {
                                let itemEvents = devicesStore.deviceEvents.filter(el => {
                                    if (el.payload.correlationId) {
                                        return el.payload.correlationId === update.correlationId
                                    }
                                });
                                    return (
                                        <MtuListItem
                                            key={index}
                                            update={update}
                                            cancelMtuUpdate={cancelMtuUpdate}
                                            showSequencer={showSequencer}
                                            events={itemEvents}
                                        />
                                    );
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
    stores: PropTypes.object,
    cancelMtuUpdate: PropTypes.func.isRequired,
}

export default MtuQueueList;