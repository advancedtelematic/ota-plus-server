define(function (require) {
    var db = require('../stores/db');

    var Events = (function () {
        this.deviceSeen = function (data) {
            db.deviceSeen.reset(data);
        };
    });
    
    return new Events();
});


