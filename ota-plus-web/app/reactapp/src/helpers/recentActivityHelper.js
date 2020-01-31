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
  OTA_HOME_FILTER_LATEST_CAMPAIGN,
  OTA_HOME_FILTER_LATEST_DEVICE,
  OTA_HOME_FILTER_LATEST_GROUP,
  OTA_HOME_FILTER_LATEST_SOFTWARE,
  OTA_HOME_FILTER_LATEST_UPDATE,
  OTA_HOME_SEE_LATEST_CAMPAIGN,
  OTA_HOME_SEE_LATEST_DEVICE,
  OTA_HOME_SEE_LATEST_GROUP,
  OTA_HOME_SEE_LATEST_SOFTWARE,
  OTA_HOME_SEE_LATEST_UPDATE
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

export const sendFilterLatestAction = (menuItemType) => {
  switch (menuItemType) {
    case ACTIVITIES_TYPE.CAMPAIGN:
      sendAction(OTA_HOME_FILTER_LATEST_CAMPAIGN);
      break;
    case ACTIVITIES_TYPE.DEVICE:
      sendAction(OTA_HOME_FILTER_LATEST_DEVICE);
      break;
    case ACTIVITIES_TYPE.DEVICE_GROUP:
      sendAction(OTA_HOME_FILTER_LATEST_GROUP);
      break;
    case ACTIVITIES_TYPE.SOFTWARE_UPDATE:
      sendAction(OTA_HOME_FILTER_LATEST_UPDATE);
      break;
    case ACTIVITIES_TYPE.SOFTWARE_VERSION:
      sendAction(OTA_HOME_FILTER_LATEST_SOFTWARE);
      break;
    default:
      break;
  }
};

export const sendSeeLatestAction = (item) => {
  switch (item) {
    case ACTIVITIES_TYPE.CAMPAIGN:
      sendAction(OTA_HOME_SEE_LATEST_CAMPAIGN);
      break;
    case ACTIVITIES_TYPE.DEVICE:
      sendAction(OTA_HOME_SEE_LATEST_DEVICE);
      break;
    case ACTIVITIES_TYPE.DEVICE_GROUP:
      sendAction(OTA_HOME_SEE_LATEST_GROUP);
      break;
    case ACTIVITIES_TYPE.SOFTWARE_UPDATE:
      sendAction(OTA_HOME_SEE_LATEST_UPDATE);
      break;
    case ACTIVITIES_TYPE.SOFTWARE_VERSION:
      sendAction(OTA_HOME_SEE_LATEST_SOFTWARE);
      break;
    default:
      break;
  }
};
