/** @format */

import { observable, computed, extendObservable } from 'mobx';
import axios from 'axios';
import _ from 'lodash';

import {
  API_DEVICES_SEARCH,
  API_DEVICES_NETWORK_INFO,
  API_DIRECTOR_DEVICES_SEARCH,
  API_DEVICES_DEVICE_DETAILS,
  API_DEVICES_DIRECTOR_DEVICE,
  API_DEVICES_CREATE,
  API_DEVICES_RENAME,
  API_DEVICES_DELETE,
  API_GET_MULTI_TARGET_UPDATE_INDENTIFIER,
  API_CREATE_MULTI_TARGET_UPDATE,
  API_FETCH_MULTI_TARGET_UPDATES,
  API_CANCEL_MULTI_TARGET_UPDATE,
  API_CAMPAIGNS_FETCH_SINGLE,
  API_UPDATES_SEARCH,
  API_DEVICE_APPROVAL_PENDING_CAMPAIGNS,
  DEVICES_LIMIT_PER_PAGE,
} from '../config';
import { resetAsync, handleAsyncSuccess, handleAsyncError } from '../utils/Common';

export default class DevicesStore {
  @observable devicesFetchAsync = {};
  @observable devicesByFilterFetchAsync = {};
  @observable devicesLoadMoreAsync = {};
  @observable devicesDeleteAsync = {};
  @observable devicesOneFetchAsync = {};
  @observable devicesOneNetworkInfoFetchAsync = {};
  @observable devicesCountFetchAsync = {};
  @observable devicesDirectorAttributesFetchAsync = {};
  @observable devicesDirectorHashesFetchAsync = {};
  @observable devicesCreateAsync = {};
  @observable devicesRenameAsync = {};
  @observable mtuCreateAsync = {};
  @observable mtuFetchAsync = {};
  @observable mtuCancelAsync = {};
  @observable eventsFetchAsync = {};
  @observable approvalPendingCampaignsFetchAsync = {};
  @observable ungroupedDevicesCountFetchAsync = {};
  @observable devices = [];
  @observable devicesTotalCount = null;
  @observable devicesInitialTotalCount = null;
  @observable ungroupedDevicesInitialTotalCount = 0;
  @observable devicesUngroupedCount_inAnyGroup = 0;
  @observable devicesUngroupedCount_notInSmartGroup = 0;
  @observable devicesUngroupedCount_notInFixedGroup = 0;
  @observable devicesCurrentPage = 1;
  @observable devicesOffset = 0;
  @observable devicesFilter = '';
  @observable devicesGroupFilter = null;
  @observable devicesSort = 'asc';
  @observable device = {};
  @observable deviceApprovalPendingCampaigns = {
    campaigns: [],
  };
  @observable deviceEvents = {};
  @observable deviceNetworkInfo = {
    local_ipv4: null,
    mac: null,
    hostname: null,
  };
  @observable deviceCurrentStatusFetchAsync = {};
  @observable multiTargetUpdates = [];
  @observable multiTargetUpdatesSaved = [];
  @observable directorDevicesCount = 0;
  @observable directorDevicesIds = [];
  @observable currentDeviceStatus = null;

  constructor() {
    resetAsync(this.devicesFetchAsync);
    resetAsync(this.ungroupedDevicesCountFetchAsync);
    resetAsync(this.devicesByFilterFetchAsync);
    resetAsync(this.devicesLoadMoreAsync);
    resetAsync(this.devicesDeleteAsync);
    resetAsync(this.devicesOneFetchAsync);
    resetAsync(this.devicesCountFetchAsync);
    resetAsync(this.devicesDirectorAttributesFetchAsync);
    resetAsync(this.devicesDirectorHashesFetchAsync);
    resetAsync(this.devicesCreateAsync);
    resetAsync(this.devicesRenameAsync);
    resetAsync(this.mtuCreateAsync);
    resetAsync(this.mtuFetchAsync);
    resetAsync(this.mtuCancelAsync);
    resetAsync(this.eventsFetchAsync);
    resetAsync(this.approvalPendingCampaignsFetchAsync);
    this.devicesLimit = DEVICES_LIMIT_PER_PAGE;
  }

