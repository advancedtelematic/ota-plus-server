/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';
import moment from 'moment';
import Item from './Item';
import NoHistoryItem from './NoHistoryItem';

@inject('stores')
@observer
class Items extends Component {
  @observable active = 0;

  @observable direction = '';

  generateElements() {
    const { months, stores } = this.props;
    const { userStore } = stores;
    const inversedMonthUsageKeys = _.sortBy(months, month => month).reverse();

    const elements = [];
    const firstDate = moment(inversedMonthUsageKeys[inversedMonthUsageKeys.length - 1], 'YYYYMM');

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
        const date = moment(objKey, 'YYYYMM');
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
