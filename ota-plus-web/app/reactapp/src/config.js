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
export const API_FETCH_MULTI_TARGET_UPDATES = '/api/v1/assignments';
export const API_CANCEL_MULTI_TARGET_UPDATE = '/api/v1/assignments';
export const API_CANCEL_UPDATE_PENDING_APPROVAL = '/api/v2/campaigns';
export const API_NAMESPACE_SETUP_STEPS = '/organization/setup';
export const API_RECENTLY_CREATED = '/recently_created?types=$types&limit=10';
/*
 *  User
 */
export const API_ORGANIZATIONS = '/organizations';
export const API_ORGANIZATIONS_USERS = namespace => `/organizations/${namespace}/users`;
export const API_USER_DETAILS = '/user/profile';
export const API_USER_CONTRACTS = '/user/contracts';
export const API_USER_UPDATE = '/user/profile';
export const API_USER_CHANGE_PASSWORD = '/user/change_password';
export const API_USER_ACTIVE_DEVICE_COUNT = '/api/v1/active_device_count';
export const API_USER_DEVICES_SEEN = '/api/v1/auditor/devices_seen_in';
export const API_USER_DEFAULT_ORGANIZATION = '/user/organizations/default';
export const API_USER_ORGANIZATIONS = '/user/organizations';
export const API_USER_ORGANIZATIONS_SWITCH_NAMESPACE = '/organizations/$namespace/index';
export const API_USER_ORGANIZATIONS_GET_USERS = namespace => `/organizations/${namespace}/tentative_users`;
export const API_USER_ORGANIZATION_DELETE_MEMBER = '/organization/users';

/*
 *  Features
 */
export const API_FEATURES_FETCH = '/user/feature_flags';

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
export const API_GROUPS_CREATE_WITH_FILE = '/api/v1/device_groups?groupName=$groupName';
export const API_GROUPS_RENAME = '/api/v1/device_groups';
export const API_GROUPS_DEVICES_FETCH = '/api/v1/device_groups';
export const API_GROUPS_DETAIL = '/api/v1/device_groups';
export const API_GROUPS_ADD_DEVICE = '/api/v1/device_groups';
export const API_GROUPS_REMOVE_DEVICE = '/api/v1/device_groups';

/*
 *  Software
 */
export const API_SOFTWARE = '/api/v1/user_repo/targets.json';
export const API_DELETE_SOFTWARE = '/api/v1/user_repo/targets';
export const API_SOFTWARE_COMMENTS = '/api/v1/user_repo/comments';
export const API_SOFTWARE_COUNT_INSTALLED_ECUS = '/api/v1/admin/images/installed_count';
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
export const API_SOFTWARE_KEYS_STATUS = '/api/v1/keys/status';
export const API_UPLOAD_SOFTWARE = '/api/v1/user_repo/targets';

/*
 *  Linux packages
 */
export const API_PACKAGES_COUNT_VERSION_BY_NAME = '/api/v1/device_packages';
export const API_PACKAGES_COUNT_DEVICE_AND_GROUP = '/api/v1/device_count';
export const API_PACKAGES_BLACKLIST_FETCH = '/api/v1/package_lists';
export const API_PACKAGES_PACKAGE_BLACKLISTED_FETCH = '/api/v1/package_lists';
export const API_PACKAGES_BLACKLIST = '/api/v1/package_lists';
export const API_PACKAGES_UPDATE_BLACKLISTED = '/api/v1/package_lists';
export const API_PACKAGES_REMOVE_FROM_BLACKLIST = '/api/v1/package_lists';

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
 *  Provisioning
 */
export const API_PROVISIONING_STATUS = '/api/v1/provisioning/status';
export const API_PROVISIONING_ACTIVATE = '/api/v1/provisioning/activate';
export const API_PROVISIONING_DETAILS = '/api/v1/provisioning';
export const API_PROVISIONING_KEYS_FETCH = '/api/v1/provisioning/credentials/registration';
export const API_PROVISIONING_KEY_CREATE = '/api/v1/provisioning/credentials/registration';
export const API_PROVISIONING_DOWNLOAD = '/user/credentials';

export const NAMESPACE_SETUP_TIMEOUT_MS = 800;
export const NOTIFICATION_DURATION_SEC = 6;

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
 * updates
 */
