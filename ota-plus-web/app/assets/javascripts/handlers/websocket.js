define(function (require) {
    var db = require('../stores/db'),
            SotaDispatcher = require('sota-dispatcher');

    var WebsocketHandler = (function () {
        var base = this;
        this.init = function () {
            var proto = (location.protocol == "http:") ? "ws://" : "wss://";
            var port = (location.protocol == "http:") ? ":" + location.port : ":8080";
            this.websocket = new WebSocket(proto + location.hostname + port + "/api/v1/events/ws");

            this.websocket.onopen = function () {
                console.log("WEBSOCKET: OPEN");
            };

            this.websocket.onmessage = function (msg) {
                var eventObj = JSON.parse(msg.data);
                var type = eventObj.type;
                var data = eventObj.event;

                switch (type) {
                    case "DeviceSeen":
                        SotaDispatcher.dispatch({actionType: 'impact-analysis'});
                        db.deviceSeen.reset(data);
                        break;
                    case "DeviceCreated":
                        db.deviceCreated.reset(data);
                        break;
                    case "PackageCreated":
                        db.packageCreated.reset(data);
                        break;
                    case "PackageBlacklisted":
                        db.packageBlacklisted.reset(data);
                        break;
                    case "UpdateSpec":
                        db.updateSpec.reset(data);
                        break;
                    default:
                        console.log('Unhandled event type: ' + eventObj.type);
                        break;
                }
            };

            this.websocket.onclose = function (msg) {
                console.log('WEBSOCKET: CLOSE');
                if (msg.code === 1006) {
                    base.init();
                }
            };

            this.websocket.onerror = function (msg) {
                console.log('WEBSOCKET: ERROR');
                console.log(msg);
            };
        };

        this.destroy = function () {
            this.websocket.close();
        };
    });

    return new WebsocketHandler();
});