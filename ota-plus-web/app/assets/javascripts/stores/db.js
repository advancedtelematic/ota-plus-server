define(function(require) {
  var atom = require('../lib/atom');

  var DB = (function() {
    function DB() {
      this.devices = atom.createAtom([]);
      this.showPackage = atom.createAtom([]);
      this.showDevice = atom.createAtom([]);
      this.packages = atom.createAtom([]);
      this.packagesForVin = atom.createAtom([]);
      this.packageHistoryForVin = atom.createAtom([]);
      this.packageQueueForVin = atom.createAtom([]);
      this.searchableDevices = atom.createAtom([]);
      this.searchablePackages = atom.createAtom([]);
      this.postStatus = atom.createAtom([]);
      
      this.searchableProductionDevices = atom.createAtom([]);
      this.installationLogForVin = atom.createAtom([]);
      this.installationLogForUpdateId = atom.createAtom([]);
    }

    return DB;
  })();

  return new DB();
});
