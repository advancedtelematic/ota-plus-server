/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import moment from 'moment';
import { Loader } from '../../../partials';

@inject('stores')
@observer
class Item extends Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    const { fetch, date } = this.props;
    const { userStore } = this.props.stores;
    if (fetch.active.status === null && !fetch.active.isFetching) {
      const startTime = date;
      const startTimeTmp = moment(startTime);
      const endTimeTmp = moment(startTimeTmp).add(1, 'months');
      userStore.fetchActivatedDeviceCount(startTimeTmp, endTimeTmp);
      userStore.fetchActiveDeviceCount(startTimeTmp, endTimeTmp);
      userStore.fetchConnectedDeviceCount(startTimeTmp.format('YYYY'), startTimeTmp.format('MM'));
    }
  }
  render() {
    const { usage, fetch, date } = this.props;
    const dateFormatted = date.format('MMM YYYY');
    return (
      <div className='box'>
        <div className='column' id={'month-' + dateFormatted}>
          {dateFormatted}
        </div>
        <div className='column' id={`target_total_activated_devices_${dateFormatted}`}>
          {fetch.active.isFetching ? <Loader size={20} thickness={2.5} /> : usage.active}
        </div>
        <div className='column' id={`target_total_activated_devices_this_month_${dateFormatted}`}>
          {fetch.activated.isFetching ? <Loader size={20} thickness={2.5} /> : usage.activated}
        </div>
        <div className='column' id={`target_total_connected_devices_this_month_${dateFormatted}`}>
          {fetch.connected.isFetching ? <Loader size={20} thickness={2.5} /> : usage.connected.numberOfDevices}
        </div>
      </div>
    );
  }
}

Item.propTypes = {
  usage: PropTypes.object.isRequired,
  fetch: PropTypes.object.isRequired,
  stores: PropTypes.object,
  date: PropTypes.object.isRequired,
};

export default Item;
