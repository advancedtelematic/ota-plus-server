/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';
import DeviceItem from './Item';
import BarChart from './BarChart';
import Stats from './Stats';
import ContentPanelHeader from './ContentPanelHeader';
import ContentPanelSubheader from './ContentPanelSubheader';
import { Loader } from '../../partials';
import { InfiniteScroll } from '../../utils';
import { ARTIFICIAL } from '../../constants';

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
  };

  goToDetails = (deviceId, e) => {
    const { router } = this.context;
    if (e) e.preventDefault();
    router.history.push(`/device/${deviceId}`);
  };

  render() {
    const { stores, changeFilter, showDeleteConfirmation, showEditName, addNewWizard } = this.props;
    const { devicesStore, featuresStore, groupsStore } = stores;
    const { alphaPlusEnabled } = featuresStore;
    const { 
      devices,
      devicesCurrentPage,
      devicesFilter, 
      devicesGroupFilter,
      devicesLimit,
      devicesTotalCount
    } = devicesStore;
    const { selectedGroup } = groupsStore;
    const { type, isSmart } = selectedGroup;

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
          <div className={`devices-panel__list${alphaPlusEnabled ? ' devices-panel__list--alpha' : ''}`}>
            <InfiniteScroll
              className='wrapper-infinite-scroll'
              hasMore={devicesCurrentPage < devicesTotalCount / devicesLimit}
              isLoading={devicesStore.devicesFetchAsync.isFetching}
              useWindow={false}
              loadMore={() => {
                devicesStore.loadMoreDevices(devicesFilter, devicesGroupFilter);
              }}
              threshold={100}
            >
              {devicesStore.devicesFetchAsync.isFetching && (
                <div className='wrapper-center'>
                  <Loader />
                </div>
              )}
              {devices.length ? (
                _.map(devices, device => (
                  <DeviceItem
                    device={device}
                    goToDetails={this.goToDetails}
                    showDeleteConfirmation={showDeleteConfirmation}
                    showEditName={showEditName}
                    key={device.uuid}
                    stores={{
                      devicesStore,
                      featuresStore,
                      groupsStore,
                    }}
                  />
                ))
              ) : (
                <div className='wrapper-center'>
                  <div className='devices-panel__list-empty'>
                    {type === ARTIFICIAL
                      ? 'All your devices are grouped. Good work!'
                      : isSmart 
                          ? 'This smart group isn\'t matching any devices. Either provision some matching devices, or recreate the smart group with different filter settings.' 
                          : 'This group is empty. Please, drag and drop devices here.'
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

export default ContentPanel;
