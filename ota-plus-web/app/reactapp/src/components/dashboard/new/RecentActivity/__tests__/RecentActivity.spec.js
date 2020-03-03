import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount, shallow } from 'enzyme';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'mobx-react';
import theme from '../../../../../theme';
import RecentActivity from '../index';
import DevicesStore from '../../../../../stores/DevicesStore';
import RecentlyCreatedStore from '../../../../../stores/RecentlyCreatedStore';
import { ACTIVITIES_TYPE } from '../../../../../constants';
import * as analyticsHelper from '../../../../../helpers/analyticsHelper';

jest.mock('../../../../../i18n');

const TEXT_DASHBOARD_RECENT_ACTIVITY_NO_DATA_EMPTY = 'dashboard.recent-activity.no-data.empty';
const TEXT_DASHBOARD_RECENT_ACTIVITY_NO_DATA_NOTHING_CREATED = 'dashboard.recent-activity.no-data.nothing-created';

const mockedStores = {
  devicesStore: new DevicesStore(),
  recentlyCreatedStore: new RecentlyCreatedStore(),
};

function mountRecentActivity(stores = mockedStores) {
  return mount(
    <Provider stores={stores}>
      <ThemeProvider theme={theme}>
        <RecentActivity />
      </ThemeProvider>
    </Provider>
  );
}

