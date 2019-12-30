/** @format */

import UserStore from './UserStore';
import DevicesStore from './DevicesStore';
import HardwareStore from './HardwareStore';
import GroupsStore from './GroupsStore';
import SoftwareStore from './SoftwareStore';
import CampaignsStore from './CampaignsStore';
import ImpactAnalysisStore from './ImpactAnalysisStore';
import FeaturesStore from './FeaturesStore';
import RecentlyCreatedStore from './RecentlyCreatedStore';
import ProvisioningStore from './ProvisioningStore';
import UpdatesStore from './UpdatesStore';

export default {
  devicesStore: new DevicesStore(),
  hardwareStore: new HardwareStore(),
  groupsStore: new GroupsStore(),
  softwareStore: new SoftwareStore(),
  campaignsStore: new CampaignsStore(),
  impactAnalysisStore: new ImpactAnalysisStore(),
  featuresStore: new FeaturesStore(),
  provisioningStore: new ProvisioningStore(),
  recentlyCreatedStore: new RecentlyCreatedStore(),
  userStore: new UserStore(),
  updatesStore: new UpdatesStore(),
};
