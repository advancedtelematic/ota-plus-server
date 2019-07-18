/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';
import { withTranslation } from 'react-i18next';

import MtuListItem from './MtuListItem';

@inject('stores')
@observer
class MtuQueueList extends Component {
  render() {
    const { cancelMtuUpdate, stores, t } = this.props;
    const { devicesStore } = stores;
    const emptyQueue = (
      <div className="overview-panel__list">
        <div className="wrapper-center">
          <span className="overview-panel__empty">
            {t('devices.mtu.queue.no_updates')}
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
  cancelMtuUpdate: PropTypes.func.isRequired,
  stores: PropTypes.shape({}),
  t: PropTypes.func.isRequired
};

export default withTranslation()(MtuQueueList);
