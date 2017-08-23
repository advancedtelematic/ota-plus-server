/* Main config */

export const APP_TITLE = 'ATS Garage';
export const APP_LAYOUT = 'atsgarage';

/* API end-points config */
export const API_GET_MULTI_TARGET_UPDATE_INDENTIFIER='/api/v1/multi_target_updates'
export const API_CREATE_MULTI_TARGET_UPDATE='/api/v1/admin/devices'
export const API_FETCH_MULTI_TARGET_UPDATES='/api/v1/admin/devices'

export const API_USER_DETAILS = '/user/profile';
export const API_USER_UPDATE = '/user/profile';
export const API_USER_UPDATE_BILLING = '/user/profile/billing_info';
export const API_USER_CHANGE_PASSWORD = '/user/change_password';
export const API_USER_ACTIVE_DEVICE_COUNT = '/api/v1/active_device_count';
export const API_USER_DEVICES_SEEN = '/api/v1/auditor/devices_seen_in';

export const API_FEATURES_FETCH = '/api/v1/features';
export const API_FEATURES_TREEHUB_ACTIVATE = '/api/v1/features/treehub';
export const API_FEATURES_FILE_UPLOADER_ACTIVATE = '/api/v1/features/tufupload';
export const API_FEATURES_FILE_UPLOADER_CLIENT_ID_GET = '/api/v1/features/tufupload/client';

export const API_DEVICES_SEARCH = '/api/v1/devices';
export const API_DIRECTOR_DEVICES_SEARCH = '/api/v1/admin/devices';
export const API_DEVICES_CREATE = '/api/v1/devices';
export const API_DEVICES_UPDATE = '/api/v1/devices';
export const API_DEVICES_DEVICE_DETAILS = '/api/v1/devices';
export const API_DEVICES_DIRECTOR_DEVICE = '/api/v1/admin/devices';
export const API_DEVICES_RENAME = '/api/v1/devices';

export const API_HARDWARE_IDS_FETCH = '/api/v1/admin/devices/hardware_identifiers';
export const API_ECUS_FETCH = '/api/v1/devices';
export const API_ECUS_PUBLIC_KEY_FETCH = '/api/v1/admin/devices';

export const API_GROUPS_FETCH = '/api/v1/device_groups';
export const API_GROUPS_CREATE = '/api/v1/device_groups';
export const API_GROUPS_RENAME = '/api/v1/device_groups';
export const API_GROUPS_DEVICES_FETCH = '/api/v1/device_groups';
export const API_GROUPS_ADD_DEVICE = '/api/v1/device_groups';
export const API_GROUPS_REMOVE_DEVICE = '/api/v1/device_groups';

export const API_PACKAGES = '/api/v1/packages';
export const API_TUF_PACKAGES = '/api/v1/user_repo/targets.json';
export const API_UPLOAD_TUF_PACKAGE = '/api/v1/user_repo/targets';
export const API_PACKAGES_COUNT_VERSION_BY_NAME = '/api/v1/device_packages';
export const API_PACKAGES_COUNT_DEVICE_AND_GROUP = '/api/v1/device_count';
export const API_PACKAGES_BLACKLIST_FETCH = '/api/v1/blacklist';
export const API_PACKAGES_PACKAGE_BLACKLISTED_FETCH = '/api/v1/blacklist';
export const API_PACKAGES_BLACKLIST = '/api/v1/blacklist';
export const API_PACKAGES_UPDATE_BLACKLISTED = '/api/v1/blacklist';
export const API_PACKAGES_REMOVE_FROM_BLACKLIST = '/api/v1/blacklist';
export const API_PACKAGES_AFFECTED_DEVICES_COUNT_FETCH = '/api/v1/blacklist';
export const API_PACKAGES_DEVICE_PACKAGES = '/api/v1/devices';
export const API_PACKAGES_DEVICE_AUTO_INSTALLED_PACKAGES = '/api/v1/auto_install';
export const API_PACKAGES_DEVICE_QUEUE = '/api/v1/device_updates';
export const API_PACKAGES_DEVICE_HISTORY = '/api/v1/history';
export const API_PACKAGES_DIRECTOR_DEVICE_HISTORY = '/api/v1/auditor/update_reports';
export const API_PACKAGES_DEVICE_UPDATES_LOGS = '/api/v1/device_updates';
export const API_PACKAGES_DEVICE_AUTO_INSTALL = '/api/v1/auto_install';
export const API_PACKAGES_DIRECTOR_DEVICE_AUTO_INSTALL = '/api/v1/admin/devices';
export const API_PACKAGES_DEVICE_INSTALL = '/api/v1/device_updates';
export const API_PACKAGES_DEVICE_CANCEL_INSTALLATION = '/api/v1/device_updates';
export const API_PACKAGES_COUNT_INSTALLED_ECUS = '/api/v1/admin/images/installed_count';

export const API_CREATE_TUF_REPO = '/api/v1/user_repo';
export const API_CHECK_TUF_REPO = '/api/v1/user_repo/root.json';
export const API_CREATE_DIRECTOR_REPO = '/api/v1/admin/repo';
export const API_CHECK_DIRECTOR_REPO = '/api/v1/admin/repo/root.json';

export const API_CAMPAIGNS_FETCH = '/api/v2/campaigns';
export const API_CAMPAIGNS_LEGACY_FETCH = '/api/v1/campaigns';
export const API_CAMPAIGNS_INDIVIDUAL_FETCH = '/api/v2/campaigns';
export const API_CAMPAIGNS_LEGACY_INDIVIDUAL_FETCH = '/api/v1/campaigns';
export const API_CAMPAIGNS_CAMPAIGN_DETAILS = '/api/v1/campaigns';
export const API_CAMPAIGNS_CAMPAIGN_STATISTICS = '/api/v2/campaigns';
export const API_CAMPAIGNS_LEGACY_CAMPAIGN_STATISTICS = '/api/v1/campaigns';
export const API_CAMPAIGNS_CREATE = '/api/v2/campaigns';
export const API_CAMPAIGNS_LEGACY_CREATE = '/api/v1/campaigns';
export const API_CAMPAIGNS_PACKAGE_SAVE = '/api/v1/campaigns';
export const API_CAMPAIGNS_GROUPS_SAVE = '/api/v1/campaigns';
export const API_CAMPAIGNS_LAUNCH = '/api/v2/campaigns';
export const API_CAMPAIGNS_LEGACY_LAUNCH = '/api/v1/campaigns';
export const API_CAMPAIGNS_RENAME = '/api/v2/campaigns';
export const API_CAMPAIGNS_LEGACY_RENAME = '/api/v1/campaigns';
export const API_CAMPAIGNS_CANCEL = '/api/v2/campaigns';
export const API_CAMPAIGNS_LEGACY_CANCEL = '/api/v1/campaigns';
export const API_CAMPAIGNS_CANCEL_REQUEST = '/api/v1/update_requests';

export const API_IMPACT_ANALYSIS_FETCH = '/api/v1/impact/blacklist';

export const API_PROVISIONING_STATUS = '/api/v1/provisioning/status';
export const API_PROVISIONING_ACTIVATE = '/api/v1/provisioning/activate';
export const API_PROVISIONING_DETAILS = '/api/v1/provisioning';
export const API_PROVISIONING_KEYS_FETCH = '/api/v1/provisioning/credentials/registration';
export const API_PROVISIONING_KEY_CREATE = '/api/v1/provisioning/credentials/registration';
