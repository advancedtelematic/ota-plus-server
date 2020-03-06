/* eslint-disable no-underscore-dangle */
import { ACTIVITIES_TYPE } from '../../constants';
import { getFormattedDateTime } from '../datesTimesHelper';
import { RECENTLY_CREATED_DATE_FORMAT } from '../../constants/datesTimesConstants';
import {
  createItemData,
  createDeviceGroupItemData,
  getDeviceGroupListIcon,
  getListDescription,
  getListIcon,
  prepareRecentlyCreatedItems,
  sendFilterLatestAction,
  sendSeeLatestAction
} from '../recentActivityHelper';
import {
  CAMPAIGNS_ICON_GRAY,
  DEVICE_ICON_GRAY,
  GROUP_DYNAMIC_ICON,
  GROUP_ICON_GRAY,
  GROUP_TYPE,
  SOFTWARE_ICON_GRAY,
  UPDATE_ICON_GRAY
} from '../../config';
import {
  OTA_HOME_FILTER_SELECT_RECENT_CAMPAIGNS,
  OTA_HOME_FILTER_DESELECT_RECENT_CAMPAIGNS,
  OTA_HOME_FILTER_SELECT_RECENT_DEVICES,
  OTA_HOME_FILTER_DESELECT_RECENT_DEVICES,
  OTA_HOME_FILTER_SELECT_RECENT_GROUPS,
  OTA_HOME_FILTER_DESELECT_RECENT_GROUPS,
  OTA_HOME_FILTER_SELECT_RECENT_SOFTWARE,
  OTA_HOME_FILTER_DESELECT_RECENT_SOFTWARE,
  OTA_HOME_FILTER_SELECT_RECENT_UPDATES,
  OTA_HOME_FILTER_DESELECT_RECENT_UPDATES,
  OTA_HOME_SEE_ACCESS_RECENT_DEVICE_DETAILS,
  OTA_HOME_SEE_ACCESS_RECENT_SOFTWARE_DETAILS,
  OTA_HOME_SEE_ACCESS_RECENT_GROUP_DETAILS,
  OTA_HOME_SEE_ACCESS_RECENT_UPDATE_DETAILS,
  OTA_HOME_SEE_ACCESS_RECENT_CAMPAIGN_DETAILS,
} from '../../constants/analyticsActions';
import * as analyticsHelper from '../analyticsHelper';

const recentlyCreatedData = [
  { createdAt: '2020-03-02T12:28:42Z',
    _type: ACTIVITIES_TYPE.CAMPAIGN,
    resource: { name: 'CAMPAIGN_1' } },
  { createdAt: '2020-02-26T13:52:58Z',
    _type: ACTIVITIES_TYPE.DEVICE,
    resource: { deviceName: 'Mississippi_77819629' } },
  { createdAt: '2020-03-02T12:27:10Z',
    _type: ACTIVITIES_TYPE.DEVICE_GROUP,
    resource: { groupName: 'FIXED_2020_03_02', groupType: GROUP_TYPE.STATIC } },
  { createdAt: '2020-03-02T13:07:27Z',
    _type: ACTIVITIES_TYPE.SOFTWARE_VERSION,
    resource: { name: 'VERSION_1' } },
  { createdAt: '2020-03-02T12:27:35Z',
    _type: ACTIVITIES_TYPE.SOFTWARE_UPDATE,
    resource: { name: 'UPDATE_1' } }
];

