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
export const GROUP_ALL = 'all';

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

/*
 *  Stepper
 */

export const ANT_STEP_STATUS = {
  WAIT: 'wait',
  PROCESS: 'process',
  DONE: 'done'
};

export const STEP_STATUS = {
  INACTIVE: 'inactive',
  ACTIVE: 'active',
  DONE: 'done'
};

export const STEP_TYPES = ['devices', 'softwareVersion', 'deviceGroup', 'softwareUpdates', 'campaigns'];

export const ACTIVITIES_TYPE = {
  CAMPAIGN: 'campaign',
  DEVICE: 'device',
  DEVICE_GROUP: 'device_group',
  SOFTWARE_UPDATE: 'update',
  SOFTWARE_VERSION: 'software'
};

export const ACTIVITIES_TYPE_PARAMS = [
  ACTIVITIES_TYPE.CAMPAIGN,
  ACTIVITIES_TYPE.DEVICE,
  ACTIVITIES_TYPE.DEVICE_GROUP,
  ACTIVITIES_TYPE.SOFTWARE_UPDATE,
  ACTIVITIES_TYPE.SOFTWARE_VERSION
];

export const ANIMATION_TYPE = {
  FADE_IN: 'fadeIn',
  FADE_OUT: 'fadeOut'
};

export const DATA_TYPE = {
  DEVICES: 'devices',
  GROUPS: 'groups',
  HARDWARE: 'hardware',
  UPDATE: 'update',
};

/**
 * Misc
 */

export const EVENTS = {
  RESIZE: 'resize',
  SCROLL: 'scroll'
};
export const FIREWORKS_ACKNOWLEDGED_KEY = 'fireworksPageAcknowledged';
export const METADATA_TYPES = {
  DESCRIPTION: 'DESCRIPTION',
  INSTALL_DURATION: 'ESTIMATED_INSTALLATION_DURATION',
  PRE_DURATION: 'ESTIMATED_PREPARATION_DURATION',
};
export const REMOVAL_MODAL_TYPE = {
  MEMBER_REMOVAL: 'memberRemoval',
  SELF_REMOVAL: 'selfRemoval'
};
export const PAGE_DEVICE = 'device';
export const PAGE_PACKAGES = 'packages';
export const SHA_256 = 'sha256';
export const SLIDE_ANIMATION_TYPE = {
  DOWN: 'slideDown',
  UP: 'slideUp'
};
export const SORT_DIR_ASC = 'asc';
export const SORT_DIR_DESC = 'desc';
export const STATUS = {
  SUCCESS: 'success',
  WAITING: 'waiting',
  ERROR: 'error'
};

export const UPLOADING_STATUS = {
  CANCELLED: 'cancelled',
  ERROR: 'error',
  IDLE: 'idle',
  IN_PROGRESS: 'in_progress',
  MALFORMED: 'malformed',
  SUCCESS: 'success',
};

export const WARNING_MODAL_COLOR = {
  DANGER: '#CF001A',
  DEFAULT: '#00B6B2',
  INFO: '#FFBD09'
};

export const INFO_STATUS_BAR_TYPE = {
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS'
};
