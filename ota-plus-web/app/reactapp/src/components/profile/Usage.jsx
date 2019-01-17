/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import moment from 'moment';
import Items from './usage/Items';

const startTime = moment([2017, 0, 1]);
const currentTime = moment();
const monthsCount = currentTime.diff(startTime, 'months');
let months = [];
for (var i = 0; i <= monthsCount; i++) {
  const date = moment(startTime).add(i, 'months');
  months.push(date.format('YYYYMM'));
}

@inject('stores')
@observer
class Usage extends Component {
  componentWillMount() {
    const { userStore } = this.props.stores;
    userStore._setUsageInitial(startTime, monthsCount);
    this.fetchUsage();
  }

  fetchUsage = () => {
    const { userStore } = this.props.stores;
    for (var i = monthsCount; i >= monthsCount - 2; i--) {
      const startTimeTmp = moment(startTime).add(i, 'months');
      const endTimeTmp = moment(startTimeTmp).add(1, 'months');
      userStore.fetchActivatedDeviceCount(startTimeTmp, endTimeTmp);
      userStore.fetchActiveDeviceCount(startTimeTmp, endTimeTmp);
      userStore.fetchConnectedDeviceCount(startTimeTmp.format('YYYY'), startTimeTmp.format('MM'));
    }
  };

  render() {
    return (
      <div className='profile-container' id='usage'>
        <div className='section-header'>
          <div className='column'>Date</div>
          <div className='column'>Total activated devices</div>
          <div className='column'>New devices activated this month</div>
          <div className='column'>Devices connected this month</div>
        </div>
        <div className='usage-info'>
          <Items months={months} />
        </div>
      </div>
    );
  }
}

Usage.propTypes = {
  stores: PropTypes.object,
};

export default Usage;