describe('recentActivityHelper', () => {
  it('should return proper description', () => {
    const t = key => key.toUpperCase();
    expect(getListDescription(t, ACTIVITIES_TYPE.CAMPAIGN)).toEqual(
      'DASHBOARD.RECENT-ACTIVITY.TYPE.CAMPAIGN'
    );
    expect(getListDescription(t, ACTIVITIES_TYPE.DEVICE)).toEqual(
      'DASHBOARD.RECENT-ACTIVITY.TYPE.DEVICE'
    );
    expect(getListDescription(t, ACTIVITIES_TYPE.DEVICE_GROUP)).toEqual(
      'DASHBOARD.RECENT-ACTIVITY.TYPE.DEVICE-GROUP'
    );
    expect(getListDescription(t, ACTIVITIES_TYPE.SOFTWARE_UPDATE)).toEqual(
      'DASHBOARD.RECENT-ACTIVITY.TYPE.SOFTWARE-UPDATE'
    );
    expect(getListDescription(t, ACTIVITIES_TYPE.SOFTWARE_VERSION)).toEqual(
      'DASHBOARD.RECENT-ACTIVITY.TYPE.SOFTWARE-VERSION'
    );
    expect(getListDescription()).toEqual('');
  });

  it('should return proper device group list icon', () => {
    expect(getDeviceGroupListIcon(GROUP_TYPE.DYNAMIC)).toEqual(GROUP_DYNAMIC_ICON);
    expect(getDeviceGroupListIcon()).toEqual(GROUP_ICON_GRAY);
  });

  it('should return proper icon', () => {
    expect(getListIcon(ACTIVITIES_TYPE.CAMPAIGN)).toEqual(CAMPAIGNS_ICON_GRAY);
    expect(getListIcon()).toEqual(CAMPAIGNS_ICON_GRAY);
    expect(getListIcon(ACTIVITIES_TYPE.DEVICE)).toEqual(DEVICE_ICON_GRAY);
    expect(getListIcon(ACTIVITIES_TYPE.DEVICE_GROUP)).toEqual(GROUP_ICON_GRAY);
    expect(getListIcon(ACTIVITIES_TYPE.SOFTWARE_UPDATE)).toEqual(UPDATE_ICON_GRAY);
    expect(getListIcon(ACTIVITIES_TYPE.SOFTWARE_VERSION)).toEqual(SOFTWARE_ICON_GRAY);
  });

  it('should call sendAction with sendFilterLatestAction and selected option', () => {
    analyticsHelper.sendAction = jest.fn();
    sendFilterLatestAction(ACTIVITIES_TYPE.CAMPAIGN, true);
    sendFilterLatestAction(ACTIVITIES_TYPE.DEVICE, true);
    sendFilterLatestAction(ACTIVITIES_TYPE.DEVICE_GROUP, true);
    sendFilterLatestAction(ACTIVITIES_TYPE.SOFTWARE_UPDATE, true);
    sendFilterLatestAction(ACTIVITIES_TYPE.SOFTWARE_VERSION, true);
    sendFilterLatestAction();
    expect(analyticsHelper.sendAction).toBeCalledWith(OTA_HOME_FILTER_SELECT_RECENT_CAMPAIGNS);
    expect(analyticsHelper.sendAction).toBeCalledWith(OTA_HOME_FILTER_SELECT_RECENT_DEVICES);
    expect(analyticsHelper.sendAction).toBeCalledWith(OTA_HOME_FILTER_SELECT_RECENT_GROUPS);
    expect(analyticsHelper.sendAction).toBeCalledWith(OTA_HOME_FILTER_SELECT_RECENT_UPDATES);
    expect(analyticsHelper.sendAction).toBeCalledWith(OTA_HOME_FILTER_SELECT_RECENT_SOFTWARE);
    expect(analyticsHelper.sendAction).toHaveBeenCalledTimes(5);
  });

  it('should call sendAction with sendFilterLatestAction and deselected option', () => {
    analyticsHelper.sendAction = jest.fn();
    sendFilterLatestAction(ACTIVITIES_TYPE.CAMPAIGN, false);
    sendFilterLatestAction(ACTIVITIES_TYPE.DEVICE, false);
    sendFilterLatestAction(ACTIVITIES_TYPE.DEVICE_GROUP, false);
    sendFilterLatestAction(ACTIVITIES_TYPE.SOFTWARE_UPDATE, false);
    sendFilterLatestAction(ACTIVITIES_TYPE.SOFTWARE_VERSION, false);
    sendFilterLatestAction();
    expect(analyticsHelper.sendAction).toBeCalledWith(OTA_HOME_FILTER_DESELECT_RECENT_CAMPAIGNS);
    expect(analyticsHelper.sendAction).toBeCalledWith(OTA_HOME_FILTER_DESELECT_RECENT_DEVICES);
    expect(analyticsHelper.sendAction).toBeCalledWith(OTA_HOME_FILTER_DESELECT_RECENT_GROUPS);
    expect(analyticsHelper.sendAction).toBeCalledWith(OTA_HOME_FILTER_DESELECT_RECENT_UPDATES);
    expect(analyticsHelper.sendAction).toBeCalledWith(OTA_HOME_FILTER_DESELECT_RECENT_SOFTWARE);
    expect(analyticsHelper.sendAction).toHaveBeenCalledTimes(5);
  });

  it('should call sendAction with sendSeeLatestAction', () => {
    analyticsHelper.sendAction = jest.fn();
    sendSeeLatestAction(ACTIVITIES_TYPE.CAMPAIGN);
    sendSeeLatestAction(ACTIVITIES_TYPE.DEVICE);
    sendSeeLatestAction(ACTIVITIES_TYPE.DEVICE_GROUP);
    sendSeeLatestAction(ACTIVITIES_TYPE.SOFTWARE_UPDATE);
    sendSeeLatestAction(ACTIVITIES_TYPE.SOFTWARE_VERSION);
    sendSeeLatestAction();
    expect(analyticsHelper.sendAction).toBeCalledWith(OTA_HOME_SEE_ACCESS_RECENT_CAMPAIGN_DETAILS);
    expect(analyticsHelper.sendAction).toBeCalledWith(OTA_HOME_SEE_ACCESS_RECENT_DEVICE_DETAILS);
    expect(analyticsHelper.sendAction).toBeCalledWith(OTA_HOME_SEE_ACCESS_RECENT_GROUP_DETAILS);
    expect(analyticsHelper.sendAction).toBeCalledWith(OTA_HOME_SEE_ACCESS_RECENT_UPDATE_DETAILS);
    expect(analyticsHelper.sendAction).toBeCalledWith(OTA_HOME_SEE_ACCESS_RECENT_SOFTWARE_DETAILS);
    expect(analyticsHelper.sendAction).toHaveBeenCalledTimes(5);
  });

  it('should create proper device item data', () => {
    const item = recentlyCreatedData[0];
    const itemData = createItemData(item.createdAt, item.resource.name, item._type);
    expect(itemData).toEqual(
      {
        date: getFormattedDateTime(item.createdAt, RECENTLY_CREATED_DATE_FORMAT),
        title: item.resource.name,
        type: item._type
      }
    );
  });

  it('should create proper device group item data', () => {
    const item = recentlyCreatedData[2];
    const itemData = createDeviceGroupItemData(item.createdAt, item.resource.name, item._type, item.resource.groupType);
    expect(itemData).toEqual(
      {
        date: getFormattedDateTime(item.createdAt, RECENTLY_CREATED_DATE_FORMAT),
        title: item.resource.name,
        type: item._type,
        groupType: item.resource.groupType
      }
    );
  });

  it('should prepare device items data', () => {
    const items = [...recentlyCreatedData, { _type: undefined }];
    const itemsData = prepareRecentlyCreatedItems(items);
    const item0 = recentlyCreatedData[0];
    const item1 = recentlyCreatedData[1];
    const item2 = recentlyCreatedData[2];
    const item3 = recentlyCreatedData[3];
    const item4 = recentlyCreatedData[4];
    expect(itemsData).toEqual(
      [
        {
          date: getFormattedDateTime(item0.createdAt, RECENTLY_CREATED_DATE_FORMAT),
          title: item0.resource.name,
          type: item0._type
        },
        {
          date: getFormattedDateTime(item1.createdAt, RECENTLY_CREATED_DATE_FORMAT),
          title: item1.resource.deviceName,
          type: item1._type
        },
        {
          date: getFormattedDateTime(item2.createdAt, RECENTLY_CREATED_DATE_FORMAT),
          title: item2.resource.groupName,
          type: item2._type,
          groupType: item2.resource.groupType
        },
        {
          date: getFormattedDateTime(item3.createdAt, RECENTLY_CREATED_DATE_FORMAT),
          title: item3.resource.name,
          type: item3._type
        },
        {
          date: getFormattedDateTime(item4.createdAt, RECENTLY_CREATED_DATE_FORMAT),
          title: item4.resource.name,
          type: item4._type
        }
      ]
    );
  });
});
