define(function(require) {
  var atom = require('../lib/atom');

  var DB = (function() {
    function DB() {
      this.devices = atom.createAtom();
      this.showPackage = atom.createAtom();
      this.showDevice = atom.createAtom();
      this.packages = atom.createAtom([]);
      this.packagesForDevice = atom.createAtom();
      this.packageHistoryForDevice = atom.createAtom();
      this.packageQueueForDevice = atom.createAtom();
      this.searchableDevices = atom.createAtom();
      this.searchablePackages = atom.createAtom();
      this.postStatus = atom.createAtom([]);
      
      this.searchableProductionDevices = atom.createAtom([]);
      this.installationLogForDevice = atom.createAtom();
      this.installationLogForUpdateId = atom.createAtom();
    }

    return DB;
  })();

  return new DB();
});