  @computed get lastDevices() {
    return _.sortBy(this.devices, device => {
      return device.lastSeen;
    })
      .reverse()
      .slice(0, 10);
  }

  deleteDevice(id) {
    resetAsync(this.devicesDeleteAsync, true);
    return axios
      .delete(API_DEVICES_DELETE + '/' + id)
      .then(response => {
        this.devices = _.without(
          this.devices,
          _.find(this.devices, {
            uuid: id,
          }),
        );
        this._prepareDevices();
        this.devicesDeleteAsync = handleAsyncSuccess(response);
      })
      .catch(error => {
        this.devicesDeleteAsync = handleAsyncError(error);
      });
  }

  fetchDevices(filter = '', groupId, ungrouped, async = 'devicesFetchAsync', limit = DEVICES_LIMIT_PER_PAGE) {
    resetAsync(this[async], true);
    this.devicesOffset = 0;
    this.devicesCurrentPage = 1;
    this.devicesFilter = filter;
    this.devicesGroupFilter = groupId;
    let apiAddress = `${API_DEVICES_SEARCH}?nameContains=${filter}&limit=${limit}&offset=${this.devicesOffset}`;
    if (groupId && groupId === 'ungrouped') {
      switch (ungrouped) {
        case 'inAnyGroup':
          apiAddress += `&grouped=false`;
          break;
        case 'notInSmartGroup':
          apiAddress += `&grouped=false&groupType=dynamic`;
          break;
        case 'notInFixedGroup':
          apiAddress += `&grouped=false&groupType=static`;
          break;
      }
    } else if (groupId) apiAddress += `&groupId=${groupId}`;
    return axios
      .get(apiAddress)
      .then(response => {
        this.devices = response.data.values;
        this.devicesTotalCount = response.data.total;
        if (this.devicesInitialTotalCount === null && groupId !== 'ungrouped') {
          this.devicesInitialTotalCount = response.data.total;
        }
        if (groupId && groupId === 'ungrouped') {
          switch (ungrouped) {
            case 'inAnyGroup':
              this.devicesUngroupedCount_inAnyGroup = response.data.total;
              break;
            case 'notInSmartGroup':
              this.devicesUngroupedCount_notInSmartGroup = response.data.total;
              break;
            case 'notInFixedGroup':
              this.devicesUngroupedCount_notInFixedGroup = response.data.total;
              break;
          }
        }
        this._prepareDevices();
        this[async] = handleAsyncSuccess(response);
      })
      .catch(error => {
        this[async] = handleAsyncError(error);
      });
  }

  fetchDevicesWithLimit(limit) {
    this.fetchDevices('', undefined, undefined, 'devicesFetchAsync', limit);
  }

  fetchUngroupedDevicesCount(async = 'ungroupedDevicesCountFetchAsync') {
    resetAsync(this[async], true);
    return axios
      .all([axios.get(`${API_DEVICES_SEARCH}?grouped=false`), axios.get(`${API_DEVICES_SEARCH}?grouped=false&groupType=dynamic`), axios.get(`${API_DEVICES_SEARCH}?grouped=false&groupType=static`)])
      .then(
        axios.spread((inAnyGroup, notInSmartGroup, notInFixedGroup) => {
          this.devicesUngroupedCount_inAnyGroup = inAnyGroup.data.total;
          this.devicesUngroupedCount_notInSmartGroup = notInSmartGroup.data.total;
          this.devicesUngroupedCount_notInFixedGroup = notInFixedGroup.data.total;
          this[async] = handleAsyncSuccess(response);
        }),
      )
      .catch(error => {
        this[async] = handleAsyncError(error);
      });
  }

  loadMoreDevices = (filter = '', groupId, limit = DEVICES_LIMIT_PER_PAGE, newOffset) => {
    resetAsync(this.devicesLoadMoreAsync, true);
    let apiAddress = `${API_DEVICES_SEARCH}?nameContains=${filter}&limit=${limit}&offset=${newOffset}`;
    if (groupId && groupId === 'ungrouped') apiAddress += `&grouped=false`;
    else if (groupId) apiAddress += `&groupId=${groupId}`;
    return axios
      .get(apiAddress)
      .then((response) => {
        this.devicesCurrentPage += 1;
        this.devicesOffset = newOffset;
        this.devices = _.uniqBy(this.devices.concat(response.data.values), item => item.uuid);
        this._prepareDevices();
        this.devicesLoadMoreAsync = handleAsyncSuccess(response);
      })
      .catch((error) => {
        this.devicesLoadMoreAsync = handleAsyncError(error);
      });
  }

