/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';
import { withTranslation } from 'react-i18next';
import { Pagination } from 'antd';

import MtuListItem from './MtuListItem';
import { CAMPAIGNS_ICON_GRAY, DEVICE_HISTORY_LIMIT } from '../../../config';

const PAGE_NUMBER_DEFAULT = 1;

@inject('stores')
@observer
class MtuList extends Component {
  constructor(props) {
    super(props);
    this.state = { pageNumber: PAGE_NUMBER_DEFAULT };
  }

  onPageChange = (page, pageSize) => {
    this.setState({ pageNumber: page });
    const { device, stores } = this.props;
    const { softwareStore } = stores;
    softwareStore.fetchPackagesHistory(device.uuid, '', false, DEVICE_HISTORY_LIMIT, (page - 1) * pageSize);
  };

  showTotalTemplate = (total, range) => (total > 0 ? `${range[0]}-${range[1]} of ${total}` : '');

  render() {
    const { stores, t } = this.props;
    const { pageNumber } = this.state;
    const { softwareStore, devicesStore } = stores;
    const { packagesHistory, packagesHistoryTotalCount } = softwareStore;
    const emptyHistory = (
      <div className="wrapper-center">
        <span className="overview-panel__empty">
          <img src={CAMPAIGNS_ICON_GRAY} />
          <div>{t('devices.mtu.history.no-updates-1')}</div>
          <div>{t('devices.mtu.history.no-updates-2')}</div>
        </span>
      </div>
    );
    return (
      <ul className="overview-panel__list">
        {packagesHistory.length
          ? (
            <>
              {_.map(packagesHistory, (historyItem, index) => {
                if (!_.isEmpty(devicesStore.deviceEvents)) {
                  const itemEvents = devicesStore.deviceEvents.filter((event) => {
                    if (event.payload.correlationId) {
                      return event.payload.correlationId === historyItem.correlationId;
                    }
                    return null;
                  });
                  return <MtuListItem item={historyItem} key={index} events={itemEvents} />;
                }
                return null;
              })}
              <div className="ant-pagination__wrapper ant-pagination__wrapper--absolute clearfix">
                <Pagination
                  current={pageNumber}
                  defaultPageSize={DEVICE_HISTORY_LIMIT}
                  onChange={this.onPageChange}
                  total={packagesHistoryTotalCount}
                  showTotal={this.showTotalTemplate}
                />
              </div>
            </>
          )
          : emptyHistory}
      </ul>
    );
  }
}

MtuList.propTypes = {
  device: PropTypes.shape({}).isRequired,
  stores: PropTypes.shape({}),
  t: PropTypes.func.isRequired
};

export default withTranslation()(MtuList);
