/* eslint-disable no-param-reassign */
/** @format */

import { observable, computed, extendObservable } from 'mobx';
import axios from 'axios';
import _ from 'lodash';
import encodeUrl from 'encodeurl';

import {
  API_DEVICES_CUSTOM_FIELDS,
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
  API_CANCEL_UPDATE_PENDING_APPROVAL,
  API_CAMPAIGNS_FETCH_SINGLE,
  API_UPDATES_SEARCH,
  API_DEVICE_APPROVAL_PENDING_CAMPAIGNS,
  APPROVAL_PENDING_CAMP_FETCH_ASYNC,
  DEVICE_HISTORY_LIMIT,
  DEVICE_STATUS,
  DEVICES_LIMIT_PER_PAGE,
  DEVICES_PAGE_NUMBER_DEFAULT,
  EVENTS_FETCH_ASYNC,
  IN_ANY_GROUP,
  MISSING_DEVICE_CODE,
  NOT_IN_SMART_GROUP,
  NOT_IN_FIXED_GROUP,
  NOT_SEEN_RECENTLY_HOURS,
  UNGROUPED,
  UNGROUPED_DEVICES_COUNT_FETCH_ASYNC,
  API_ORG_CUSTOM_DEVICE_FIELDS,
  API_DEVICE_TAGS,
  API_DEVICE_SPECIFIC_TAGS,
} from '../config';
import {
  SHA_256,
  SORT_DIR_ASC,
  SORT_DIR_DESC,
  STATUS,
  UPLOADING_STATUS,
} from '../constants';
import { resetAsync, handleAsyncSuccess, handleAsyncError } from '../utils/Common';
import { HTTP_CODE_200_OK, HTTP_CODE_400_BAD_REQUEST, HTTP_CODE_404_NOT_FOUND } from '../constants/httpCodes';

export default class DevicesStore {
  @observable devicesFetchAsync = {};

  @observable devicesStatsFetchAsync = {};

  @observable notSeenRecentlyDevicesFetchAsync = {};

  @observable ungroupedDevicesFetchAsync = {};

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

  @observable uploadCustomFieldsAsync = {};

  @observable devices = [];

  @observable devicesTotalCount = null;

  @observable devicesPageNumber = DEVICES_PAGE_NUMBER_DEFAULT;

  @observable notSeenRecentlyDevicesTotal = 0;

  @observable ungroupedDevicesTotal = 0;

  @observable devicesInitialTotalCount = null;

  @observable ungroupedDevicesInitialTotalCount = 0;

  @observable devicesUngroupedCountInAnyGroup = 0;

  @observable devicesOffset = 0;

  @observable devicesFilter = '';

  @observable devicesGroupFilter = null;

  @observable devicesSort = SORT_DIR_ASC;

  @observable device = {};

  @observable deviceApprovalPendingCampaigns = {
    campaigns: [],
  };

  @observable deviceEvents = [];

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

  @observable devicesFetchingError = false;

  @observable customDeviceFields = [];

  @observable deviceSpecificTags = [];

  @observable getCustomDeviceFieldsAsync = {};

  @observable getDeviceSpecificTagsAsync = {};

  @observable renameCustomDeviceFieldAsync = {};

