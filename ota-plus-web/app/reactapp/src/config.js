/**
 * /* Main config
 *
 * @format
 */

export const APP_TITLE = 'HERE OTA Connect';
export const APP_LAYOUT = 'atsgarage';
export const APP_LOCALSTORAGE = 'HERE-OTAConnect';

/*
 *  API end-points config
 */
export const API_GET_MULTI_TARGET_UPDATE_INDENTIFIER = '/api/v1/multi_target_updates';
export const API_CREATE_MULTI_TARGET_UPDATE = '/api/v1/admin/devices';
export const API_FETCH_MULTI_TARGET_UPDATES = '/api/v1/admin/devices';
export const API_CANCEL_MULTI_TARGET_UPDATE = '/api/v2/cancel_device_update_campaign';
export const API_NAMESPACE_SETUP_STEPS = '/organization/setup';

/*
 *  User
 */
export const API_USER_DETAILS = '/user/profile';
export const API_USER_CONTRACTS = '/user/contracts';
export const API_USER_UPDATE = '/user/profile';
export const API_USER_CHANGE_PASSWORD = '/user/change_password';
export const API_USER_ACTIVE_DEVICE_COUNT = '/api/v1/active_device_count';
export const API_USER_DEVICES_SEEN = '/api/v1/auditor/devices_seen_in';
export const API_USER_ORGANIZATIONS = '/user/organizations';
export const API_USER_ORGANIZATIONS_SWITCH_NAMESPACE = '/organizations/$namespace/index';
export const API_USER_ORGANIZATIONS_ADD_USER = '/organization/users';
export const API_USER_ORGANIZATIONS_GET_USERS = '/organization/tentative_users';

/*
 *  Features
 */
export const API_FEATURES_FETCH = '/api/v1/features';

/*
 *  Devices
 */
export const API_DEVICES_SEARCH = '/api/v1/devices';
export const API_DEVICES_NETWORK_INFO = '/api/v1/devices';
export const API_DIRECTOR_DEVICES_SEARCH = '/api/v1/admin/devices';
export const API_DEVICES_CREATE = '/api/v1/devices';
export const API_DEVICES_UPDATE = '/api/v1/devices';
export const API_DEVICES_DELETE = '/api/v1/devices';
export const API_DEVICES_DEVICE_DETAILS = '/api/v1/devices';
export const API_DEVICES_DIRECTOR_DEVICE = '/api/v1/admin/devices';
export const API_DEVICES_RENAME = '/api/v1/devices';

/*
 *  Updates
 */
export const API_UPDATES_SEARCH = '/api/v2/updates';
export const API_UPDATES_CREATE = '/api/v2/updates';

/*
 *  Device hardware
 */
export const API_HARDWARE_IDS_FETCH = '/api/v1/admin/devices/hardware_identifiers';
export const API_ECUS_FETCH = '/api/v1/devices';
export const API_ECUS_PUBLIC_KEY_FETCH = '/api/v1/admin/devices';

/*
 *  Device groups
 */
export const API_GROUPS_FETCH = '/api/v1/device_groups';
export const API_GROUPS_CREATE = '/api/v1/device_groups';
export const API_GROUPS_RENAME = '/api/v1/device_groups';
export const API_GROUPS_DEVICES_FETCH = '/api/v1/device_groups';
export const API_GROUPS_DETAIL = '/api/v1/device_groups';
export const API_GROUPS_ADD_DEVICE = '/api/v1/device_groups';
export const API_GROUPS_REMOVE_DEVICE = '/api/v1/device_groups';

/*
 *  Software
 */
