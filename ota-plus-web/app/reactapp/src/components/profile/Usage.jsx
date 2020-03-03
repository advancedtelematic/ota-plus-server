/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import moment from 'moment';
import { withTranslation } from 'react-i18next';
import Items from './usage/Items';
import { MetaData } from '../../utils';
import { setAnalyticsView } from '../../helpers/analyticsHelper';
import { ANALYTICS_VIEW_USAGE } from '../../constants/analyticsViews';
import {
  USAGE_DATE_DATA_FORMAT,
  USAGE_DATE_MONTH_DATA_FORMAT,
  USAGE_DATE_YEAR_DATA_FORMAT
} from '../../constants/datesTimesConstants';

const startTime = moment([2017, 0, 1]);
const currentTime = moment();
const monthsCount = currentTime.diff(startTime, 'months');
const months = [];
for (let i = 0; i <= monthsCount; i += 1) {
  const date = moment(startTime).add(i, 'months');
  months.push(date.format(USAGE_DATE_DATA_FORMAT));
}

@inject('stores')
@observer
class Usage extends Component {
  componentWillMount() {
    const { stores, t } = this.props;
    const { userStore } = stores;
    userStore.setUsageInitial(startTime, monthsCount);
    this.fetchUsage();
    this.title = t('profile.usage.title');
  }

  componentDidMount() {
    setAnalyticsView(ANALYTICS_VIEW_USAGE);
  }

  fetchUsage = () => {
    const { stores } = this.props;
    const { userStore } = stores;
    for (let i = monthsCount; i >= monthsCount - 2; i -= 1) {
      const startTimeTmp = moment(startTime).add(i, 'months');
      const endTimeTmp = moment(startTimeTmp).add(1, 'months');
      userStore.fetchActivatedDeviceCount(startTimeTmp, endTimeTmp);
      userStore.fetchActiveDeviceCount(startTimeTmp, endTimeTmp);
      userStore.fetchConnectedDeviceCount(
        startTimeTmp.format(USAGE_DATE_YEAR_DATA_FORMAT),
        startTimeTmp.format(USAGE_DATE_MONTH_DATA_FORMAT)
      );
    }
  };

  render() {
    return (
      <div className="profile-container" id="usage">
        <MetaData title={this.title}>
          <div className="section-header">
            <div className="column">Date</div>
            <div className="column">Total activated devices</div>
            <div className="column">New devices activated this month</div>
            <div className="column">Devices connected this month</div>
          </div>
          <div className="usage-info">
            <Items months={months} />
          </div>
        </MetaData>
      </div>
    );
  }
}

Usage.propTypes = {
  stores: PropTypes.shape({}),
  t: PropTypes.func.isRequired
};

export default withTranslation()(Usage);
