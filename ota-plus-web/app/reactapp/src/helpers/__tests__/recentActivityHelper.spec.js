import { ACTIVITIES_TYPE } from '../../constants';
import {
  getListDescription,
  getListIcon,
  sendFilterLatestAction,
  sendSeeLatestAction
} from '../recentActivityHelper';
import {
  CAMPAIGNS_ICON_GRAY,
  DEVICE_ICON_GRAY,
  GROUP_ICON_GRAY,
  SOFTWARE_ICON_GRAY,
  UPDATE_ICON_GRAY
} from '../../config';
import {
  OTA_HOME_FILTER_LATEST_CAMPAIGN,
  OTA_HOME_FILTER_LATEST_DEVICE,
  OTA_HOME_FILTER_LATEST_GROUP,
  OTA_HOME_FILTER_LATEST_SOFTWARE,
  OTA_HOME_FILTER_LATEST_UPDATE,
  OTA_HOME_SEE_LATEST_CAMPAIGN,
  OTA_HOME_SEE_LATEST_DEVICE,
  OTA_HOME_SEE_LATEST_GROUP, OTA_HOME_SEE_LATEST_SOFTWARE,
  OTA_HOME_SEE_LATEST_UPDATE
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
  it('should return proper icon', () => {
    expect(getListIcon(ACTIVITIES_TYPE.CAMPAIGN)).toEqual(CAMPAIGNS_ICON_GRAY);
    expect(getListIcon()).toEqual(CAMPAIGNS_ICON_GRAY);
    expect(getListIcon(ACTIVITIES_TYPE.DEVICE)).toEqual(DEVICE_ICON_GRAY);
    expect(getListIcon(ACTIVITIES_TYPE.DEVICE_GROUP)).toEqual(GROUP_ICON_GRAY);
    expect(getListIcon(ACTIVITIES_TYPE.SOFTWARE_UPDATE)).toEqual(UPDATE_ICON_GRAY);
    expect(getListIcon(ACTIVITIES_TYPE.SOFTWARE_VERSION)).toEqual(SOFTWARE_ICON_GRAY);
  });

  it('should call sendAction with sendFilterLatestAction', () => {
    analyticsHelper.sendAction = jest.fn();
    sendFilterLatestAction(ACTIVITIES_TYPE.CAMPAIGN);
    sendFilterLatestAction(ACTIVITIES_TYPE.DEVICE);
    sendFilterLatestAction(ACTIVITIES_TYPE.DEVICE_GROUP);
    sendFilterLatestAction(ACTIVITIES_TYPE.SOFTWARE_UPDATE);
    sendFilterLatestAction(ACTIVITIES_TYPE.SOFTWARE_VERSION);
    sendFilterLatestAction();
    expect(analyticsHelper.sendAction).toBeCalledWith(OTA_HOME_FILTER_LATEST_CAMPAIGN);
    expect(analyticsHelper.sendAction).toBeCalledWith(OTA_HOME_FILTER_LATEST_DEVICE);
    expect(analyticsHelper.sendAction).toBeCalledWith(OTA_HOME_FILTER_LATEST_GROUP);
    expect(analyticsHelper.sendAction).toBeCalledWith(OTA_HOME_FILTER_LATEST_UPDATE);
    expect(analyticsHelper.sendAction).toBeCalledWith(OTA_HOME_FILTER_LATEST_SOFTWARE);
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
    expect(analyticsHelper.sendAction).toBeCalledWith(OTA_HOME_SEE_LATEST_CAMPAIGN);
    expect(analyticsHelper.sendAction).toBeCalledWith(OTA_HOME_SEE_LATEST_DEVICE);
    expect(analyticsHelper.sendAction).toBeCalledWith(OTA_HOME_SEE_LATEST_GROUP);
    expect(analyticsHelper.sendAction).toBeCalledWith(OTA_HOME_SEE_LATEST_UPDATE);
    expect(analyticsHelper.sendAction).toBeCalledWith(OTA_HOME_SEE_LATEST_SOFTWARE);
    expect(analyticsHelper.sendAction).toHaveBeenCalledTimes(5);
  });
});
