/** @format */

import React, { Component, PropTypes } from 'react';
import { observable, toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import _ from 'underscore';
import moment from 'moment';
import Item from './Item';
import NoHistoryItem from './NoHistoryItem';

@inject('stores')
@observer
class Items extends Component {
  @observable active = 0;
  @observable direction = '';

  constructor(props) {
    super(props);
  }
  generateElements() {
    const { months } = this.props;
    const { userStore } = this.props.stores;
    const inversedMonthUsageKeys = _.sortBy(months, month => {
      return month;
    }).reverse();

    let elements = [];
    const firstDate = moment(inversedMonthUsageKeys[inversedMonthUsageKeys.length - 1], 'YYYYMM');

    for (var i = 0; i <= months.length; i++) {
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
    return (
      <ReactCSSTransitionGroup transitionName={this.direction} transitionEnterTimeout={1000} transitionLeaveTimeout={1000}>
        {this.generateElements()}
      </ReactCSSTransitionGroup>
    );
  }
}

Items.propTypes = {
  stores: PropTypes.object,
  months: PropTypes.array.isRequired,
};

export default Items;
