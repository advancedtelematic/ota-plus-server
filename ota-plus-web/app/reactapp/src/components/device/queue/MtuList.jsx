/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Row } from 'antd';
import _ from 'lodash';
import { withTranslation } from 'react-i18next';
import { CAMPAIGNS_ICON_GRAY } from '../../../config';
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
            <img src={CAMPAIGNS_ICON_GRAY} />
            <div>{t('devices.mtu.queue.no-updates')}</div>
          </span>
        </div>
      </div>
    );
    return (
      <ul className={`overview-panel__list${!devicesStore.multiTargetUpdates.length ? ' empty' : ''}`}>

        {devicesStore.multiTargetUpdates.length
          ? (
            <div>
              <Row className="no-margin-bottom pending-description">
                {t('devices.mtu.queue.description')}
              </Row>
              {_.map(devicesStore.multiTargetUpdates, (update, index) => {
                const { inFlight } = update;
                const itemEvents = devicesStore.deviceEvents.filter((el) => {
                  if (el.payload && el.payload.correlationId) {
                    return el.payload.correlationId === update.correlationId;
                  }
                  return null;
                });
                return (
                  <MtuListItem
                    key={index}
                    update={update}
                    inFlight={inFlight}
                    cancelMtuUpdate={cancelMtuUpdate}
                    events={itemEvents}
                  />
                );
              })}
            </div>
          )
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
