/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';
import MtuListItem from './MtuListItem';

@inject('stores')
@observer
class MtuQueueList extends Component {
  render() {
    const { cancelMtuUpdate, stores } = this.props;
    const { devicesStore } = stores;
    const emptyQueue = (
      <div className="overview-panel__list">
        <div className="wrapper-center">
          <span className="overview-panel__empty">
            {'There aren\'t any updates queued for this device.'}
          </span>
        </div>
      </div>
    );
    return (
      <ul className={`overview-panel__list${!devicesStore.multiTargetUpdates.length ? ' empty' : ''}`}>
        {devicesStore.multiTargetUpdates.length
          ? _.map(devicesStore.multiTargetUpdates, (update, index) => {
            const itemEvents = devicesStore.deviceEvents.filter((el) => {
              if (el.payload.correlationId) {
                return el.payload.correlationId === update.correlationId;
              }
              return null;
            });
            return <MtuListItem key={index} update={update} cancelMtuUpdate={cancelMtuUpdate} events={itemEvents} />;
          })
          : emptyQueue}
      </ul>
    );
  }
}
MtuQueueList.propTypes = {
  stores: PropTypes.shape({}),
  cancelMtuUpdate: PropTypes.func.isRequired,
};

export default MtuQueueList;