export const API_SOFTWARE = '/api/v1/user_repo/targets.json';
export const API_UPLOAD_SOFTWARE = '/api/v1/user_repo/targets';
export const API_DELETE_SOFTWARE = '/api/v1/user_repo/targets';
export const API_SOFTWARE_DEVICE_SOFTWARE = '/api/v1/devices';
export const API_SOFTWARE_DEVICE_AUTO_INSTALLED_SOFTWARE = '/api/v1/auto_install';
export const API_SOFTWARE_DEVICE_QUEUE = '/api/v1/device_updates';
export const API_SOFTWARE_DEVICE_HISTORY = '/api/v1/devices';
export const API_SOFTWARE_DIRECTOR_DEVICE_HISTORY = '/api/v1/auditor/update_reports';
export const API_SOFTWARE_DEVICE_UPDATES_LOGS = '/api/v1/device_updates';
export const API_SOFTWARE_DEVICE_AUTO_INSTALL = '/api/v1/auto_install';
export const API_SOFTWARE_DIRECTOR_DEVICE_AUTO_INSTALL = '/api/v1/admin/devices';
export const API_SOFTWARE_DEVICE_INSTALL = '/api/v1/device_updates';
export const API_SOFTWARE_DEVICE_CANCEL_INSTALLATION = '/api/v1/device_updates';
export const API_SOFTWARE_COUNT_INSTALLED_ECUS = '/api/v1/admin/images/installed_count';
export const API_SOFTWARE_COMMENTS = '/api/v1/user_repo/comments';

/*
 *  Linux packages
 */
export const API_PACKAGES_COUNT_VERSION_BY_NAME = '/api/v1/device_packages';
export const API_PACKAGES_COUNT_DEVICE_AND_GROUP = '/api/v1/device_count';
export const API_PACKAGES_BLACKLIST_FETCH = '/api/v1/blacklist';
export const API_PACKAGES_PACKAGE_BLACKLISTED_FETCH = '/api/v1/blacklist';
export const API_PACKAGES_BLACKLIST = '/api/v1/blacklist';
export const API_PACKAGES_UPDATE_BLACKLISTED = '/api/v1/blacklist';
export const API_PACKAGES_REMOVE_FROM_BLACKLIST = '/api/v1/blacklist';
export const API_PACKAGES_AFFECTED_DEVICES_COUNT_FETCH = '/api/v1/blacklist';

/*
 *  Campaigns
 */
export const API_DEVICE_APPROVAL_PENDING_CAMPAIGNS = '/api/v2/device';
export const API_CAMPAIGNS_FETCH = '/api/v2/campaigns';
export const API_CAMPAIGNS_FETCH_SINGLE = '/api/v2/campaigns';
export const API_CAMPAIGNS_CAMPAIGN_DETAILS = '/api/v1/campaigns';
export const API_CAMPAIGNS_STATISTICS_SINGLE = '/api/v2/campaigns';
export const API_CAMPAIGNS_LEGACY_CAMPAIGN_STATISTICS = '/api/v1/campaigns';
export const API_CAMPAIGNS_CREATE = '/api/v2/campaigns';
export const API_CAMPAIGNS_LEGACY_CREATE = '/api/v1/campaigns';
export const API_CAMPAIGNS_SOFTWARE_SAVE = '/api/v1/campaigns';
export const API_CAMPAIGNS_GROUPS_SAVE = '/api/v1/campaigns';
export const API_CAMPAIGNS_LAUNCH = '/api/v2/campaigns';
export const API_CAMPAIGNS_LEGACY_LAUNCH = '/api/v1/campaigns';
export const API_CAMPAIGNS_RENAME = '/api/v2/campaigns';
export const API_CAMPAIGNS_LEGACY_RENAME = '/api/v1/campaigns';
export const API_CAMPAIGNS_CANCEL = '/api/v2/campaigns';
export const API_CAMPAIGNS_LEGACY_CANCEL = '/api/v1/campaigns';
export const API_CAMPAIGNS_CANCEL_REQUEST = '/api/v1/update_requests';
export const API_CAMPAIGNS_STATISTICS_FAILURES_SINGLE = '/api/v1/devices';
export const API_CAMPAIGNS_RETRY_SINGLE = '/api/v2/campaigns';

/*
 *  Impact analysis
 */
export const API_IMPACT_ANALYSIS_FETCH = '/api/v1/impact/blacklist';

/*
 *  Provisioning
 */
export const API_PROVISIONING_STATUS = '/api/v1/provisioning/status';
export const API_PROVISIONING_ACTIVATE = '/api/v1/provisioning/activate';
export const API_PROVISIONING_DETAILS = '/api/v1/provisioning';
export const API_PROVISIONING_KEYS_FETCH = '/api/v1/provisioning/credentials/registration';
export const API_PROVISIONING_KEY_CREATE = '/api/v1/provisioning/credentials/registration';

