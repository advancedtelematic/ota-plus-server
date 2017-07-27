const WebsocketHandler = (function (wsUrl, stores) {
    const base = this;
    let stop = false;
    this.init = function () {
        this.websocket = new WebSocket(wsUrl);

        this.websocket.onopen = function () {
            console.log("WEBSOCKET: OPEN");
        };

        this.websocket.onmessage = function (msg) {
            const eventObj = JSON.parse(msg.data);
            const type = eventObj.type;
            const data = eventObj.event;
            switch (type) {
                case "DeviceSeen":
                    stores.devicesStore.fetchInitialDevices();
                    if(stores.devicesStore.onlineDevices.length <= 1 && !(document.cookie.indexOf("fireworksPageAcknowledged") >= 0)) {
                        window.location = '#/fireworks'
                    }

                    stores.devicesStore._updateDeviceData(data.uuid, {lastSeen: data.lastSeen});
                    stores.packagesStore.fetchInitialDevicePackages(data.uuid);

                    if(window.location.href.indexOf('/device/') > -1) {
                        stores.hardwareStore.fetchHardwareWs(data.uuid);
                        stores.devicesStore.fetchDirectorAttributes(data.uuid);
                    }
                    break;
                case "DeviceUpdateStatus":
                    stores.devicesStore._updateDeviceData(data.device, {deviceStatus: data.status});
                    if(window.location.href.indexOf('/campaign/') > -1) {
                        stores.campaignsStore.fetchCampaign(stores.campaignsStore.campaign.id);
                    }
                    break;
                case "DeviceCreated":
                    break;
                case "PackageCreated":
                    stores.packagesStore._addPackage(data);
                    break;
                case "TufTargetAdded":
                    stores.packagesStore._addTufPackage(data);
                    break;
                case "PackageBlacklisted":
                    stores.packagesStore.fetchBlacklist();
                    break;
                case "UpdateSpec":
                    if(window.location.href.indexOf('/device/') > -1 && stores.devicesStore.device.isDirector && stores.devicesStore.device.uuid === data.device) {
                        stores.devicesStore.fetchMultiTargetUpdates(data.device);
                    }
                    if(stores.packagesStore.deviceQueue.length && stores.devicesStore.device.uuid === data.device) {
                        if(data.status !== 'Pending') {
                            stores.packagesStore.fetchDevicePackagesQueue(data.device);
                        }
                        if(data.status === 'Finished' || data.status === 'Failed') {
                            stores.packagesStore.fetchDevicePackagesHistory(data.device);
                            stores.packagesStore.fetchDevicePackagesUpdatesLogs(data.device);
                            stores.packagesStore.fetchOndevicePackages(data.device, null);
                        }
                    } else {
                        if(data.status === 'Finished') {
                            if(Object.keys(stores.campaignsStore.campaign).length) {
                                stores.campaignsStore.fetchCampaign(stores.campaignsStore.campaign.id);
                            }
                            stores.campaignsStore.fetchCampaigns();
                        }
                    }
                    break;
                default:
                    console.log('Unhandled event type: ' + eventObj.type);
                    break;
            }
        };

        this.websocket.onclose = function (msg) {
            console.log('WEBSOCKET: CLOSE');
            if (msg.code === 1006 && !stop) {
                base.init();
            }
        };

        this.websocket.onerror = function (msg) {
            console.log('WEBSOCKET: ERROR');
            console.log(msg);
            stop = true;
            base.destroy();
        };
    };

    this.destroy = function () {
        this.websocket.close();
    };
});

export default WebsocketHandler;
