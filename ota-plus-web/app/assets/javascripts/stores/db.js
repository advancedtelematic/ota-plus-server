define(function(require) {
  var atom = require('../lib/atom');

  var DB = (function() {
    function DB() {
      this.devices = atom.createAtom();
      this.showPackage = atom.createAtom();
      this.device = atom.createAtom();
      this.packages = atom.createAtom([]);
      this.packagesForDevice = atom.createAtom();
      this.searchablePackagesForDevice = atom.createAtom();
      this.packageHistoryForDevice = atom.createAtom();
      this.packageQueueForDevice = atom.createAtom();
      this.searchableDevices = atom.createAtom();
      this.searchablePackages = atom.createAtom();
      this.postStatus = atom.createAtom({});
      this.postUpload = atom.createAtom();
      
      this.searchableProductionDevices = atom.createAtom([]);
      this.installationLogForDevice = atom.createAtom();
      this.installationLogForUpdateId = atom.createAtom();
      
      this.user = atom.createAtom();
      this.components = atom.createAtom();
      this.componentsForSelectedDevices = atom.createAtom();
      this.blacklistedPackage = atom.createAtom();
      this.blacklistedPackages = atom.createAtom();
      this.impactAnalysis = atom.createAtom();
      this.impactedDevicesCount = atom.createAtom();
      this.group = atom.createAtom();
      this.groups = atom.createAtom();
      this.campaigns = atom.createAtom();
      this.campaign = atom.createAtom();
      this.campaignStatistics = atom.createAtom();
      
      //Events
      this.deviceSeen = atom.createAtom();
      this.deviceCreated = atom.createAtom();
      this.deviceDeleted = atom.createAtom();
      this.packageCreated = atom.createAtom();
      this.packageBlacklisted = atom.createAtom();
      this.updateSpec = atom.createAtom();
    }

    return DB;
  })();

  return new DB();
});