/* default values, limits, definitions */
/*
 * ant design config
 */
export const DEFAULT_THEME_CONFIG = {
  palette: {
    primary1Color: '#9ce2d8',
  },
  datePicker: {
    selectColor: '#48DAD0',
  },
  flatButton: {
    primaryTextColor: '#4B5151',
  },
};

/**
 * minimum recommended viewport
 */
export const VIEWPORT_MIN_WIDTH = 1280;
export const VIEWPORT_MIN_HEIGHT = 768;

/**
 * updates
 */
export const LIMIT_UPDATES_WIZARD = 5;
export const UPDATES_LIMIT_PER_PAGE = 10;

/**
 * packages
 */

export const PACKAGES_DEFAULT_TAB = 'compact';

/**
 * campaigns
 */

export const CAMPAIGNS_LIMIT_LATEST = 4;
export const CAMPAIGNS_LIMIT_PER_PAGE = 10;
export const CAMPAIGNS_STATUS_ALL = 'all';
export const CAMPAIGNS_STATUS_PREPARED = 'prepared';
export const CAMPAIGNS_STATUS_LAUNCHED = 'launched';
export const CAMPAIGNS_STATUS_FINISHED = 'finished';
export const CAMPAIGNS_STATUS_CANCELLED = 'cancelled';
export const CAMPAIGNS_STATUS_SCHEDULED = 'scheduled';

export const CAMPAIGNS_STATUSES = [
  CAMPAIGNS_STATUS_ALL,
  CAMPAIGNS_STATUS_PREPARED,
  CAMPAIGNS_STATUS_LAUNCHED,
  CAMPAIGNS_STATUS_FINISHED,
  CAMPAIGNS_STATUS_CANCELLED
];
export const CAMPAIGNS_STATUS_TAB_TITLE = {
  [CAMPAIGNS_STATUS_ALL]: 'All',
  [CAMPAIGNS_STATUS_PREPARED]: 'In Preparation',
  [CAMPAIGNS_STATUS_LAUNCHED]: 'Running',
  [CAMPAIGNS_STATUS_FINISHED]: 'Finished',
  [CAMPAIGNS_STATUS_CANCELLED]: 'Canceled',
};
export const CAMPAIGNS_DEFAULT_TAB = CAMPAIGNS_STATUS_ALL;

/**
 * devices
 */

export const DEVICES_LIMIT_LATEST = 4;
export const DEVICES_LIMIT_PER_PAGE = 30;

/**
 * softwares
 */

export const SOFTWARES_LIMIT_LATEST = 4;
export const SOFTWARES_LIMIT_PER_PAGE = 30;

/**
 * default relative paths used in app
 */

export const assets = {
  DEFAULT_PROFILE_PICTURE: '/assets/img/icons/profile.png',
  DEFAULT_SETTINGS_ICON: '/assets/img/icons/Settings_Icon_small.svg',
  DEFAULT_EDIT_ICON: '/assets/img/icons/edit_icon.svg',
  DEFAULT_USAGE_ICON: '/assets/img/icons/dropdown_usage.svg',
  DEFAULT_PROVISIONING_ICON: '/assets/img/icons/dropdown_key.svg',
  DEFAULT_TERMS_ICON: '/assets/img/icons/dropdown_terms.svg',
  DEFAULT_CLEAR_STORAGE_ICON: '/assets/img/icons/dropdown_reset_demo.svg',
  DEFAULT_LOGOUT_ICON: '/assets/img/icons/dropdown_logout.svg',
  DEFAULT_CLOSE_ICON: '/assets/img/icons/close.svg',
  DEFAULT_COLLAPSE_CAMPAIGN: 'assets/img/icons/black/arrow-up.svg'
};
export const LINK_BUTTON_ICON = '/assets/img/icons/link_button.svg';

/**
 * cookies
 */

export const ORGANIZATION_NAMESPACE_COOKIE = 'ORGANIZATION_NAMESPACE_COOKIE';
