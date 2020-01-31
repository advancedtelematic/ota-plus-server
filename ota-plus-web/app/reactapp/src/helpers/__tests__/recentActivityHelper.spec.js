import { ACTIVITIES_TYPE } from '../../constants';
import {
  getDeviceGroupListIcon,
  getListDescription,
  getListIcon,
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
});
