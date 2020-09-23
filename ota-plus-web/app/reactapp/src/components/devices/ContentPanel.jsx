/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { observe } from 'mobx';
import _ from 'lodash';
import { withTranslation } from 'react-i18next';
import { Collapse, Pagination, Tag } from 'antd';

import DeviceItem from './Item';
import BarChart from './BarChart';
import Stats from './Stats';
import ContentPanelHeader from './ContentPanelHeader';
import ContentPanelSubheader from './ContentPanelSubheader';
import { Loader } from '../../partials';
import { ARTIFICIAL } from '../../constants';
import {
  ALPHA_TAG,
  DEVICES_FETCH_NAME_DEVICES_FILTER,
  DEVICES_LIMIT_PER_PAGE,
  DEVICES_PAGE_NUMBER_DEFAULT,
  FEATURES,
  DEVICE_ICON,
} from '../../config';
import { sendAction } from '../../helpers/analyticsHelper';
import { OTA_DEVICES_SEE_DEVICE_DETAILS } from '../../constants/analyticsActions';
import ReadMore from '../../partials/ReadMore';
import UnderlinedLink from '../../partials/UnderlinedLink';
import { URL_CREATE_FIXED_GROUP, URL_CREATE_SMART_GROUP } from '../../constants/urlConstants';

// eslint-disable-next-line prefer-destructuring
const Panel = Collapse.Panel;

const connections = {
  live: {
    0: 560,
    1: 300,
    2: 245,
    3: 198,
    4: 237,
    5: 564,
    6: 2545,
    7: 3253,
    8: 5284,
    9: 4573,
    10: 3142,
    11: 2573,
    12: 1642,
    13: 3573,
    14: 3235,
    15: 3463,
    16: 4074,
    17: 5036,
    18: 4546,
    19: 4055,
    20: 2573,
    21: 2024,
    22: 944,
    23: 553,
  },
  limit: '6.000',
  max: '5.603',
  avg: '3.740',
  trend: 'up',
};

const certificateRolloverData = {
  rotation: '2 years',
  expireSoon: '0',
  expired: '0',
  stats: {
    valid: 100,
    'soon expired': 54,
    expired: 54,
  },
};

const connectionsData = {
  total: '1.601.906',
  provisioning: '12.558',
  check: '1.388.885',
  update: '200.463',
  trend: 'equal',
  stats: {
    provisioning: 1,
    check: 87,
    update: 12,
  },
};

@inject('stores')
@observer
class ContentPanel extends Component {
  static propTypes = {
    stores: PropTypes.shape({}),
    changeFilter: PropTypes.func.isRequired,
    history: PropTypes.shape({}).isRequired,
    showDeleteConfirmation: PropTypes.func,
    showEditName: PropTypes.func,
    addNewWizard: PropTypes.func,
    t: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    const { stores } = this.props;
    const { devicesStore } = stores;
    this.cancelObserveDevicesStoreChange = observe(devicesStore, (change) => {
      if (change.name === DEVICES_FETCH_NAME_DEVICES_FILTER) {
        devicesStore.devicesPageNumber = DEVICES_PAGE_NUMBER_DEFAULT;
      }
    });
  }

  componentWillUnmount() {
    this.cancelObserveDevicesStoreChange();
  }

  goToDetails = (deviceId, e) => {
    const { history } = this.props;
    if (e) e.preventDefault();
    history.push(`/device/${deviceId}`);
    sendAction(OTA_DEVICES_SEE_DEVICE_DETAILS);
  };

  onPageChange = (page, pageSize) => {
    const { stores } = this.props;
    const { devicesStore } = stores;
    const { devicesFilter, devicesGroupFilter } = devicesStore;
    devicesStore.devicesPageNumber = page;
    devicesStore.loadMoreDevices(devicesFilter, devicesGroupFilter, DEVICES_LIMIT_PER_PAGE, (page - 1) * pageSize);
  };

  showTotalTemplate = (total, range) => (total > 0 ? `${range[0]}-${range[1]} of ${total}` : '');