  @observable deleteCustomDeviceFieldAsync = {};

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
    resetAsync(this.getCustomDeviceFieldsAsync);
    resetAsync(this.uploadCustomFieldsAsync);
    resetAsync(this.renameCustomDeviceFieldAsync);
    resetAsync(this.deleteCustomDeviceFieldAsync);
    this.devicesLimit = DEVICES_LIMIT_PER_PAGE;
  }

  @computed get lastDevices() {
    return _.sortBy(this.devices, device => device.lastSeen)
      .reverse()
      .slice(0, DEVICE_HISTORY_LIMIT);
  }

  async fetchDevicesStats() {
    try {
      const { data } = await axios.get(`${API_DEVICES_SEARCH}`);
      this.devicesTotalCount = data.total;
    } catch (err) {
      this.devicesStatsFetchAsync = handleAsyncError(err);
    }
  }

  async fetchNotSeenRecentlyDevices() {
    const hours = NOT_SEEN_RECENTLY_HOURS;
    try {
      const { data } = await axios.get(`${API_DEVICES_SEARCH}?notSeenSinceHours=${hours}`);
      this.notSeenRecentlyDevicesTotal = data.total;
    } catch (err) {
      this.notSeenRecentlyDevicesFetchAsync = handleAsyncError(err);
    }
  }

  async fetchUngroupedDevices() {
    try {
      const { data } = await axios.get(`${API_DEVICES_SEARCH}?grouped=false`);
      this.ungroupedDevicesTotal = data.total;
    } catch (err) {
      this.ungroupedDevicesFetchAsync = handleAsyncError(err);
    }
  }

  deleteDevice(id) {
    resetAsync(this.devicesDeleteAsync, true);
    return axios
      .delete(`${API_DEVICES_DELETE}/${id}`)
      .then((response) => {
        this.devices = _.without(
          this.devices,
          _.find(this.devices, {
            uuid: id,
          }),
        );
        this.prepareDevices();
        this.devicesDeleteAsync = handleAsyncSuccess(response);
      })
      .catch((error) => {
        this.devicesDeleteAsync = handleAsyncError(error);
      });
  }

  getCustomDeviceFields = async () => {
    resetAsync(this.getCustomDeviceFieldsAsync, true);
    try {
      const response = await axios.get(encodeUrl(API_ORG_CUSTOM_DEVICE_FIELDS));
      const { data } = response;
      this.customDeviceFields = data;
      this.getCustomDeviceFieldsAsync = handleAsyncSuccess(response);
    } catch (error) {
      this.getCustomDeviceFieldsAsync = handleAsyncError(error);
    }
  }

  getDeviceSpecificTags = async (id) => {
    resetAsync(this.getDeviceSpecificTagsAsync, true);
    try {
      const response = await axios.get(encodeUrl(API_DEVICE_SPECIFIC_TAGS(id)));
      const { data } = response;
      this.deviceSpecificTags = data;
      this.getDeviceSpecificTagsAsync = handleAsyncSuccess(response);
    } catch (error) {
      this.getDeviceSpecificTagsAsync = handleAsyncError(error);
    }
  }

  renameDeviceSpecificTagValue = async (id, tagId, tagValue) => {
    resetAsync(this.getDeviceSpecificTagsAsync, true);
    try {
      const response = await axios.patch(encodeUrl(API_DEVICE_SPECIFIC_TAGS(id)), { tagId, tagValue });
      const { data } = response;
      // TODO: Handle response
      console.log(data);

      this.getDeviceSpecificTagsAsync = handleAsyncSuccess(response);
    } catch (error) {
      this.getDeviceSpecificTagsAsync = handleAsyncError(error);
    }
  }

  renameCustomDeviceField = async (currentFieldName, newFieldName, onFinished) => {
    resetAsync(this.renameCustomDeviceFieldAsync, true);
    try {
      const response = await axios.put(encodeUrl(`${API_DEVICE_TAGS}/${currentFieldName}`), { tagId: newFieldName });
      onFinished();
      this.getCustomDeviceFields();
      this.renameCustomDeviceFieldAsync = handleAsyncSuccess(response);
    } catch (error) {
      this.renameCustomDeviceFieldAsync = handleAsyncError(error);
    }
  }

  deleteCustomDeviceField = async (fieldName, onFinished) => {
    resetAsync(this.deleteCustomDeviceFieldAsync, true);
    try {
      const response = await axios.delete(encodeUrl(`${API_DEVICE_TAGS}/${fieldName}`));
      onFinished();
      this.getCustomDeviceFields();
      this.deleteCustomDeviceFieldAsync = handleAsyncSuccess(response);
    } catch (error) {
      this.deleteCustomDeviceFieldAsync = handleAsyncError(error);
    }
  }

  fetchDevices(filter = '', groupId, ungrouped, limit = DEVICES_LIMIT_PER_PAGE, offset = 0) {
    resetAsync(this.devicesFetchAsync, true);
    this.devicesFetchingError = false;
    this.devicesOffset = offset;
    this.devicesFilter = filter;
    this.devicesGroupFilter = groupId;
    let apiAddress = `${API_DEVICES_SEARCH}?nameContains=${filter}&limit=${limit}&offset=${this.devicesOffset}`;
    if (groupId && groupId === UNGROUPED) {
      switch (ungrouped) {
        case IN_ANY_GROUP:
          apiAddress += '&grouped=false';
          break;
        case NOT_IN_SMART_GROUP:
          apiAddress += '&grouped=false&groupType=dynamic';
          break;
        case NOT_IN_FIXED_GROUP:
          apiAddress += '&grouped=false&groupType=static';
          break;
        default:
          break;
      }
    } else if (groupId) apiAddress += `&groupId=${groupId}`;
    return axios
      .get(apiAddress)
      .then((response) => {
        this.devices = response.data.values;
        this.devicesTotalCount = response.data.total;
        if (this.devicesInitialTotalCount === null && groupId !== UNGROUPED) {
          this.devicesInitialTotalCount = response.data.total;
        }
        this.prepareDevices();
        this.devicesFetchingError = false;
        this.devicesFetchAsync = handleAsyncSuccess(response);
      })
      .catch((error) => {
        this.devicesFetchingError = true;
        this.devicesFetchAsync = handleAsyncError(error);
      });
  }

  fetchDevicesWithLimit(limit) {
    this.fetchDevices('', undefined, undefined, limit);
  }

  fetchUngroupedDevicesCount(async = UNGROUPED_DEVICES_COUNT_FETCH_ASYNC) {
    resetAsync(this[async], true);
    return axios
      .all([axios.get(`${API_DEVICES_SEARCH}?grouped=false`)])
      .then(
        axios.spread((inAnyGroup) => {
          this.devicesUngroupedCountInAnyGroup = inAnyGroup.data.total;
          this[async] = handleAsyncSuccess();
        }),
      )
      .catch((error) => {
        this[async] = handleAsyncError(error);
      });
  }

  loadMoreDevices = (filter = '', groupId, limit = DEVICES_LIMIT_PER_PAGE, offset) => {
    resetAsync(this.devicesLoadMoreAsync, true);
    let apiAddress = `${API_DEVICES_SEARCH}?nameContains=${filter}&limit=${limit}&offset=${offset}`;
    if (groupId && groupId === UNGROUPED) apiAddress += '&grouped=false';
    else if (groupId) apiAddress += `&groupId=${groupId}`;
    return axios
      .get(apiAddress)
      .then((response) => {
        this.devicesOffset = offset;
        this.devices = _.uniqBy(response.data.values, item => item.uuid);
        this.prepareDevices();
        this.devicesLoadMoreAsync = handleAsyncSuccess(response);
      })
      .catch((error) => {
        this.devicesLoadMoreAsync = handleAsyncError(error);
      });
  }

  addDevice(data) {
    this.devices.push({
      activatedAt: data.timestamp,
      createdAt: data.timestamp,
      deviceId: data.deviceId,
      deviceName: data.deviceName,
      deviceStatus: DEVICE_STATUS.UP_TO_DATE,
      deviceType: data.deviceType,
      lastSeen: data.timestamp,
      uuid: data.uuid,
    });
    if (this.devicesInitialTotalCount === null) {
      this.devicesInitialTotalCount = 0;
    }
    this.devicesInitialTotalCount += 1;
    this.prepareDevices();
  }

  fetchDevice(id) {
    resetAsync(this.devicesOneFetchAsync, true);
    const that = this;
    return axios
      .all([
        axios.get(`${API_DEVICES_DEVICE_DETAILS}/${id}?status=true`),
        axios.get(`${API_DEVICES_DIRECTOR_DEVICE}/${id}`, {
          validateStatus(status) {
            return status === HTTP_CODE_200_OK || status === HTTP_CODE_404_NOT_FOUND;
          },
        }),
      ])
      .then(
        axios.spread((legacy, director) => {
          that.device = legacy.data;
          if (director.data.code !== MISSING_DEVICE_CODE) {
            that.device.isDirector = true;
            const primary = _.filter(director.data, data => data.primary);
            const secondary = _.filter(director.data, data => !data.primary);
            that.device.directorAttributes = {
              primary: _.first(primary),
              secondary,
            };
          }
          that.devicesOneFetchAsync = handleAsyncSuccess(legacy);
        }),
      )
      .catch((error) => {
        that.device.httpStatus = error.response.status;
        that.devicesOneFetchAsync = handleAsyncError(error);
      });
  }

  fetchDeviceNetworkInfo(id, isFromWs = false) {
    resetAsync(this.devicesOneNetworkInfoFetchAsync, true);
    if (!isFromWs || (isFromWs && this.device.uuid === id)) {
      return axios
        .get(`${API_DEVICES_NETWORK_INFO}/${id}/system_info/network`)
        .then((response) => {
          this.deviceNetworkInfo = response.data;
          this.devicesOneNetworkInfoFetchAsync = handleAsyncSuccess(response);
        })
        .catch((error) => {
          this.devicesOneNetworkInfoFetchAsync = handleAsyncError(error);
        });
    }
    return null;
  }

  createMultiTargetUpdate(data, id) {
    const updateObject = this.prepareUpdateObject(data);
    resetAsync(this.mtuCreateAsync, true);
    return axios
      .post(API_GET_MULTI_TARGET_UPDATE_INDENTIFIER, updateObject)
      .then((response) => {
        const updateIdentifier = response.data;
        let status = null;
        if (updateIdentifier.length) {
          const after = _.after(
            status === STATUS.SUCCESS,
            () => {
              this.fetchMultiTargetUpdates(id);
              this.mtuCreateAsync = handleAsyncSuccess(response);
            },
            this,
          );
          axios
            .put(`${API_CREATE_MULTI_TARGET_UPDATE}/${id}/multi_target_update/${updateIdentifier}`)
            .then(() => {
              status = STATUS.SUCCESS;
              after();
            })
            .catch(() => {
              status = STATUS.ERROR;
              after();
            });
        }
      })
      .catch((error) => {
        this.mtuCreateAsync = handleAsyncError(error);
      });
  }

  prepareUpdateObject = data => ({
    targets: {
      [data.hardwareId]: {
        to: {
          target: data.target,
          checksum: {
            method: SHA_256,
            hash: data.hash,
          },
          targetLength: data.targetLength,
        },
        targetFormat: data.targetFormat,
        generateDiff: data.generateDiff,
      },
    },
  });

  fetchMultiTargetUpdates(id) {
    resetAsync(this.mtuFetchAsync, true);
    return axios
      .get(`${API_FETCH_MULTI_TARGET_UPDATES}/${id}`)
      .then((response) => {
        const { data } = response;
        const after = _.after(
          data.length,
          () => {
            this.fetchCurrentStatus(id);
            this.multiTargetUpdates = response.data;
            this.multiTargetUpdatesSaved = _.uniq(this.multiTargetUpdates.concat(response.data), item => item.device);
            this.mtuFetchAsync = handleAsyncSuccess(response);
          },
          this,
        );
        if (data.length) {
          _.each(data, (item) => {
            item.device = id;
            item.status = STATUS.WAITING;
            if (item.correlationId && item.correlationId.search('urn:here-ota:campaign:') >= 0) {
              const campaignId = item.correlationId.substring('urn:here-ota:campaign:'.length);
              const afterCampaign = _.after(
                data.length,
                () => {
                  axios
                    .get(`${API_UPDATES_SEARCH}/${item.campaign.update.id}`)
                    .then((res) => {
                      const update = res.data;
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
                .get(`${API_CAMPAIGNS_FETCH_SINGLE}/${campaignId}`)
                .then((res) => {
                  const campaign = res.data;
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
      .catch((error) => {
        this.mtuFetchAsync = handleAsyncError(error);
      });
  }

  fetchEvents(id, async = EVENTS_FETCH_ASYNC) {
    resetAsync(this[async], true);
    return axios
      .get(`${API_DEVICES_SEARCH}/${id}/events`)
      .then((response) => {
        this.deviceEvents = response.data;
        this[async] = handleAsyncSuccess(response);
      })
      .catch((error) => {
        this[async] = handleAsyncError(error);
      });
  }

  fetchApprovalPendingCampaigns(id, async = APPROVAL_PENDING_CAMP_FETCH_ASYNC) {
    resetAsync(this[async], true);
    return axios
      .get(`${API_DEVICE_APPROVAL_PENDING_CAMPAIGNS}/${id}/campaigns`)
      .then((response) => {
        const { data } = response;
        const after = _.after(
          data.campaigns.length,
          () => {
            this.deviceApprovalPendingCampaigns = response.data;
            this[async] = handleAsyncSuccess(response);
          },
          this,
        );
        if (data.campaigns.length) {
          _.each(data.campaigns, (item) => {
            let status = null;
            const afterCampaign = _.after(
              status === STATUS.SUCCESS,
              () => {
                axios
                  .get(`${API_UPDATES_SEARCH}/${item.update.id}`)
                  .then((res) => {
                    const update = res.data;
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
              .get(`${API_CAMPAIGNS_FETCH_SINGLE}/${item.id}`)
              .then((res) => {
                const campaign = res.data;
                item.update = {
                  id: campaign.update,
                };
                status = STATUS.SUCCESS;
                afterCampaign();
              })
              .catch(() => {
                status = STATUS.ERROR;
                afterCampaign();
              });
          });
        } else {
          after();
        }
      })
      .catch((error) => {
        this[async] = handleAsyncError(error);
      });
  }

  findMtu(id) {
    return this.multiTargetUpdates.find(update => update.device === id);
  }

  updateStatus(id, status) {
    if (this.multiTargetUpdates.length) {
      const update = this.findMtu(id);
      update.status = status;
    }
  }

  cancelMtuUpdate(deviceId) {
    resetAsync(this.mtuCancelAsync, true);
    return axios
      .delete(`${API_CANCEL_MULTI_TARGET_UPDATE}/${deviceId}`)
      .then(
        (response) => {
          this.fetchMultiTargetUpdates(this.device.uuid);
          this.mtuCancelAsync = handleAsyncSuccess(response);
        },
      )
      .catch(
        (error) => {
          this.mtuCancelAsync = handleAsyncError(error);
        },
      );
  }

  cancelApprovalPendingCampaingPerDevice(campaignId, deviceId) {
    resetAsync(this.mtuCancelAsync, true);
    return axios
      .delete(`${API_CANCEL_UPDATE_PENDING_APPROVAL}/${campaignId}/devices/${deviceId}`)
      .then(
        (response) => {
          this.fetchApprovalPendingCampaigns(this.device.uuid);
          this.mtuCancelAsync = handleAsyncSuccess(response);
        },
      )
      .catch(
        (error) => {
          this.mtuCancelAsync = handleAsyncError(error);
        },
      );
  }

  fetchDevicesCount() {
    resetAsync(this.devicesCountFetchAsync, true);
    const that = this;
    return axios
      .all([axios.get(API_DEVICES_SEARCH), axios.get(API_DIRECTOR_DEVICES_SEARCH)])
      .then(
        axios.spread((all, director) => {
          that.directorDevicesCount = director.data.total;
          that.directorDevicesIds = director.data.values;
          that.devicesCountFetchAsync = handleAsyncSuccess(all);
        }),
      )
      .catch((error) => {
        that.devicesCountFetchAsync = handleAsyncError(error);
      });
  }

  fetchCurrentStatus(id) {
    resetAsync(this.deviceCurrentStatusFetchAsync, true);
    return axios
      .get(`${API_DEVICES_DEVICE_DETAILS}/${id}`)
      .then((response) => {
        this.device.deviceStatus = response.data.deviceStatus;
        this.deviceCurrentStatusFetchAsync = handleAsyncSuccess(response);
      })
      .catch((error) => {
        this.deviceCurrentStatusFetchAsync = handleAsyncError(error);
      });
  }

  fetchDirectorAttributes(id) {
    const device = this.getDevice(id);
    if (!_.isEmpty(this.device) && this.device.uuid === id) {
      resetAsync(this.devicesDirectorAttributesFetchAsync, true);
      return axios
        .get(`${API_DEVICES_DIRECTOR_DEVICE}/${id}`)
        .then((response) => {
          const primary = _.filter(response.data, data => data.primary);
          const secondary = _.filter(response.data, data => !data.primary);
          extendObservable(this.device, {
            directorAttributes: {
              primary: _.first(primary),
              secondary,
            },
          });
          this.devicesDirectorAttributesFetchAsync = handleAsyncSuccess(response);
        })
        .catch((error) => {
          this.devicesDirectorAttributesFetchAsync = handleAsyncError(error);
        });
    } if (device) {
      resetAsync(this.devicesDirectorAttributesFetchAsync, true);
      return axios
        .get(`${API_DEVICES_DIRECTOR_DEVICE}/${id}`)
        .then((response) => {
          const primary = _.filter(response.data, data => data.primary);
          const secondary = _.filter(response.data, data => !data.primary);
          extendObservable(device, {
            directorAttributes: {
              primary: _.first(primary),
              secondary,
            },
          });
          this.devicesDirectorAttributesFetchAsync = handleAsyncSuccess(response);
        })
        .catch((error) => {
          this.devicesDirectorAttributesFetchAsync = handleAsyncError(error);
        });
    }
    return true;
  }

  fetchPrimaryAndSecondaryFilepaths(id) {
    resetAsync(this.devicesDirectorHashesFetchAsync, true);
    return axios
      .get(`${API_DEVICES_DIRECTOR_DEVICE}/${id}`)
      .then((response) => {
        const filepaths = _.map(response.data, item => item.image.filepath);
        this.devicesDirectorHashesFetchAsync = handleAsyncSuccess(response);
        return filepaths;
      })
      .catch((error) => {
        this.devicesDirectorHashesFetchAsync = handleAsyncError(error);
      });
  }

  getPrimaryFilepath() {
    return this.device.directorAttributes.primary.image.filepath;
  }

  getPrimarySerial() {
    return this.device.directorAttributes.primary.id;
  }

  getPrimaryHardwareId() {
    return this.device.directorAttributes.primary.hardwareId;
  }

  getSecondaryFilepathsBySerial(serial) {
    const filepaths = [];
    _.map(this.device.directorAttributes.secondary, (secondary) => {
      if (secondary.id === serial) {
        filepaths.push(secondary.image.filepath);
      }
    });
    return filepaths;
  }

  getPrimaryByHardwareId(hardwareId) {
    if (this.device.directorAttributes.primary.hardwareId === hardwareId) {
      return this.device.directorAttributes.primary;
    }
    return null;
  }

  getSecondaryBySerial(serial) {
    let secondaryObject = {};
    _.each(this.device.directorAttributes.secondary, (secondary) => {
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
      .then((response) => {
        this.devicesCreateAsync = handleAsyncSuccess(response);
      })
      .catch((error) => {
        this.devicesCreateAsync = handleAsyncError(error);
      });
  }

  renameDevice(id, data) {
    resetAsync(this.devicesRenameAsync, true);
    return axios
      .put(`${API_DEVICES_RENAME}/${id}`, data)
      .then((response) => {
        this.devicesRenameAsync = handleAsyncSuccess(response);
        if (this.device.uuid === id) {
          this.device.deviceName = data.deviceName;
        } else {
          const device = _.find(this.devices, singleDevice => singleDevice.uuid === id);
          device.deviceName = data.deviceName;
        }
        this.fetchDevicesCount();
      })
      .catch((error) => {
        this.devicesRenameAsync = handleAsyncError(error);
      });
  }

  uploadCustomFields(formData, onFinished) {
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    };
    axios
      .post(API_DEVICES_CUSTOM_FIELDS, formData, config)
      .then((response) => {
        onFinished(UPLOADING_STATUS.SUCCESS);
        this.uploadCustomFieldsAsync = handleAsyncSuccess(response);
        this.getCustomDeviceFields();
      })
      .catch((error) => {
        if (error.response.status === HTTP_CODE_400_BAD_REQUEST) {
          onFinished(UPLOADING_STATUS.MALFORMED);
        } else {
          onFinished(UPLOADING_STATUS.ERROR);
        }
        this.uploadCustomFieldsAsync = handleAsyncError(error);
      });
  }

  reset() {
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
    this.devicesOffset = 0;
    this.devicesFilter = '';
    this.devicesSort = SORT_DIR_ASC;
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

  getDevice(id) {
    return _.find(this.devices, { uuid: id });
  }

  updateDeviceData(id, data) {
    const device = this.getDevice(id);
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

  prepareDevices(devicesSort = this.devicesSort) {
    this.devicesSort = devicesSort;
    this.devices = this.devices.slice().sort((a, b) => {
      const aName = a.deviceName;
      const bName = b.deviceName;
      if (devicesSort !== 'undefined' && devicesSort === SORT_DIR_DESC) return bName.localeCompare(aName);
      return aName.localeCompare(bName);
    });
  }

  resetPageNumber() {
    this.devicesPageNumber = DEVICES_PAGE_NUMBER_DEFAULT;
  }
}
