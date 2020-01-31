import { ACTIVITIES_TYPE } from '../constants';
import {
  CAMPAIGNS_ICON_GRAY,
  DEVICE_ICON_GRAY,
  GROUP_DYNAMIC_ICON,
  GROUP_ICON_GRAY,
  GROUP_TYPE,
  SOFTWARE_ICON_GRAY,
  UPDATE_ICON_GRAY,
} from '../config';
import { sendAction } from './analyticsHelper';
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
} from '../constants/analyticsActions';

export const getDeviceGroupListIcon = (groupType) => {
  switch (groupType) {
    case GROUP_TYPE.DYNAMIC:
      return GROUP_DYNAMIC_ICON;
    default:
      return GROUP_ICON_GRAY;
  }
};

export const getListIcon = (type) => {
  switch (type) {
    default:
    case ACTIVITIES_TYPE.CAMPAIGN:
      return CAMPAIGNS_ICON_GRAY;
    case ACTIVITIES_TYPE.DEVICE:
      return DEVICE_ICON_GRAY;
    case ACTIVITIES_TYPE.DEVICE_GROUP:
      return GROUP_ICON_GRAY;
    case ACTIVITIES_TYPE.SOFTWARE_UPDATE:
      return UPDATE_ICON_GRAY;
    case ACTIVITIES_TYPE.SOFTWARE_VERSION:
      return SOFTWARE_ICON_GRAY;
  }
};

export const getListDescription = (t, type) => {
  switch (type) {
    case ACTIVITIES_TYPE.CAMPAIGN:
      return t('dashboard.recent-activity.type.campaign');
    case ACTIVITIES_TYPE.DEVICE:
      return t('dashboard.recent-activity.type.device');
    case ACTIVITIES_TYPE.DEVICE_GROUP:
      return t('dashboard.recent-activity.type.device-group');
    case ACTIVITIES_TYPE.SOFTWARE_UPDATE:
      return t('dashboard.recent-activity.type.software-update');
    case ACTIVITIES_TYPE.SOFTWARE_VERSION:
      return t('dashboard.recent-activity.type.software-version');
    default:
      return '';
  }
};

export const sendFilterLatestAction = (menuItemType, selected) => {
  switch (menuItemType) {
    case ACTIVITIES_TYPE.CAMPAIGN:
      if (selected) {
        sendAction(OTA_HOME_FILTER_SELECT_RECENT_CAMPAIGNS);
      } else {
        sendAction(OTA_HOME_FILTER_DESELECT_RECENT_CAMPAIGNS);
      }
      break;
    case ACTIVITIES_TYPE.DEVICE:
      if (selected) {
        sendAction(OTA_HOME_FILTER_SELECT_RECENT_DEVICES);
      } else {
        sendAction(OTA_HOME_FILTER_DESELECT_RECENT_DEVICES);
      }
      break;
    case ACTIVITIES_TYPE.DEVICE_GROUP:
      if (selected) {
        sendAction(OTA_HOME_FILTER_SELECT_RECENT_GROUPS);
      } else {
        sendAction(OTA_HOME_FILTER_DESELECT_RECENT_GROUPS);
      }
      break;
    case ACTIVITIES_TYPE.SOFTWARE_UPDATE:
      if (selected) {
        sendAction(OTA_HOME_FILTER_SELECT_RECENT_UPDATES);
      } else {
        sendAction(OTA_HOME_FILTER_DESELECT_RECENT_UPDATES);
      }
      break;
    case ACTIVITIES_TYPE.SOFTWARE_VERSION:
      if (selected) {
        sendAction(OTA_HOME_FILTER_SELECT_RECENT_SOFTWARE);
      } else {
        sendAction(OTA_HOME_FILTER_DESELECT_RECENT_SOFTWARE);
      }
      break;
    default:
      break;
  }
};

export const sendSeeLatestAction = (item) => {
  switch (item) {
    case ACTIVITIES_TYPE.CAMPAIGN:
      sendAction(OTA_HOME_SEE_ACCESS_RECENT_CAMPAIGN_DETAILS);
      break;
    case ACTIVITIES_TYPE.DEVICE:
      sendAction(OTA_HOME_SEE_ACCESS_RECENT_DEVICE_DETAILS);
      break;
    case ACTIVITIES_TYPE.DEVICE_GROUP:
      sendAction(OTA_HOME_SEE_ACCESS_RECENT_GROUP_DETAILS);
      break;
    case ACTIVITIES_TYPE.SOFTWARE_UPDATE:
      sendAction(OTA_HOME_SEE_ACCESS_RECENT_UPDATE_DETAILS);
      break;
    case ACTIVITIES_TYPE.SOFTWARE_VERSION:
      sendAction(OTA_HOME_SEE_ACCESS_RECENT_SOFTWARE_DETAILS);
      break;
    default:
      break;
  }
};
