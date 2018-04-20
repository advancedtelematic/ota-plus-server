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
                    stores.devicesStore._updateDeviceData(data.uuid, {lastSeen: data.lastSeen});
                    if(window.location.href.indexOf('/device/') > -1) {                        
                        stores.devicesStore.fetchDirectorAttributes(data.uuid);
                    }
                    break;
                case "DeviceUpdateStatus":
                    stores.devicesStore._updateDeviceData(data.device, {deviceStatus: data.status});
                    break;
                case "DeviceCreated":
                    stores.groupsStore.selectDefaultGroup();
                    stores.devicesStore.fetchDevices();
                    stores.devicesStore._increaseDeviceInitialTotalCount();
                    if(document.cookie.indexOf("fireworksPageAcknowledged") == -1 && stores.devicesStore.devicesInitialTotalCount === 1) {
                        window.location = '#/fireworks';
                    }
                    break;
                case "TufTargetAdded":
                    stores.packagesStore._addPackage(data);
                    break;
                case "PackageBlacklisted":
                    stores.packagesStore.fetchBlacklist();
                    break;
                case "UpdateSpec":
                    if(window.location.href.indexOf('/device/') > -1 && stores.devicesStore.device.uuid === data.device) {
                        stores.devicesStore.fetchMultiTargetUpdates(data.device);
                        if(data.status === 'Finished') {
                            stores.packagesStore.fetchPackagesHistory(data.device, stores.packagesStore.packagesHistoryFilter, true);
                            stores.packagesStore.fetchOndevicePackages(data.device, null);
                        }
                    }
                    if(data.status === 'Finished') {
                        if(Object.keys(stores.campaignsStore.campaign).length) {
                            let campaignId = stores.campaignsStore.campaign.id;
                            stores.campaignsStore.fetchCampaign(campaignId);
                        }
                        stores.campaignsStore.fetchCampaigns();
                    }
                    break;
                case "DeviceSystemInfoChanged":
                    stores.devicesStore.fetchDeviceNetworkInfo(data.uuid);
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
