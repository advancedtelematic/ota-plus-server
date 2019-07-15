/*
 *  Retry campaign
 */

export const CAMPAIGN_RETRY_STATUS_TOOLTIPS = {
  not_launched: 'You can retry the update installation',
  launched: 'Retrying the update installation',
  waiting: 'Please, wait to retry the update installation',
  finished: 'Retry cycle finished'
};
export const CAMPAIGN_RETRY_STATUSES = {
  NOT_LAUNCHED: 'not_launched',
  LAUNCHED: 'launched',
  WAITING: 'waiting',
  FINISHED: 'finished'
};

/*
 *  Timeout duration
 */

export const SEARCH_REFRESH_TIMEOUT = 400;

/*
 *  Software version
 */

export const NO_VERSION_INFO = 'No information / Any';

/*
 *  Device groups
 */

export const ARTIFICIAL = 'artificial';

/*
 *  Web events
 */

export const WEB_EVENTS = {
  DEVICE_CREATED: 'DeviceCreated',
  DEVICE_EVENT_MESSAGE: 'DeviceEventMessage',
  DEVICE_SEEN: 'DeviceSeen',
  DEVICE_SYSTEM_INFO_CHANGED: 'DeviceSystemInfoChanged',
  DEVICE_UPDATE_STATUS: 'DeviceUpdateStatus',
  PACKAGE_BLACKLISTED: 'PackageBlacklisted',
  TUF_TARGET_ADDED: 'TufTargetAdded',
  UPDATE_SPEC: 'UpdateSpec'
};
export const UPDATE_STATUSES = {
  DOWNLOADING: 'downloading',
  FINISHED: 'Finished',
  INSTALLING: 'installing'
};
