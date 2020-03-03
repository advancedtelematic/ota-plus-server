/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { inject } from 'mobx-react';
import _ from 'lodash';
import moment from 'moment';
import Item from './Item';
import NoHistoryItem from './NoHistoryItem';
import { DEVICE_ACTIVATED_DATE_DATA_FORMAT } from '../../../constants/datesTimesConstants';

@inject('stores')
class Items extends Component {
  generateElements() {
    const { months, stores } = this.props;
    const { userStore } = stores;
    const inversedMonthUsageKeys = _.sortBy(months, month => month).reverse();

    const elements = [];
    const firstDate = moment(
      inversedMonthUsageKeys[inversedMonthUsageKeys.length - 1], DEVICE_ACTIVATED_DATE_DATA_FORMAT
    );

    for (let i = 0; i <= months.length; i += 1) {
      if (i < months.length) {
        const objKey = inversedMonthUsageKeys[i];
        const usage = {
          activated: userStore.activatedDevices.get(objKey),
          active: userStore.activeDevices.get(objKey),
          connected: userStore.connectedDevices.get(objKey),
        };
        const fetch = {
          activated: userStore.activatedDevicesFetchAsync.get(objKey),
          active: userStore.activeDevicesFetchAsync.get(objKey),
          connected: userStore.connectedDevicesFetchAsync.get(objKey),
        };
        const date = moment(objKey, DEVICE_ACTIVATED_DATE_DATA_FORMAT);
        elements.push(<Item key={i} usage={usage} fetch={fetch} date={date} />);
      } else {
        const date = moment(firstDate).subtract(i - inversedMonthUsageKeys.length + 1, 'months');
        elements.push(<NoHistoryItem key={i} date={date} />);
      }
    }
    return elements;
  }

  render() {
    return <div>{this.generateElements()}</div>;
  }
}

Items.propTypes = {
  stores: PropTypes.shape({}),
  months: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Items;