  _addDevice(data) {
    this.devices.push({
      activatedAt: data.timestamp,
      createdAt: data.timestamp,
      deviceId: data.deviceId,
      deviceName: data.deviceName,
      deviceStatus: 'UpToDate',
      deviceType: data.deviceType,
      lastSeen: data.timestamp,
      uuid: data.uuid,
    });
    if (this.devicesInitialTotalCount === null) {
      this.devicesInitialTotalCount = 0;
    }
    this.devicesInitialTotalCount++;
    this._prepareDevices();
  }

  fetchDevice(id) {
    resetAsync(this.devicesOneFetchAsync, true);
    let that = this;
    return axios
      .all([
        axios.get(API_DEVICES_DEVICE_DETAILS + '/' + id + '?status=true'),
        axios.get(API_DEVICES_DIRECTOR_DEVICE + '/' + id, {
          validateStatus: function(status) {
            return status === 200 || status === 404;
          },
        }),
      ])
      .then(
        axios.spread(function(legacy, director) {
          that.device = legacy.data;
          if (director.data.code !== 'missing_device') {
            that.device.isDirector = true;
            let primary = _.filter(director.data, (data, index) => {
              return data.primary;
            });
            let secondary = _.filter(director.data, (data, index) => {
              return !data.primary;
            });
            that.device.directorAttributes = {
              primary: _.first(primary),
              secondary: secondary,
            };
          }
          that.devicesOneFetchAsync = handleAsyncSuccess(legacy);
        }),
      )
      .catch(error => {
        that.device.httpStatus = error.response.status;
        that.devicesOneFetchAsync = handleAsyncError(error);
      });
  }

  fetchDeviceNetworkInfo(id, isFromWs = false) {
    resetAsync(this.devicesOneNetworkInfoFetchAsync, true);
    if (!isFromWs || (isFromWs && this.device.uuid === id)) {
      return axios
        .get(API_DEVICES_NETWORK_INFO + '/' + id + '/system_info/network')
        .then(response => {
          this.deviceNetworkInfo = response.data;
          this.devicesOneNetworkInfoFetchAsync = handleAsyncSuccess(response);
        })
        .catch(error => {
          this.devicesOneNetworkInfoFetchAsync = handleAsyncError(error);
        });
    }
  }

  createMultiTargetUpdate(data, id) {
    let updateObject = this._prepareUpdateObject(data);
    resetAsync(this.mtuCreateAsync, true);
    return axios
      .post(API_GET_MULTI_TARGET_UPDATE_INDENTIFIER, updateObject)
      .then(response => {
        let updateIdentifier = response.data;
        let status = null;
        if (updateIdentifier.length) {
          let after = _.after(
            status === 'success',
            () => {
              this.fetchMultiTargetUpdates(id);
              this.mtuCreateAsync = handleAsyncSuccess(response);
            },
            this,
          );
          axios
            .put(API_CREATE_MULTI_TARGET_UPDATE + '/' + id + '/multi_target_update/' + updateIdentifier)
            .then(function(multiTargetResponse) {
              status = 'success';
              after();
            })
            .catch(function() {
              status = 'error';
              after();
            });
        }
      })
      .catch(error => {
        this.mtuCreateAsync = handleAsyncError(error);
      });
  }

  _prepareUpdateObject(data) {
    return {
      targets: {
        [data.hardwareId]: {
          to: {
            target: data.target,
            checksum: {
              method: 'sha256',
              hash: data.hash,
            },
            targetLength: data.targetLength,
          },
          targetFormat: data.targetFormat,
          generateDiff: data.generateDiff,
        },
      },
    };
  }

