const WebsocketHandler = (function (stores) {
    const base = this;
    this.init = function () {
        const proto = (location.protocol == "http:") ? "ws://" : "wss://";
        const port = (location.protocol == "http:") ? ":" + location.port : ":8080";
        this.websocket = new WebSocket(proto + location.hostname + port + "/api/v1/events/ws");

        this.websocket.onopen = function () {
            console.log("WEBSOCKET: OPEN");
        };

        this.websocket.onmessage = function (msg) {
            const eventObj = JSON.parse(msg.data);
            const type = eventObj.type;
            const data = eventObj.event;
            console.log('Websocket event');
            console.log(type);
            switch (type) {
                case "DeviceSeen":
                    stores.devicesStore._updateDeviceData(data.uuid, {lastSeen: data.lastSeen});
                    if(stores.devicesStore.onlineDevices.length === 1 && !stores.welcomePageAcknowledged) {
                        window.location = '#/fireworks'
                    }
                    if(stores.packagesStore.deviceQueue.length && stores.devicesStore.device.uuid === data.uuid) {
                        stores.packagesStore.fetchDevicePackagesHistory(data.uuid);
                        stores.packagesStore.fetchDevicePackagesUpdatesLogs(data.uuid);
                        stores.packagesStore.fetchDevicePackagesQueue(data.uuid);
                        stores.packagesStore.fetchDevicePackages(data.uuid, null);
                        stores.packagesStore.fetchOndevicePackages(data.uuid, null);
                    }
                    break;
                case "DeviceUpdateStatus":
                    stores.devicesStore._updateDeviceData(data.device, {deviceStatus: data.status});
                    break;
                case "DeviceCreated":
                    break;
                case "PackageCreated":
                    stores.packagesStore._addPackage(data);
                    break;
                case "PackageBlacklisted":
                    stores.packagesStore._blacklistPackage(data.id);
                    break;
                case "UpdateSpec":
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

export default WebsocketHandler;