define(function (require) {
    var db = require('../stores/db');

    var Events = (function () {
        this.deviceSeen = function (data) {
            db.deviceSeen.reset(data);
        };
        this.deviceCreated = function (data) {
            db.deviceCreated.reset(data);
        };
        this.deviceDeleted = function (data) {
            db.deviceDeleted.reset(data);
        };
        this.packageCreated = function (data) {
            db.packageCreated.reset(data);
        };
        this.packageBlacklisted = function (data) {
            db.packageBlacklisted.reset(data);
        };
        this.updateSpec = function (data) {
            db.updateSpec.reset(data);
        };
    });
    
    return new Events();
});


