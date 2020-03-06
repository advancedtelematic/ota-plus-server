/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import moment from 'moment';
import { Loader } from '../../../partials';
import {
  USAGE_ITEM_DATE_FORMAT,
  USAGE_DATE_MONTH_DATA_FORMAT,
  USAGE_DATE_YEAR_DATA_FORMAT
} from '../../../constants/datesTimesConstants';

@inject('stores')
@observer
class Item extends Component {
  componentWillMount() {
    const { fetch, date, stores } = this.props;
    const { userStore } = stores;
    if (fetch.active.status === null && !fetch.active.isFetching) {
      const startTime = date;
      const startTimeTmp = moment(startTime);
      const endTimeTmp = moment(startTimeTmp).add(1, 'months');
      userStore.fetchActivatedDeviceCount(startTimeTmp, endTimeTmp);
      userStore.fetchActiveDeviceCount(startTimeTmp, endTimeTmp);
      userStore.fetchConnectedDeviceCount(
        startTimeTmp.format(USAGE_DATE_YEAR_DATA_FORMAT),
        startTimeTmp.format(USAGE_DATE_MONTH_DATA_FORMAT)
      );
    }
  }

  render() {
    const { usage, fetch, date } = this.props;
    const dateFormatted = date.format(USAGE_ITEM_DATE_FORMAT);
    return (
      <div className="box">
        <div className="column" id={`month-${dateFormatted}`}>
          {dateFormatted}
        </div>
        <div className="column" id={`target_total_activated_devices_${dateFormatted}`}>
          {fetch.active.isFetching ? <Loader size={20} thickness={2.5} /> : usage.active}
        </div>
        <div className="column" id={`target_total_activated_devices_this_month_${dateFormatted}`}>
          {fetch.activated.isFetching ? <Loader size={20} thickness={2.5} /> : usage.activated}
        </div>
        <div className="column" id={`target_total_connected_devices_this_month_${dateFormatted}`}>
          {fetch.connected.isFetching ? <Loader size={20} thickness={2.5} /> : usage.connected.numberOfDevices}
        </div>
      </div>
    );
  }
}

Item.propTypes = {
  usage: PropTypes.shape({}).isRequired,
  fetch: PropTypes.shape({}).isRequired,
  stores: PropTypes.shape({}),
  date: PropTypes.shape({}).isRequired,
};

export default Item;