export const LIMIT_UPDATES_WIZARD = 5;
export const UPDATES_FETCH_ASYNC = 'updatesFetchAsync';
export const UPDATES_LIMIT_PER_PAGE = 10;
export const UPDATES_SAFE_FETCH_ASYNC = 'updatesSafeFetchAsync';
export const UPDATES_WIZARD_FETCH_ASYNC = 'updatesWizardFetchAsync';
export const UPDATES_WIZARD_LOAD_MORE_ASYNC = 'updatesWizardLoadMoreAsync';
export const WIZARD_KEY = 'wizard';

/**
 * packages
 */

export const PACKAGES_DEFAULT_TAB = 'compact';
export const PACKAGES_ADVANCED_TAB = 'advanced';

/**
 * campaigns
 */

export const CAMPAIGNS_FILTER = 'campaignsFilter';
export const CAMPAIGNS_PAGE_NUMBER_DEFAULT = 1;
export const CAMPAIGNS_LIMIT_LATEST = 4;
export const CAMPAIGNS_LIMIT_PER_PAGE = 10;
export const CAMPAIGNS_STATUS_ALL = 'all';
export const CAMPAIGNS_STATUS_PREPARED = 'prepared';
export const CAMPAIGNS_STATUS_LAUNCHED = 'launched';
export const CAMPAIGNS_STATUS_FINISHED = 'finished';
export const CAMPAIGNS_STATUS_CANCELLED = 'cancelled';
export const CAMPAIGNS_STATUS_SCHEDULED = 'scheduled';

export const CAMPAIGNS_FETCH_ASYNC = 'campaignsFetchAsync';
export const CAMPAIGNS_SINGLE_FETCH_ASYNC = 'campaignsSingleFetchAsync';
export const CAMPAIGNS_SINGLE_STATS_FETCH_ASYNC = 'campaignsSingleStatisticsFetchAsync';

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
 * Misc
 */

export const INFINITY_SCROLL_THRESHOLD = 250;

/**
 * devices
 */

export const APPROVAL_PENDING_CAMP_FETCH_ASYNC = 'approvalPendingCampaignsFetchAsync';
export const DDV_ACTIVE_TAB_ID = '0';
export const DEVICE_HISTORY_LIMIT = 10;
export const DEVICE_STATUS = {
  UP_TO_DATE: 'UpToDate'
};
export const DEVICES_LIMIT_LATEST = 4;
export const DEVICES_LIMIT_PER_PAGE = 24;
export const DEVICES_PAGE_NUMBER_DEFAULT = 1;
export const DEVICES_FETCH_NAME_DEVICES_FILTER = 'devicesFilter';
export const EVENTS_FETCH_ASYNC = 'eventsFetchAsync';
export const IN_ANY_GROUP = 'inAnyGroup';
export const MISSING_DEVICE_CODE = 'missing_device';
export const NOT_IN_SMART_GROUP = 'notInSmartGroup';
export const NOT_IN_FIXED_GROUP = 'notInFixedGroup';
export const NOT_SEEN_RECENTLY_HOURS = 72;
export const UNGROUPED = 'ungrouped';
export const UNGROUPED_DEVICES_COUNT_FETCH_ASYNC = 'ungroupedDevicesCountFetchAsync';
export const UNMANAGED_KEY = 'unmanaged';

/**
 * Groups
 */

export const GROUP_TYPE = {
  DYNAMIC: 'dynamic',
  STATIC: 'static',
  REAL: 'real'
};
export const GROUPS_CREATE_FETCH_ASYNC = 'groupsCreateFetchAsync';
export const GROUPS_FETCH_ASYNC = 'groupsFetchAsync';
export const GROUPS_FETCH_DEVICES_ASYNC = 'groupsFetchDevicesAsync';
export const GROUPS_FILTER_CONDITIONS = {
  CONTAINS: 'contains',
  DIFF_CHAR: 'has a character different from',
  EQUAL_CHAR: 'has a character equal to',
  POSITION: 'position'
};
export const NUM_DEVICES_BY_EXP_ASYNC = 'numberOfDevicesByExpressionAsync';

/**
 * softwares
 */

export const ACTIVE_TAB_KEY = 'activeTab';
export const ADVANCED_TAB_KEY = 'advanced';
export const CAMPAIGN_CORRELATION_ID = 'urn:here-ota:campaign:';
export const LOCAL_STORAGE_DELETED_PACKAGES_KEY = 'deletedPackages';
export const LOCAL_STORAGE_DELETED_VERSIONS_KEY = 'deletedVersions';
export const ONDEVICE_SOFTWARE_LIMIT = 25;
export const OSTREE_FORMAT = 'OSTREE';
export const SOFTWARE_DELETE_ALL_DONE = 'done';
export const SOFTWARE_FETCH_ASYNC = 'packagesFetchAsync';
export const SOFTWARE_HISTORY_LIMIT = 10;
export const SOFTWARES_LIMIT_LATEST = 4;
export const SOFTWARES_LIMIT_PER_PAGE = 30;
export const SWITCH_TO_SW_REPO_KEY = 'switchToSWRepo';