  fetchMultiTargetUpdates(id) {
    resetAsync(this.mtuFetchAsync, true);
    return axios
      .get(API_FETCH_MULTI_TARGET_UPDATES + '/' + id + '/queue')
      .then(response => {
        let data = response.data;
        let after = _.after(
          data.length,
          () => {
            this._fetchCurrentStatus(id);
            this.multiTargetUpdates = response.data;
            this.multiTargetUpdatesSaved = _.uniq(this.multiTargetUpdates.concat(response.data), item => item.device);
            this.mtuFetchAsync = handleAsyncSuccess(response);
          },
          this,
        );
        if (data.length) {
          _.each(data, (item, index) => {
            item.device = id;
            item.status = 'waiting';
            if (item.correlationId && item.correlationId.search('urn:here-ota:campaign:') >= 0) {
              let campaignId = item.correlationId.substring('urn:here-ota:campaign:'.length);
              let afterCampaign = _.after(
                data.length,
                () => {
                  axios
                    .get(API_UPDATES_SEARCH + '/' + item.campaign.update.id)
                    .then(response => {
                      let update = response.data;
                      item.campaign = Object.assign(item.campaign, {
                        update: {
                          id: update.uuid,
                          description: update.description,
                          name: update.name,
                        },
                      });
                      after();
                    })
                    .catch(() => {
                      after();
                    });
                },
                this,
              );

              axios
                .get(API_CAMPAIGNS_FETCH_SINGLE + '/' + campaignId)
                .then(response => {
                  let campaign = response.data;
                  item.campaign = {
                    id: campaign.id,
                    name: campaign.name,
                    update: {
                      id: campaign.update,
                    },
                  };
                  afterCampaign();
                })
                .catch(() => {
                  afterCampaign();
                });
            } else {
              after();
            }
          });
        } else {
          after();
        }
      })
      .catch(error => {
        this.mtuFetchAsync = handleAsyncError(error);
      });
  }

  fetchEvents(id, async = 'eventsFetchAsync') {
    resetAsync(this[async], true);
    return axios
      .get(API_DEVICES_SEARCH + '/' + id + '/events')
      .then(response => {
        this.deviceEvents = response.data;
        this[async] = handleAsyncSuccess(response);
      })
      .catch(error => {
        this[async] = handleAsyncError(error);
      });
  }

  fetchApprovalPendingCampaigns(id, async = 'approvalPendingCampaignsFetchAsync') {
    resetAsync(this[async], true);
    return axios
      .get(API_DEVICE_APPROVAL_PENDING_CAMPAIGNS + '/' + id + '/campaigns')
      .then(response => {
        let data = response.data;
        let after = _.after(
          data.campaigns.length,
          () => {
            this.deviceApprovalPendingCampaigns = response.data;
            this[async] = handleAsyncSuccess(response);
          },
          this,
        );
        if (data.campaigns.length) {
          _.each(data.campaigns, item => {
            let status = null;
            let afterCampaign = _.after(
              status === 'success',
              () => {
                axios
                  .get(API_UPDATES_SEARCH + '/' + item.update.id)
                  .then(response => {
                    let update = response.data;
                    item.update = {
                      id: update.uuid,
                      description: update.description,
                      name: update.name,
                    };
                    after();
                  })
                  .catch(() => {
                    after();
                  });
              },
              this,
            );
            axios
              .get(API_CAMPAIGNS_FETCH_SINGLE + '/' + item.id)
              .then(response => {
                let campaign = response.data;
                item.update = {
                  id: campaign.update,
                };
                status = 'success';
                afterCampaign();
              })
              .catch(() => {
                status = 'error';
                afterCampaign();
              });
          });
        } else {
          after();
        }
      })
      .catch(error => {
        this[async] = handleAsyncError(error);
      });
  }

  _findMtu(id) {
    return this.multiTargetUpdates.find(update => update.device === id);
  }

  _updateStatus(id, status) {
    if (this.multiTargetUpdates.length) {
      const update = this._findMtu(id);
      update['status'] = status;
    }
  }

  cancelMtuUpdate(data) {
    resetAsync(this.mtuCancelAsync, true);
    return axios
      .post(API_CANCEL_MULTI_TARGET_UPDATE, data)
      .then(
        function(response) {
          this.fetchMultiTargetUpdates(this.device.uuid);
          this.mtuCancelAsync = handleAsyncSuccess(response);
        }.bind(this),
      )
      .catch(
        function(error) {
          this.mtuCancelAsync = handleAsyncError(error);
        }.bind(this),
      );
  }

