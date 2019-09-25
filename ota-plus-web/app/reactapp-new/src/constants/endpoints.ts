export const ApiEndpoints = {
  CAMPAIGNS: {
    ALL: '/api/v2/campaigns',
  },
  DEVICES: {
    ALL: '/api/v1/devices',
  },
  FEED: {
    ALL: '/recently_created',
  },
  DEVICE_GROUPS: {
    ALL: '/api/v1/device_groups'
  },
  SOFTWARE: {
    ALL: '/api/v1/user_repo/targets.json'
  },
  UPDATES: {
    ALL: '/api/v2/updates'
  },
  MISC: {
    USER_PROFILE: '/user/profile'
  }
} as const;

export default ApiEndpoints;