/**
 * Hardware
 */

export const HARDWARE_IDS_LIMIT = 1000;
export const PROPERTY_CHILDREN = 'children';
export const PROPERTY_NAME = 'name';

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
export const ATTENTION_ICON = '/assets/img/new-app/24/attention.svg';
export const BAN_ICON_RED = '/assets/img/icons/ban_red.png';
export const CAMPAIGNS_ICON = '/assets/img/new-app/24/campaigns-active-solid-24.svg';
export const CAMPAIGNS_ICON_GRAY = '/assets/img/new-app/24/LUI-icon-pd-distribute-solid-24.svg';
export const CAMPAIGNS_ICON_GREEN = '/assets/img/new-app/24/campaigns-active-solid-24-green.svg';
export const CAMPAIGNS_ICON_WHITE = '/assets/img/icons/white/campaigns.svg';
export const CANCEL_ICON_THIN = '/assets/img/icons/black/cancel-thin.svg';
export const CLOSE_MODAL_ICON = '/assets/img/new-app/24/close-cross-24.svg';
export const CROSS_ICON_RED = '/assets/img/icons/red_cross.svg';
export const DEVICE_ICON = '/assets/img/new-app/24/devices-active-outline-24.svg';
export const DEVICE_ICON_GRAY = '/assets/img/new-app/24/LUI-icon-pd-device_connected-outline-24.svg';
export const DEVICE_ICON_GREEN = '/assets/img/new-app/24/devices-active-outline-24-green.svg';
export const DEVICE_ICON_OLD_WHITE = '/assets/img/icons/white/devices.svg';
export const DOOR_EXIT_ICON = '/assets/img/new-app/16/door_leave.svg';
export const DOWNLOAD_ICON = '/assets/img/icons/download.svg';
export const DOWNLOAD_KEY_ICON = '/assets/img/icons/download_key.svg';
export const ENVIRONMENTS_ICON = '/assets/img/new-app/24/icon24-masking.svg';
export const EXIT_FULLSCREEN_ICON = '/assets/img/icons/exit-fullscreen.svg';
export const FIREWORKS_CHECK_ICON = '/assets/img/icons/fireworks_check.svg';
export const GROUP_DYNAMIC_ICON = '/assets/img/new-app/24/LUI-icon-pd-device_group_smart_filter-outline-24.svg';
export const GROUP_ICON = '/assets/img/new-app/24/device-group-active-outline-24.svg';
export const GROUP_ICON_GRAY = '/assets/img/new-app/24/LUI-icon-pd-device_group_connected-outline-24.svg';
export const HELP_ICON_DARK = '/assets/img/new-app/24/help-24-dark.svg';
export const HERE_ICON = '/assets/img/HERE_pos.png';
export const IMPACT_TOOLTIP_IMG = '/assets/img/impact_tooltip.jpg';
export const INFO_ICON_BLACK = '/assets/img/icons/black/info.svg';
export const INFO_ICON_WHITE = '/assets/img/icons/white/info.svg';
export const KEY_ICON_BLACK = '/assets/img/icons/black/key.svg';
export const KEY_ICON_WHITE = '/assets/img/icons/white/key.svg';
export const LINK_BUTTON_ICON = '/assets/img/icons/link_button.svg';
export const MANAGER_ICON_DANGER_WHITE = '/assets/img/icons/white/manager-danger.png';
export const MANAGER_ICON_SUCCESS = '/assets/img/icons/manager-success.svg';
export const MANAGER_ICON_SUCCESS_WHITE = '/assets/img/icons/white/manager-success.png';
export const MANAGER_ICON_WARNING_WHITE = '/assets/img/icons/white/manager-warning.png';
export const MAXIMIZE_ICON = '/assets/img/icons/maximize.svg';
export const MINIMIZE_ICON = '/assets/img/icons/minimize.svg';
export const PEOPLE_ICON = '/assets/img/new-app/24/people-active-outline-24.svg';
export const PLUS_ICON = '/assets/img/new-app/24/icon-plus-aqua-24x24.svg';
export const POINTS_GIF = '/assets/img/icons/points.gif';
export const REOPEN_ICON = '/assets/img/icons/reopen.svg';
export const SETTINGS_ICON_BIG = '/assets/img/icons/Settings_Icon_big.svg';
export const SIGN_OUT_ICON = '/assets/img/new-app/24/sign-out.svg';
export const SOFTWARE_ICON = '/assets/img/new-app/24/software-versions-active-outline-24.svg';
export const SOFTWARE_ICON_GRAY = '/assets/img/new-app/24/LUI-icon-pd-software-outline-24.svg';
export const SOFTWARE_ICON_OLD_WHITE = '/assets/img/icons/white/packages.svg';
export const UPDATE_ICON = '/assets/img/new-app/24/software-updates-active-outline-24.svg';
export const UPDATE_ICON_GRAY = '/assets/img/new-app/24/LUI-icon-pd-tuner-outline-24.svg';
export const UPDATE_ICON_GREEN = '/assets/img/new-app/24/software-updates-active-outline-24-green.svg';
export const WARNING_ICON = '/assets/img/new-app/16/LUI-icon-pd-attention-solid-16-1.svg';
export const NO_ITEMS_ICON = '/assets/img/new-app/24/LUI-icon-pd-substract-outline-24.svg';
export const QUESTIONMARK_ICON_BLACK = '/assets/img/icons/black/questionmark.svg';
export const QUESTIONMARK_ICON_WHITE = '/assets/img/icons/white/questionmark.svg';
export const TICK_ICON_BLACK = '/assets/img/icons/black/tick.svg';
export const TICK_ICON_GREEN = '/assets/img/icons/green_tick.svg';
export const TRASHBIN_ICON = '/assets/img/new-app/16/trashbin.svg';
export const UPLOAD_ICON = '/assets/img/new-app/24/upload.svg';