  cancelApprovalPendingCampaingPerDevice(data) {
    resetAsync(this.mtuCancelAsync, true);
    return axios
      .post(API_CANCEL_MULTI_TARGET_UPDATE, data)
      .then(
        function(response) {
          this.mtuCancelAsync = handleAsyncSuccess(response);
        }.bind(this),
      )
      .catch(
        function(error) {
          this.mtuCancelAsync = handleAsyncError(error);
        }.bind(this),
      );
  }

  fetchDevicesCount() {
    resetAsync(this.devicesCountFetchAsync, true);
    let that = this;
    return axios
      .all([axios.get(API_DEVICES_SEARCH), axios.get(API_DIRECTOR_DEVICES_SEARCH)])
      .then(
        axios.spread(function(all, director) {
          let allDevicesCount = all.data.total;
          that.directorDevicesCount = director.data.total;
          that.directorDevicesIds = director.data.values;
          that.devicesCountFetchAsync = handleAsyncSuccess(all);
        }),
      )
      .catch(error => {
        that.devicesCountFetchAsync = handleAsyncError(error);
      });
  }

  _fetchCurrentStatus(id) {
    resetAsync(this.deviceCurrentStatusFetchAsync, true);
    return axios
      .get(API_DEVICES_DEVICE_DETAILS + '/' + id)
      .then(response => {
        this.device.deviceStatus = response.data.deviceStatus;
        this.deviceCurrentStatusFetchAsync = handleAsyncSuccess(response);
      })
      .catch(error => {
        this.deviceCurrentStatusFetchAsync = handleAsyncError(error);
      });
  }

  fetchDirectorAttributes(id) {
    let device = this._getDevice(id);
    if (!_.isEmpty(this.device) && this.device.uuid === id) {
      resetAsync(this.devicesDirectorAttributesFetchAsync, true);
      return axios
        .get(API_DEVICES_DIRECTOR_DEVICE + '/' + id)
        .then(response => {
          let primary = _.filter(response.data, (data, index) => {
            return data.primary;
          });
          let secondary = _.filter(response.data, (data, index) => {
            return !data.primary;
          });
          extendObservable(this.device, {
            directorAttributes: {
              primary: _.first(primary),
              secondary: secondary,
            },
          });
          this.devicesDirectorAttributesFetchAsync = handleAsyncSuccess(response);
        })
        .catch(error => {
          this.devicesDirectorAttributesFetchAsync = handleAsyncError(error);
        });
    } else if (device) {
      resetAsync(this.devicesDirectorAttributesFetchAsync, true);
      return axios
        .get(API_DEVICES_DIRECTOR_DEVICE + '/' + id)
        .then(response => {
          let primary = _.filter(response.data, (data, index) => {
            return data.primary;
          });
          let secondary = _.filter(response.data, (data, index) => {
            return !data.primary;
          });
          extendObservable(device, {
            directorAttributes: {
              primary: _.first(primary),
              secondary: secondary,
            },
          });
          this.devicesDirectorAttributesFetchAsync = handleAsyncSuccess(response);
        })
        .catch(error => {
          this.devicesDirectorAttributesFetchAsync = handleAsyncError(error);
        });
    }
  }

  fetchPrimaryAndSecondaryFilepaths(id) {
    resetAsync(this.devicesDirectorHashesFetchAsync, true);
    return axios
      .get(API_DEVICES_DIRECTOR_DEVICE + '/' + id)
      .then(response => {
        let filepaths = _.map(response.data, (item, i) => {
          return item.image.filepath;
        });
        this.devicesDirectorHashesFetchAsync = handleAsyncSuccess(response);
        return filepaths;
      })
      .catch(error => {
        this.devicesDirectorHashesFetchAsync = handleAsyncError(error);
      });
  }

  _getPrimaryFilepath() {
    return this.device.directorAttributes.primary.image.filepath;
  }

  _getPrimarySerial() {
    return this.device.directorAttributes.primary.id;
  }

