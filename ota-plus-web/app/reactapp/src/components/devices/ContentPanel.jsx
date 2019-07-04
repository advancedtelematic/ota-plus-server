/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observe } from 'mobx';
import _ from 'lodash';
import { withTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroller';

import DeviceItem from './Item';
import BarChart from './BarChart';
import Stats from './Stats';
import ContentPanelHeader from './ContentPanelHeader';
import ContentPanelSubheader from './ContentPanelSubheader';
import { Loader } from '../../partials';
import { ARTIFICIAL } from '../../constants';
import { DEVICES_LIMIT_PER_PAGE } from '../../config';

const connections = {
  live: {
    '0': 560,
    '1': 300,
    '2': 245,
    '3': 198,
    '4': 237,
    '5': 564,
    '6': 2545,
    '7': 3253,
    '8': 5284,
    '9': 4573,
    '10': 3142,
    '11': 2573,
    '12': 1642,
    '13': 3573,
    '14': 3235,
    '15': 3463,
    '16': 4074,
    '17': 5036,
    '18': 4546,
    '19': 4055,
    '20': 2573,
    '21': 2024,
    '22': 944,
    '23': 553,
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
    stores: PropTypes.object,
    changeFilter: PropTypes.func.isRequired,
    showDeleteConfirmation: PropTypes.func,
    showEditName: PropTypes.func,
    addNewWizard: PropTypes.func,
    t: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.deviceOffsetsFetchedCache = new Set();
    const { stores } = this.props;
    const { devicesStore } = stores;
    this.cancelObserveDevicesStoreChange = observe(devicesStore, (change) => {
      if (change.name === 'devicesTotalCount' || change.name === 'devicesFilter') {
        // we have to clean the cache when device count or filter has changed
        this.deviceOffsetsFetchedCache.clear();
      }
    });
  }

  componentWillUnmount() {
    this.cancelObserveDevicesStoreChange();
  }

  goToDetails = (deviceId, e) => {
    const { router } = this.context;
    if (e) e.preventDefault();
    router.history.push(`/device/${deviceId}`);
  };

  loadDevices = async () => {
    const { stores } = this.props;
    const { devicesStore } = stores;
    const {
      devicesFilter,
      devicesGroupFilter,
      devicesOffset
    } = devicesStore;
    const newOffset = devicesOffset + DEVICES_LIMIT_PER_PAGE;
    if (!this.deviceOffsetsFetchedCache.has(newOffset)) {
      this.deviceOffsetsFetchedCache.add(newOffset);
      await devicesStore.loadMoreDevices(devicesFilter, devicesGroupFilter, DEVICES_LIMIT_PER_PAGE, newOffset);
    }
  }

  render() {
    const { stores, changeFilter, showDeleteConfirmation, showEditName, addNewWizard, t } = this.props;
    const { devicesStore, featuresStore, groupsStore } = stores;
    const { alphaPlusEnabled } = featuresStore;
    const {
      devices,
      devicesCurrentPage,
      devicesFilter,
      devicesLimit,
      devicesTotalCount
    } = devicesStore;
    const { selectedGroup } = groupsStore;
    const { type, isSmart } = selectedGroup;

    const items = [];

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
        />
      );
    });
    // this loader div should be kept because of react-infinite-scroller requirements
    const loader = (
      <div className="loader" key={'infinite-scroller-loader-devices'}>
        {t('common.infinite_scroller.loader_content')}
      </div>
    );
    return (
      <div className='devices-panel'>
        <ContentPanelHeader devicesFilter={devicesFilter} changeFilter={changeFilter} addNewWizard={addNewWizard} />
        {isSmart &&
          (groupsStore.expressionForSelectedGroupFetchAsync.isFetching ? (
            <div className='wrapper-center'>
              <Loader />
            </div>
          ) : (
            <ContentPanelSubheader />
          ))}
        <div className={`devices-panel__wrapper ${isSmart ? 'devices-panel__wrapper--smart' : ''}`}>
          <div
            className={`devices-panel__list${alphaPlusEnabled ? ' devices-panel__list--alpha' : ''}`}
            ref={(ref) => this.scrollParentRef = ref}
          >
            <InfiniteScroll
              className='wrapper-infinite-scroll'
              pageStart={0}
              loadMore={this.loadDevices}
              hasMore={devicesCurrentPage < devicesTotalCount / devicesLimit}
              useWindow={false}
              getScrollParent={() => this.scrollParentRef}
              loader={loader}
              threshold={250}
            >
              {devicesStore.devicesFetchAsync.isFetching && (
                <div className='wrapper-center'>
                  <Loader />
                </div>
              )}
              {devices.length ? (
                <div>
                  {items}
                </div>
              ) : (
                <div className='wrapper-center'>
                  <div className='devices-panel__list-empty'>
                    {type === ARTIFICIAL
                      ? t('devices.all_grouped')
                      : isSmart
                        ? t('devices.empty_group_smart')
                        : t('devices.empty_group_fixed')
                    }
                  </div>
                </div>
              )}
            </InfiniteScroll>
          </div>
          {alphaPlusEnabled && (
            <div className='devices-panel__dashboard'>
              <div className='devices-panel__title devices-panel__title--margin'>{'Dashboard (BETA)'}</div>
              <div className='devices-panel__top-wrapper'>
                <div className='devices-panel__dashboard-top'>
                  <div className='devices-panel__title'>{'Simultaneous connections'}</div>
                  {'560/600'}
                  <div className='devices-panel__dashboard-top-icon' />
                </div>
                <div className='devices-panel__dashboard-top'>
                  <div className='devices-panel__title'>{'Total devices'}</div>
                  {'134.000'}
                </div>
                <div className='devices-panel__dashboard-top'>
                  <div className='devices-panel__title'>{'Total connections'}</div>
                  {'69.000'}
                  <div className='devices-panel__dashboard-top-icon' />
                </div>
              </div>
              <div className='devices-panel__dashboard-bottom'>
                <div className='devices-panel__dashboard-content'>
                  <div className='devices-panel__title'>{'Live connections'}</div>
                  <div className='devices-panel__dashboard-data'>
                    <BarChart connections={connections} />
                  </div>
                </div>
                <div className='devices-panel__dashboard-content'>
                  <div className='devices-panel__title'>{'Certificate rollover'}</div>
                  <div className='devices-panel__dashboard-data'>
                    <Stats data={certificateRolloverData.stats} indicatorColors />
                  </div>
                </div>
                <div className='devices-panel__dashboard-content'>
                  <div className='devices-panel__title'>{'Connections'}</div>
                  <div className='devices-panel__dashboard-data'>
                    <Stats data={connectionsData.stats} indicatorColors={false} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

ContentPanel.wrappedComponent.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default withTranslation()(ContentPanel);