  render() {
    const { stores, changeFilter, showDeleteConfirmation, showEditName, addNewWizard, t } = this.props;
    const { devicesStore, featuresStore, groupsStore, userStore } = stores;
    const { features } = featuresStore;
    const {
      devices,
      devicesFilter,
      devicesTotalCount,
      devicesPageNumber
    } = devicesStore;
    const { selectedGroup } = groupsStore;
    const { type, isSmart } = selectedGroup;

    const isGroupsKPIEnabled = features.includes(FEATURES.DASHBOARD_CHARTS);
    const items = [];
    const isFetchingDevices = devicesStore.devicesFetchAsync.isFetching || devicesStore.devicesLoadMoreAsync.isFetching;

    _.map(devices, (device, index) => {
      items.push(
        <DeviceItem
          device={device}
          goToDetails={this.goToDetails}
          showDeleteConfirmation={showDeleteConfirmation}
          showEditName={showEditName}
          key={`device-item-${index}-${device.uuid}`}
          stores={{
            devicesStore,
            featuresStore,
            groupsStore,
          }}
          uiFeatures={userStore.uiFeatures}
        />
      );
    });

    const fakeDashboard = (
      <>
        <div className="devices-panel__top-wrapper">
          <div className="devices-panel__dashboard-top">
            <div className="devices-panel__title">{t('devices.dashboard.simultaneous_connections')}</div>
            {'560/600'}
            <div className="devices-panel__dashboard-top-icon" />
          </div>
          <div className="devices-panel__dashboard-top">
            <div className="devices-panel__title">{t('devices.dashboard.total_devices')}</div>
            {'134.000'}
          </div>
          <div className="devices-panel__dashboard-top">
            <div className="devices-panel__title">{t('devices.dashboard.total_connections')}</div>
            {'69.000'}
            <div className="devices-panel__dashboard-top-icon" />
          </div>
        </div>
        <div className="devices-panel__dashboard-bottom">
          <div className="devices-panel__dashboard-content">
            <div className="devices-panel__title">{t('devices.dashboard.live_connections')}</div>
            <div className="devices-panel__dashboard-data">
              <BarChart connections={connections} />
            </div>
          </div>
          <div className="devices-panel__dashboard-content">
            <div className="devices-panel__title">{t('devices.dashboard.certificate_rollover')}</div>
            <div className="devices-panel__dashboard-data">
              <Stats data={certificateRolloverData.stats} indicatorColors />
            </div>
          </div>
          <div className="devices-panel__dashboard-content">
            <div className="devices-panel__title">{t('devices.dashboard.connections')}</div>
            <div className="devices-panel__dashboard-data">
              <Stats data={connectionsData.stats} indicatorColors={false} />
            </div>
          </div>
        </div>
      </>
    );

    return (
      <div className="devices-panel">
        <ContentPanelHeader devicesFilter={devicesFilter} changeFilter={changeFilter} addNewWizard={addNewWizard} />
        <div className={`devices-panel__wrapper ${isSmart ? 'devices-panel__wrapper--smart' : ''}`}>
          <div className="devices-panel__dashboard">
            <Collapse accordion>
              {isSmart && (groupsStore.expressionForSelectedGroupFetchAsync.isFetching ? (
                <div className="wrapper-center">
                  <Loader />
                </div>
              ) : (
                <Panel
                  header={(
                    <div className="devices-panel__title">
                      {t('groups.panels.filters.title')}
                    </div>
                  )}
                >
                  <ContentPanelSubheader />
                </Panel>
              ))}
              {isSmart && isGroupsKPIEnabled && (
                <Panel
                  header={(
                    <div className="devices-panel__title">
                      {t('devices.dashboard.title')}
                      <Tag color="#00B6B2" className="alpha-tag">
                        {ALPHA_TAG}
                      </Tag>
                    </div>
                  )}
                >
                  {fakeDashboard}
                </Panel>
              )}
            </Collapse>
          </div>
          <div
            className={`devices-panel__list${isGroupsKPIEnabled ? ' devices-panel__list--alpha' : ''}`}
          >
            {isFetchingDevices ? (
              <div className="wrapper-center">
                <Loader />
              </div>
            )
              : (
                <div id="devices-list-container" className="devices-panel_container">
                  {devices.length ? (
                    <div>
                      {items}
                    </div>
                  ) : (
                    <div className="devices-panel__list-empty-wrapper">
                      <div className="devices-panel__list-empty">
                        <img src={DEVICE_ICON} />
                        {type === ARTIFICIAL
                          ? t('devices.all_grouped')
                          : isSmart
                            ? (
                              <>
                                <div>{t('devices.empty-group-smart-1')}</div>
                                <ReadMore>
                                  <span>
                                    {t('devices.empty-group-smart-2')}
                                    <UnderlinedLink url={URL_CREATE_SMART_GROUP}>
                                      {t('miscellaneous.read-more')}
                                    </UnderlinedLink>
                                  </span>
                                </ReadMore>
                              </>
                            )
                            : (
                              <>
                                <div>{t('devices.empty-group-fixed-1')}</div>
                                <ReadMore>
                                  <span>
                                    {t('devices.empty-group-fixed-2')}
                                    <UnderlinedLink url={URL_CREATE_FIXED_GROUP}>
                                      {t('miscellaneous.read-more')}
                                    </UnderlinedLink>
                                  </span>
                                </ReadMore>
                              </>
                            )
                        }
                      </div>
                    </div>
                  )}
                </div>
              )}
            {devices.length
            && !isFetchingDevices
            && (
              <div className="ant-pagination__wrapper clearfix">
                <Pagination
                  current={devicesPageNumber}
                  defaultPageSize={DEVICES_LIMIT_PER_PAGE}
                  onChange={this.onPageChange}
                  total={devicesTotalCount}
                  showTotal={this.showTotalTemplate}
                />
              </div>
            )}
          </div>
          {!isSmart && isGroupsKPIEnabled && (
            <div className="devices-panel__dashboard">
              <div className="devices-panel__title devices-panel__title--margin">
                {t('devices.dashboard.title')}
                <Tag color="#00B6B2" className="alpha-tag">
                  {ALPHA_TAG}
                </Tag>
              </div>
              {fakeDashboard}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default withTranslation()(withRouter(ContentPanel));