  _getPrimaryHardwareId() {
    return this.device.directorAttributes.primary.hardwareId;
  }

  _getSecondaryFilepathsBySerial(serial) {
    let filepaths = [];
    _.map(this.device.directorAttributes.secondary, (secondary, index) => {
      if (secondary.id === serial) {
        filepaths.push(secondary.image.filepath);
      }
    });
    return filepaths;
  }

  _getPrimaryByHardwareId(hardwareId) {
    if (this.device.directorAttributes.primary.hardwareId === hardwareId) {
      return this.device.directorAttributes.primary;
    }
    return null;
  }

  _getSecondaryBySerial(serial) {
    let secondaryObject = {};
    _.each(this.device.directorAttributes.secondary, (secondary, index) => {
      if (secondary.id === serial) {
        secondaryObject = secondary;
      }
    });
    return secondaryObject;
  }

  createDevice(data) {
    resetAsync(this.devicesCreateAsync, true);
    return axios
      .post(API_DEVICES_CREATE, data)
      .then(response => {
        this.devicesCreateAsync = handleAsyncSuccess(response);
      })
      .catch(error => {
        this.devicesCreateAsync = handleAsyncError(error);
      });
  }

  renameDevice(id, data) {
    resetAsync(this.devicesRenameAsync, true);
    return axios
      .put(API_DEVICES_RENAME + '/' + id, data)
      .then(response => {
        this.devicesRenameAsync = handleAsyncSuccess(response);
        if (this.device.uuid === id) {
          this.device.deviceName = data.deviceName;
        } else {
          let device = _.find(this.devices, device => device.uuid === id);
          device.deviceName = data.deviceName;
        }
        this.fetchDevicesCount();
      })
      .catch(error => {
        this.devicesRenameAsync = handleAsyncError(error);
      });
  }

  _reset() {
    resetAsync(this.devicesFetchAsync);
    resetAsync(this.devicesByFilterFetchAsync);
    resetAsync(this.devicesLoadMoreAsync);
    resetAsync(this.devicesDeleteAsync);
    resetAsync(this.devicesOneFetchAsync);
    resetAsync(this.devicesOneNetworkInfoFetchAsync);
    resetAsync(this.devicesCountFetchAsync);
    resetAsync(this.devicesDirectorAttributesFetchAsync);
    resetAsync(this.devicesDirectorHashesFetchAsync);
    resetAsync(this.devicesCreateAsync);
    resetAsync(this.devicesRenameAsync);
    resetAsync(this.mtuCreateAsync);
    resetAsync(this.mtuFetchAsync);
    resetAsync(this.mtuCancelAsync);
    resetAsync(this.eventsFetchAsync);
    resetAsync(this.approvalPendingCampaignsFetchAsync);
    resetAsync(this.deviceCurrentStatusFetchAsync);
    resetAsync(this.ungroupedDevicesCountFetchAsync);
    this.devices = [];
    this.devicesTotalCount = null;
    this.devicesCurrentPage = 1;
    this.devicesOffset = 0;
    this.devicesFilter = '';
    this.devicesSort = 'asc';
    this.device = {};
    this.deviceNetworkInfo = {
      ip: null,
      mac: null,
      hostname: null,
    };
    this.multiTargetUpdates = [];
    this.multiTargetUpdatesSaved = [];
    this.directorDevicesCount = 0;
    this.directorDevicesIds = [];
  }

  _getDevice(id) {
    return _.find(this.devices, { uuid: id });
  }

  _updateDeviceData(id, data) {
    let device = this._getDevice(id);
    if (!_.isEmpty(this.device)) {
      if (this.device.uuid === id) {
        _.each(data, (value, attr) => {
          this.device[attr] = value;
        });
      }
    } else if (device) {
      _.each(data, (value, attr) => {
        device[attr] = value;
      });
    }
  }

  _prepareDevices(devicesSort = this.devicesSort) {
    this.devicesSort = devicesSort;
    this.devices = this.devices.slice().sort((a, b) => {
      let aName = a.deviceName;
      let bName = b.deviceName;
      if (devicesSort !== 'undefined' && devicesSort == 'desc') return bName.localeCompare(aName);
      else return aName.localeCompare(bName);
    });
  }
}