describe('<RecentActivity />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mountRecentActivity();
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('should mount', () => {
    expect(wrapper.find('RecentActivity')).toHaveLength(1);
    expect(wrapper.exists('#recent-activity-filter-title')).toEqual(false);
    expect(wrapper.exists('#recent-activity-list')).toEqual(false);
  });

  it('should render with devicesTotalCount > 0 && recentlyCreated.length > 0', () => {
    const stores = {
      devicesStore: new DevicesStore(),
      recentlyCreatedStore: new RecentlyCreatedStore(),
    };
    stores.devicesStore.devicesTotalCount = 1;
    stores.recentlyCreatedStore.recentlyCreatedItems = [{
      date: '2019-12-23 12:17',
      title: 'title',
      type: ACTIVITIES_TYPE.CAMPAIGN
    }];
    stores.recentlyCreatedStore.recentlyCreatedFetchAsync = { isFetching: false };
    stores.recentlyCreatedStore.updateRecentlyCreatedItems = () => {};
    wrapper = mountRecentActivity(stores);
    expect(wrapper.find('RecentActivity')).toHaveLength(1);
    expect(wrapper.exists('#recent-activity-filter-title')).toEqual(true);
    expect(wrapper.exists('#recent-activity-list')).toEqual(true);
    expect(wrapper.exists('#recent-activity-no-data-loader')).toEqual(false);
  });

  it('should render with Loader', () => {
    const stores = {
      devicesStore: new DevicesStore(),
      recentlyCreatedStore: new RecentlyCreatedStore(),
    };
    stores.devicesStore.devicesTotalCount = 1;
    stores.recentlyCreatedStore.recentlyCreatedItems = [];
    stores.recentlyCreatedStore.recentlyCreatedFetchAsync = { isFetching: true };
    wrapper = mountRecentActivity(stores);
    expect(wrapper.find('RecentActivity')).toHaveLength(1);
    expect(wrapper.exists('#recent-activity-filter-title')).toEqual(true);
    expect(wrapper.exists('#recent-activity-list')).toEqual(false);
    expect(wrapper.exists('#recent-activity-no-data-description')).toEqual(false);
    expect(wrapper.exists('#recent-activity-no-data-loader')).toEqual(true);
  });

  it('should render without Loader and with TEXT_DASHBOARD_RECENT_ACTIVITY_NO_DATA_EMPTY description', () => {
    const stores = {
      devicesStore: new DevicesStore(),
      recentlyCreatedStore: new RecentlyCreatedStore(),
    };
    stores.devicesStore.devicesTotalCount = 1;
    stores.recentlyCreatedStore.recentlyCreatedItems = [];
    stores.recentlyCreatedStore.recentlyCreatedFetchAsync = { isFetching: false };
    wrapper = mountRecentActivity(stores);
    expect(wrapper.find('RecentActivity')).toHaveLength(1);
    expect(wrapper.exists('#recent-activity-filter-title')).toEqual(true);
    expect(wrapper.exists('#recent-activity-list')).toEqual(false);
    expect(wrapper.exists('#recent-activity-no-data-description')).toEqual(true);
    expect(wrapper.find('#recent-activity-no-data-description').children().last().text()).toBe(
      TEXT_DASHBOARD_RECENT_ACTIVITY_NO_DATA_EMPTY
    );
    expect(wrapper.exists('#recent-activity-no-data-loader')).toEqual(false);
  });

  it('should render without Loader and with TEXT_DASHBOARD_RECENT_ACTIVITY_NO_DATA_NOTHING_CREATED description', () => {
    const stores = {
      devicesStore: new DevicesStore(),
      recentlyCreatedStore: new RecentlyCreatedStore(),
    };
    stores.devicesStore.devicesTotalCount = 0;
    stores.recentlyCreatedStore.recentlyCreatedItems = [];
    stores.recentlyCreatedStore.recentlyCreatedFetchAsync = { isFetching: false };
    wrapper = mountRecentActivity(stores);
    expect(wrapper.find('RecentActivity')).toHaveLength(1);
    expect(wrapper.exists('#recent-activity-filter-title')).toEqual(false);
    expect(wrapper.exists('#recent-activity-list')).toEqual(false);
    expect(wrapper.exists('#recent-activity-no-data-description')).toEqual(true);
    expect(wrapper.find('#recent-activity-no-data-description').children().last().text()).toBe(
      TEXT_DASHBOARD_RECENT_ACTIVITY_NO_DATA_NOTHING_CREATED
    );
    expect(wrapper.exists('#recent-activity-no-data-loader')).toEqual(false);
  });

  it('should render dropdown menu', () => {
    const stores = {
      devicesStore: new DevicesStore(),
      recentlyCreatedStore: new RecentlyCreatedStore(),
    };
    stores.devicesStore.devicesTotalCount = 1;
    stores.recentlyCreatedStore.recentlyCreatedItems = [{
      date: '2019-12-23 12:17',
      title: 'title-campaign',
      type: ACTIVITIES_TYPE.CAMPAIGN
    }];
    stores.recentlyCreatedStore.recentlyCreatedFetchAsync = { isFetching: false };
    wrapper = mountRecentActivity(stores);
    const dropdown = wrapper.find('#recent-activity-filter-dropdown');
    const submenu = mount(<ThemeProvider theme={theme}><div>{dropdown.first().prop('overlay')}</div></ThemeProvider>);
    expect(submenu.exists('#recent-activity-filter-menu')).toEqual(true);
    expect(submenu.exists('#recent-activity-filter-menu-item-1')).toEqual(true);
    expect(submenu.exists('#recent-activity-filter-menu-item-checkbox-1')).toEqual(true);
  });

  it('should click on dropdown menu', () => {
    const stores = {
      devicesStore: new DevicesStore(),
      recentlyCreatedStore: new RecentlyCreatedStore(),
    };
    stores.devicesStore.devicesTotalCount = 1;
    stores.recentlyCreatedStore.recentlyCreatedItems = [{
      date: '2019-12-23 12:17',
      title: 'title-campaign',
      type: ACTIVITIES_TYPE.CAMPAIGN
    }];
    stores.recentlyCreatedStore.recentlyCreatedFetchAsync = { isFetching: false };
    stores.recentlyCreatedStore.fetchRecentlyCreated = jest.fn();
    analyticsHelper.sendAction = jest.fn();
    wrapper = mountRecentActivity(stores);
    const dropdown = wrapper.find('#recent-activity-filter-dropdown');
    const submenu = shallow(<div>{dropdown.first().prop('overlay')}</div>);
    expect(submenu.exists('#recent-activity-filter-menu')).toEqual(true);
    const filterMenu = submenu.find('#recent-activity-filter-menu');
    act(() => {
      filterMenu.simulate('click', { key: 0 });
    });
    let params = [
      ACTIVITIES_TYPE.SOFTWARE_VERSION,
      ACTIVITIES_TYPE.DEVICE_GROUP,
      ACTIVITIES_TYPE.SOFTWARE_UPDATE,
      ACTIVITIES_TYPE.CAMPAIGN
    ];
    expect(stores.recentlyCreatedStore.fetchRecentlyCreated).toBeCalledWith(params);
    act(() => {
      filterMenu.simulate('click', { key: 0 });
    });
    params = [
      ACTIVITIES_TYPE.DEVICE,
      ACTIVITIES_TYPE.SOFTWARE_VERSION,
      ACTIVITIES_TYPE.DEVICE_GROUP,
      ACTIVITIES_TYPE.SOFTWARE_UPDATE,
      ACTIVITIES_TYPE.CAMPAIGN
    ];
    expect(stores.recentlyCreatedStore.fetchRecentlyCreated).toBeCalledWith(params);
  });
});
