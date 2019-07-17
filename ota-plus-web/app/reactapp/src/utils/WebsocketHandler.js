/** @format */

import _ from 'lodash';
import { WEB_EVENTS, UPDATE_STATUSES, ARTIFICIAL, GROUP_ALL } from '../constants';

const WebsocketHandler = function (wsUrl, stores) {
  console.log(`WebSocket: wsUrl: ${wsUrl}`);
  const base = this;
  let stop = false;
  this.init = function () {
    this.websocket = new WebSocket(wsUrl);

    this.websocket.onopen = function () {
      console.log('WebSocket: OPEN');
    };

    this.websocket.onmessage = function (msg) {
      try {
        const eventObj = JSON.parse(msg.data);
        const { type, event: data } = eventObj;
        if (
          Object.keys(WEB_EVENTS).find(key => WEB_EVENTS[key] === type)
          && _.isObject(data)
          && !_.isEmpty(data)
        ) {
          const { campaignsStore, devicesStore, groupsStore, softwareStore } = stores;
          const { type: groupType, groupName } = groupsStore.selectedGroup;
          console.log(`WebSocket message (${type}) data: ${JSON.stringify(data)}`);
          switch (type) {
            case WEB_EVENTS.DEVICE_SEEN:
              if (_.isString(data.uuid) && new Date(data.lastSeen).getTime()) {
                devicesStore.updateDeviceData(data.uuid, { lastSeen: data.lastSeen });
                if (window.location.href.indexOf('/device/') > -1) {
                  devicesStore.fetchDirectorAttributes(data.uuid);
                  devicesStore.updateStatus(data.uuid, UPDATE_STATUSES.DOWNLOADING);
                }
              }
              break;
            case WEB_EVENTS.DEVICE_UPDATE_STATUS:
              if (_.isString(data.device) && _.isString(data.status)) {
                devicesStore.updateDeviceData(data.device, { deviceStatus: data.status });
              }
              break;
            case WEB_EVENTS.DEVICE_CREATED:
              if (groupType === ARTIFICIAL && groupName === GROUP_ALL) {
                devicesStore.addDevice(data);
              }
              if (document.cookie.indexOf('fireworksPageAcknowledged') === -1
              && devicesStore.devicesInitialTotalCount === 1) {
                window.location = '#/fireworks';
              }
              break;
            case WEB_EVENTS.TUF_TARGET_ADDED:
              softwareStore.addPackage(data);
              break;
            case WEB_EVENTS.PACKAGE_BLACKLISTED:
              softwareStore.fetchBlacklist();
              break;
            case WEB_EVENTS.UPDATE_SPEC:
              if (window.location.href.indexOf('/device/') > -1 && devicesStore.device.uuid === data.device) {
                devicesStore.fetchMultiTargetUpdates(data.device);
                if (data.status === UPDATE_STATUSES.FINISHED) {
                  softwareStore.fetchPackagesHistory(data.device, softwareStore.packagesHistoryFilter, true);
                  softwareStore.fetchOndevicePackages(data.device, null);
                }
              }
              if (data.status === UPDATE_STATUSES.FINISHED) {
                if (campaignsStore.campaign) {
                  campaignsStore.fetchCampaign(campaignsStore.campaign.id);
                }
                campaignsStore.fetchCampaigns(campaignsStore.activeTab);
              }
              break;
            case WEB_EVENTS.DEVICE_SYSTEM_INFO_CHANGED:
              if (_.isString(data.uuid)) {
                devicesStore.fetchDeviceNetworkInfo(data.uuid, { isFromWs: true });
              }
              break;
            case WEB_EVENTS.DEVICE_EVENT_MESSAGE:
              if (_.isString(data.deviceUuid)) {
                devicesStore.updateStatus(data.deviceUuid, UPDATE_STATUSES.INSTALLING);
                devicesStore.fetchEvents(data.deviceUuid);
              }
              break;
            default:
              console.log(`Unhandled event type: ${eventObj.type}`);
              break;
          }
        }
      } catch (error) {
        // TODO: Handle error
      }
    };

    this.websocket.onclose = function (msg) {
      console.log(`WebSocket: CLOSE - msg.code: ${msg.code}, stop: ${stop}`);
      if (msg.code === 1006 && !stop) {
        base.init();
      }
    };

    this.websocket.onerror = function (msg) {
      console.log('WebSocket: ERROR - msg: ', msg);
      console.log(msg);
      stop = true;
      base.destroy();
    };
  };

  this.destroy = function () {
    this.websocket.close();
  };
};

export default WebsocketHandler;