/**
 * cookies
 */

export const ORGANIZATION_NAMESPACE_COOKIE = 'ORGANIZATION_NAMESPACE_COOKIE';

/**
 * notifications
 */

export const NOTIFICATION_ERROR_DURATION = 5;

/**
 * Feature flags
 */

export const FEATURES = {
  ADVANCED_SOFTWARE: 'advanced_software',
  AUTO_CAMPAIGN: 'automatic_campaign',
  CAMPAIGN_USER_CONSENT_REUSE: 'campaign_user_consent_reuse_text',
  DASHBOARD_CHARTS: 'dashboard_charts',
  DEPENDENCY_CAMPAIGN: 'dependency_campaign',
  DEPENDENCY_SOFTWARE: 'dependency_software',
  IMPACT_ANALYSIS: 'impact_analysis',
  OLP_CAMPAIGN: 'olp_campaign',
  PSEUDO_LOCALISATION: 'pseudo_localisation',
  SEQUENCER_CAMPAIGN: 'sequencer_campaign',
  USAGE: 'usage'
};

/**
 * Provisioning keys/credentials
 */

export const MAX_REGISTRATION_CREDENTIALS_TTL = 35040;// 35040 hours = 4 years

/**
 * Icon paths for homepage stepper
 */

export const ICON_PATHS = [
  DEVICE_ICON,
  SOFTWARE_ICON,
  GROUP_ICON,
  UPDATE_ICON,
  CAMPAIGNS_ICON
];

/**
 * Language changing
 */
export const LANGUAGE_SYMBOL_CHINESE = 'zh';
export const LANGUAGE_SYMBOL_ENGLISH = 'en';
export const LANGUAGE_SYMBOL_JAPANESE = 'ja';
export const LANGUAGE_SYMBOL_PSEUDO = 'zz';

export const SUPPORTED_LANGUAGES = [
  { language: LANGUAGE_SYMBOL_ENGLISH, textKey: 'footer.language.english' },
  { language: LANGUAGE_SYMBOL_CHINESE, textKey: 'footer.language.chinese' },
  { language: LANGUAGE_SYMBOL_JAPANESE, textKey: 'footer.language.japanese' },
  { language: LANGUAGE_SYMBOL_PSEUDO, textKey: 'footer.language.pseudo' }
];

export const i18ToMomenLocaleMapping = {
  en: 'en',
  ja: 'ja',
  zh: 'zh-cn',
  zz: 'en'
};

export const SOFTWARE_VERSION_FILE_LIMIT = 1024 * 1024 * 1024; // 1 GB
