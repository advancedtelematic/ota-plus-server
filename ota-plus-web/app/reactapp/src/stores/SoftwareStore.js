/* eslint-disable no-param-reassign */
/** @format */

import { observable, computed } from 'mobx';
import axios from 'axios';
import _ from 'lodash';
import {
  API_SOFTWARE,
  API_UPLOAD_SOFTWARE,
  API_PACKAGES_BLOCKLIST_FETCH,
  API_PACKAGES_COUNT_DEVICE_AND_GROUP,
  API_PACKAGES_PACKAGE_BLOCKLISTED_FETCH,
  API_PACKAGES_BLOCKLIST,
  API_PACKAGES_UPDATE_BLOCKLISTED,
  API_PACKAGES_REMOVE_FROM_BLOCKLIST,
  API_SOFTWARE_DEVICE_SOFTWARE,
  API_SOFTWARE_DEVICE_HISTORY,
  API_SOFTWARE_DIRECTOR_DEVICE_AUTO_INSTALL,
  API_SOFTWARE_COUNT_INSTALLED_ECUS,
  API_SOFTWARE_COMMENTS,
  API_SOFTWARE_KEYS_STATUS,
  API_DELETE_SOFTWARE,
  API_UPDATES_SEARCH,
  API_CAMPAIGNS_FETCH_SINGLE,
  CAMPAIGN_CORRELATION_ID,
  DEVICE_HISTORY_LIMIT,
  LOCAL_STORAGE_DELETED_PACKAGES_KEY,
  LOCAL_STORAGE_DELETED_VERSIONS_KEY,
  ONDEVICE_SOFTWARE_LIMIT,
  OSTREE_FORMAT,
  PACKAGES_DEFAULT_TAB,
  SOFTWARE_DELETE_ALL_DONE,
  SOFTWARE_FETCH_ASYNC,
  SOFTWARE_HISTORY_LIMIT,
  SOFTWARES_LIMIT_LATEST,
} from '../config';
import {
  PAGE_DEVICE,
  PAGE_PACKAGES,
  SORT_DIR_ASC,
  SORT_DIR_DESC,
  UPLOADING_STATUS,
} from '../constants';
import { resetAsync, handleAsyncSuccess, handleAsyncError } from '../utils/Common';
import { SOFTWARE_VERSION_UPLOAD_CANCEL_MESSAGE } from '../constants/softwareConstants';

export default class SoftwareStore {
  @observable getKeysStatusAsync = {};

  @observable packagesDeleteAsync = {};

  @observable packagesFetchAsync = {};

  @observable packagesSafeFetchAsync = {};

  @observable packagesCreateAsync = {};

  @observable packagesBlocklistFetchAsync = {};

  @observable packagesOneBlocklistedFetchAsync = {};

  @observable packagesBlocklistAsync = {};

  @observable packagesUpdateBlocklistedAsync = {};

  @observable packagesRemoveFromBlocklistAsync = {};

  @observable packagesOndeviceFetchAsync = {};

  @observable packagesAutoInstalledFetchAsync = {};

  @observable packagesHistoryFetchAsync = {};

  @observable packagesEnableAutoInstallAsync = {};

  @observable packagesDisableAutoInstallAsync = {};

  @observable commentsFetchAsync = {};

  @observable commentUpdateAsync = {};

  @observable keysStatus = {
    'keys-online': false
  };

  @observable page = null;

  @observable packages = [];

  @observable versionsTotal = 0;

  @observable preparedPackages = [];

  @observable packagesSort = SORT_DIR_ASC;

  @observable preparedOndevicePackages = {};

  @observable packagesOndeviceSort = SORT_DIR_ASC;

  @observable packagesUploading = [];

  @observable blocklist = [];

  @observable preparedBlocklist = [];

  @observable blocklistedPackage = {};

  @observable autoInstalledPackages = [];

  @observable ondevicePackages = [];

  @observable ondevicePackagesCurrentPage = 0;

  @observable ondevicePackagesTotalCount = null;

  @observable ondevicePackagesLimit = ONDEVICE_SOFTWARE_LIMIT;

  @observable ondeviceFilter = '';

  @observable packagesHistory = [];

  @observable packagesHistoryFilter = '';

  @observable packagesHistoryCurrentPage = 0;

  @observable packagesHistoryTotalCount = null;

  @observable packagesHistoryLimit = SOFTWARE_HISTORY_LIMIT;

  @observable expandedPackage = null;

  @observable compatibilityData = [];

  @observable activeTab = PACKAGES_DEFAULT_TAB;

  constructor() {
    resetAsync(this.getKeysStatusAsync);
    resetAsync(this.packagesDeleteAsync);
    resetAsync(this.packagesFetchAsync);
    resetAsync(this.packagesSafeFetchAsync);
    resetAsync(this.packagesCreateAsync);
    resetAsync(this.packagesBlocklistFetchAsync);
    resetAsync(this.packagesOneBlocklistedFetchAsync);
    resetAsync(this.packagesBlocklistAsync);
    resetAsync(this.packagesUpdateBlocklistedAsync);
    resetAsync(this.packagesRemoveFromBlocklistAsync);
    resetAsync(this.packagesOndeviceFetchAsync);
    resetAsync(this.packagesAutoInstalledFetchAsync);
    resetAsync(this.packagesHistoryFetchAsync);
    resetAsync(this.packagesEnableAutoInstallAsync);
    resetAsync(this.packagesDisableAutoInstallAsync);
    resetAsync(this.commentsFetchAsync);
    resetAsync(this.commentUpdateAsync);
  }

  deletePackage(filepath) {
    resetAsync(this.packagesDeleteAsync, true);
    return axios
      .delete(`${API_DELETE_SOFTWARE}/${filepath}`)
      .then((response) => {
        this.packagesDeleteAsync = handleAsyncSuccess(response);
        this.removePackage(filepath);
      })
      .catch((error) => {
        this.packagesDeleteAsync = handleAsyncError(error);
      });
  }

  deleteAllVersions(versions) {
    let index = 0;
    const store = this;
    function request() {
      store.deletePackage(versions[index].filepath).then(() => {
        index += 1;
        if (index >= versions.length) {
          return SOFTWARE_DELETE_ALL_DONE;
        }
        return request();
      });
    }
    return request();
  }

  removePackage(filepath) {
    this.packages = _.filter(this.packages, pack => pack.filepath !== filepath);
    this.preparePackages();
  }

  fetchComments() {
    resetAsync(this.commentsFetchAsync, true);
    return axios
      .get(API_SOFTWARE_COMMENTS)
      .then((response) => {
        this.prepareComments(response.data);
      })
      .catch((error) => {
        this.commentsFetchAsync = handleAsyncError(error);
      });
  }

  updateComment(filepath, data) {
    return axios
      .put(`${API_SOFTWARE_COMMENTS}/${filepath}`, { comment: data })
      .then(() => {
        this.updatePackageComment(filepath, data);
      })
      .catch((error) => {
        this.commentUpdateAsync = handleAsyncError(error);
      });
  }

  fetchPackages(async = SOFTWARE_FETCH_ASYNC) {
    const that = this;
    resetAsync(that[async], true);
    return axios
      .get(API_SOFTWARE)
      .then((response) => {
        const packages = response.data.signed.targets;
        this.versionsTotal = Object.keys(packages).length;
        that.formatPackages(packages);
        that.fetchComments();
        const filepaths = that.getFilepaths();
        axios
          .post(API_SOFTWARE_COUNT_INSTALLED_ECUS, filepaths)
          .then((resp) => {
            that.prepareFilePaths(resp.data);
            switch (that.page) {
              case PAGE_DEVICE:
                that.prepareDevicePackages();
                break;
              default:
                that.preparePackages();
                break;
            }
            that[async] = handleAsyncSuccess(response);
          })
          .catch(() => {
            switch (that.page) {
              case PAGE_DEVICE:
                that.prepareDevicePackages();
                break;
              default:
                that.preparePackages();
                break;
            }
            that[async] = handleAsyncSuccess(response);
          });
      })
      .catch((error) => {
        that[async] = handleAsyncError(error);
      });
  }

  fetchPackagesWithLimit(limit) {
    this.fetchPackages(SOFTWARE_FETCH_ASYNC, limit);
  }

  getFilepaths() {
    return {
      filepaths: this.packages.map(pack => pack.filepath),
    };
  }

  prepareFilePaths(filepaths) {
    _.each(this.packages, (pack) => {
      _.each(filepaths, (installedOn, filepath) => {
        if (pack.filepath === filepath) {
          pack.installedOnEcus = installedOn;
        }
      });
    });
  }

  prepareComments(comments) {
    _.each(this.packages, (pack) => {
      _.each(comments, (obj) => {
        if (obj.filename === pack.filepath) {
          pack.comment = obj.comment;
        }
      });
    });
  }

  formatPackages(packages) {
    const packs = [];
    _.each(packages, (pack, filepath) => {
      const formattedPack = {
        customExists: !!pack.custom,
        packageHash: pack.hashes.sha256,
        filepath,
        createdAt: pack.custom ? pack.custom.createdAt : null,
        updatedAt: pack.custom ? pack.custom.updatedAt : null,
        description: pack.hashes.sha256,
        targetFormat: pack.custom ? pack.custom.targetFormat : OSTREE_FORMAT,
        targetLength: pack.length,
        id: {
          name: pack.custom ? pack.custom.name : filepath,
          version: pack.custom ? pack.custom.version : pack.hashes.sha256,
        },
        installedOnEcus: 0,
        isBlockListed: false,
        namespace: null,
        signature: null,
        size: 0,
        uri: {
          uri: null,
        },
        uuid: pack.hashes.sha256,
        hardwareIds: pack.custom ? pack.custom.hardwareIds : [],
        comment: 'No comment',
      };
      packs.push(formattedPack);
    });

    const deletedPackageNames = JSON.parse(localStorage.getItem(LOCAL_STORAGE_DELETED_PACKAGES_KEY));
    const deletedVersions = JSON.parse(localStorage.getItem(LOCAL_STORAGE_DELETED_VERSIONS_KEY));
    this.packages = _.filter(
      packs, pack => !_.includes(deletedPackageNames, pack.id.name) && !_.includes(deletedVersions, pack.id.version)
    );
  }

  updatePackageComment(filepath, comment) {
    const result = _.find(this.packages, pack => pack.filepath === filepath);
    result.comment = comment;
  }

  packageURI = (entryName, name, version, hardwareIds) => `${API_UPLOAD_SOFTWARE}/${entryName}?name=${encodeURIComponent(name)}&version=${encodeURIComponent(version)}&hardwareIds=${hardwareIds}`;

  createPackage(data, formData, hardwareIds, onUploadProgress, onFinished) {
    this.packagesUploading = [];
    const source = axios.CancelToken.source();
    this.packagesUploading.push({
      status: null,
      size: 0,
      uploaded: 0,
      progress: 0,
      upSpeed: 0,
      package: {
        name: data.packageName,
        version: data.version,
      },
    });
    // 0 - we can upload only one file in the same time
    const uploadObj = this.packagesUploading[0];
    const config = {
      onUploadProgress(progressEvent) {
        const currentTime = new Date().getTime();
        const lastUpTime = uploadObj.lastUpTime || currentTime;
        const upSpeed = ((progressEvent.loaded - uploadObj.uploaded) * 1000) / ((currentTime - lastUpTime) * 1024);
        uploadObj.progress = (progressEvent.loaded * 100) / progressEvent.total;
        uploadObj.size = progressEvent.total;
        uploadObj.uploaded = progressEvent.loaded;
        uploadObj.upSpeed = upSpeed;
        uploadObj.lastUpTime = currentTime;
        onUploadProgress(progressEvent.loaded, progressEvent.total);
      },
      cancelToken: source.token,
    };
    const entryName = `${data.packageName}_${data.version}`;
    axios
      .put(this.packageURI(entryName, data.packageName, data.version, hardwareIds), formData, config)
      .then((response) => {
        uploadObj.status = UPLOADING_STATUS.SUCCESS;
        onFinished(UPLOADING_STATUS.SUCCESS);
        this.packagesCreateAsync = handleAsyncSuccess(response);
      })
      .catch((error) => {
        uploadObj.status = UPLOADING_STATUS.ERROR;
        if (error.message !== SOFTWARE_VERSION_UPLOAD_CANCEL_MESSAGE) {
          onFinished(UPLOADING_STATUS.ERROR);
        }
        this.packagesCreateAsync = handleAsyncError(error);
      });
    uploadObj.source = source;
  }

  fetchBlocklist(ifWithStats = false, ifPrepareBlocklist = false) {
    resetAsync(this.packagesBlocklistFetchAsync, true);
    return axios
      .get(API_PACKAGES_BLOCKLIST_FETCH)
      .then((response) => {
        if (ifWithStats) {
          const blocklist = response.data;
          if (blocklist.length) {
            const after = _.after(
              blocklist.length,
              () => {
                this.blocklist = blocklist;
                if (ifPrepareBlocklist) {
                  this.prepareBlocklist();
                }
                switch (this.page) {
                  case PAGE_DEVICE:
                    this.prepareDevicePackages();
                    break;
                  case PAGE_PACKAGES:
                    this.preparePackages(this.packagesSort, true);
                    break;
                  default:
                    break;
                }
                this.packagesBlocklistFetchAsync = handleAsyncSuccess(response);
              },
              this,
            );
            _.each(blocklist, (pack) => {
              axios
                .get(`${API_PACKAGES_COUNT_DEVICE_AND_GROUP}/${pack.packageId.name}/${pack.packageId.version}`)
                .then((count) => {
                  pack.statistics = count.data;
                  after();
                })
                .catch(() => {
                  pack.statistics = {};
                  after();
                });
            });
          } else {
            this.blocklist = blocklist;
            if (ifPrepareBlocklist) {
              this.preparePackages(this.packagesSort, true);
            }
            this.packagesBlocklistFetchAsync = handleAsyncSuccess(response);
          }
        } else {
          this.blocklist = response.data;
          switch (this.page) {
            case PAGE_DEVICE:
              this.prepareDevicePackages();
              this.prepareOndevicePackages();
              break;
            case PAGE_PACKAGES:
              this.preparePackages();
              break;
            default:
              break;
          }
          this.packagesBlocklistFetchAsync = handleAsyncSuccess(response);
        }
      })
      .catch((error) => {
        this.packagesBlocklistFetchAsync = handleAsyncError(error);
      });
  }

  fetchBlocklistedPackage(data) {
    this.blocklistedPackage = {};
    resetAsync(this.packagesOneBlocklistedFetchAsync, true);
    return axios
      .get(`${API_PACKAGES_PACKAGE_BLOCKLISTED_FETCH}/${data.name}/${data.version}`, data.details)
      .then((response) => {
        this.blocklistedPackage = response.data;
        this.packagesOneBlocklistedFetchAsync = handleAsyncSuccess(response);
      })
      .catch((error) => {
        this.packagesOneBlocklistedFetchAsync = handleAsyncError(error);
      });
  }

  blocklistPackage(data) {
    resetAsync(this.packagesBlocklistAsync, true);
    return axios
      .post(API_PACKAGES_BLOCKLIST, data)
      .then((response) => {
        this.fetchBlocklist();
        this.packagesBlocklistAsync = handleAsyncSuccess(response);
      })
      .catch((error) => {
        this.packagesBlocklistAsync = handleAsyncError(error);
      });
  }

  updateBlocklistedPackage(data) {
    resetAsync(this.packagesUpdateBlocklistedAsync, true);
    return axios
      .put(API_PACKAGES_UPDATE_BLOCKLISTED, data)
      .then((response) => {
        this.fetchBlocklist();
        this.packagesUpdateBlocklistedAsync = handleAsyncSuccess(response);
      })
      .catch((error) => {
        this.packagesUpdateBlocklistedAsync = handleAsyncError(error);
      });
  }

  removePackageFromBlocklist(data) {
    resetAsync(this.packagesRemoveFromBlocklistAsync, true);
    return axios
      .delete(`${API_PACKAGES_REMOVE_FROM_BLOCKLIST}/${data.name}/${data.version}`)
      .then((response) => {
        this.fetchBlocklist();
        this.packagesRemoveFromBlocklistAsync = handleAsyncSuccess(response);
      })
      .catch((error) => {
        this.packagesRemoveFromBlocklistAsync = handleAsyncError(error);
      });
  }

  fetchOndevicePackages(id, filter = '') {
    resetAsync(this.packagesOndeviceFetchAsync, true);
    if (this.ondeviceFilter !== filter) {
      this.ondevicePackagesTotalCount = null;
      this.ondevicePackagesCurrentPage = 0;
      this.ondevicePackages = [];
      this.preparedOndevicePackages = [];
    }
    this.ondeviceFilter = filter;
    return axios
      .get(`${API_SOFTWARE_DEVICE_SOFTWARE}/${id}/packages?nameContains=${filter || ''}&limit=${this.ondevicePackagesLimit}&offset=${this.ondevicePackagesCurrentPage * this.ondevicePackagesLimit}`)
      .then((response) => {
        this.ondevicePackages = _.uniqBy(
          this.ondevicePackages.concat(response.data.values), pack => pack.packageId.name
        );
        switch (this.page) {
          case PAGE_DEVICE:
            this.prepareOndevicePackages();
            this.ondevicePackagesCurrentPage += 1;
            this.ondevicePackagesTotalCount = response.data.total;
            break;
          default:
            break;
        }
        this.packagesOndeviceFetchAsync = handleAsyncSuccess(response);
      })
      .catch((error) => {
        this.packagesOndeviceFetchAsync = handleAsyncError(error);
      });
  }

  fetchAutoInstalledPackages(deviceId, ecuSerial) {
    resetAsync(this.packagesAutoInstalledFetchAsync, true);
    return axios
      .get(`${API_SOFTWARE_DIRECTOR_DEVICE_AUTO_INSTALL}/${deviceId}/ecus/${ecuSerial}/auto_update`)
      .then((response) => {
        this.autoInstalledPackages = response.data;
        switch (this.page) {
          case PAGE_DEVICE:
            this.prepareDevicePackages();
            break;
          default:
            break;
        }
        this.packagesAutoInstalledFetchAsync = handleAsyncSuccess(response);
      })
      .catch((error) => {
        this.packagesAutoInstalledFetchAsync = handleAsyncError(error);
      });
  }

  fetchPackagesHistory(id, filter = '', fetchFirstItems = false, dataLimit = DEVICE_HISTORY_LIMIT, dataOffset = 0) {
    resetAsync(this.packagesHistoryFetchAsync, true);
    if (this.packagesHistoryFilter !== filter || fetchFirstItems) {
      this.packagesHistoryTotalCount = null;
      this.packagesHistoryCurrentPage = 0;
    }
    this.packagesHistoryFilter = filter;
    const limit = `limit=${dataLimit}`;
    const offset = `offset=${dataOffset}`;
    return axios
      .get(`${API_SOFTWARE_DEVICE_HISTORY}/${id}/installation_history?${limit}&${offset}`)
      .then((response) => {
        const data = response.data.values;
        const after = _.after(
          data.length,
          () => {
            this.packagesHistoryCurrentPage += 1;
            this.packagesHistoryTotalCount = response.data.total;
            this.packagesHistory = _.uniqBy(data, item => item.correlationId || item);
            this.preparePackagesHistory();
          },
          this,
        );
        _.each(data, (item) => {
          if (item.correlationId && item.correlationId.search(CAMPAIGN_CORRELATION_ID) >= 0) {
            const campaignId = item.correlationId.substring(CAMPAIGN_CORRELATION_ID.length);
            const afterCampaign = _.after(
              data.values.length,
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
        this.packagesHistoryFetchAsync = handleAsyncSuccess(response);
      })
      .catch((error) => {
        this.packagesHistoryFetchAsync = handleAsyncError(error);
      });
  }

  getKeysStatus = async () => {
    resetAsync(this.getKeysStatusAsync, true);
    try {
      const response = await axios.get(API_SOFTWARE_KEYS_STATUS);
      this.keysStatus = response.data;

      this.getKeysStatusAsync = handleAsyncSuccess(response);
    } catch (error) {
      this.getKeysStatusAsync = handleAsyncError(error);
    }
  }

  preparePackagesHistory() {
    this.packagesHistory = _.sortBy(this.packagesHistory, pack => pack.eventTime).reverse();
  }

  enablePackageAutoInstall(targetName, deviceId, ecuSerial) {
    resetAsync(this.packagesEnableAutoInstallAsync, true);
    return axios
      .put(`${API_SOFTWARE_DIRECTOR_DEVICE_AUTO_INSTALL}/${deviceId}/ecus/${ecuSerial}/auto_update/${targetName}`)
      .then((response) => {
        this.fetchAutoInstalledPackages(deviceId, ecuSerial);
        this.packagesEnableAutoInstallAsync = handleAsyncSuccess(response);
      })
      .catch((error) => {
        this.packagesEnableAutoInstallAsync = handleAsyncError(error);
      });
  }

  disablePackageAutoInstall(packageName, deviceId, ecuSerial) {
    resetAsync(this.packagesDisableAutoInstallAsync, true);
    return axios
      .delete(`${API_SOFTWARE_DIRECTOR_DEVICE_AUTO_INSTALL}/${deviceId}/ecus/${ecuSerial}/auto_update/${packageName}`)
      .then((response) => {
        this.fetchAutoInstalledPackages(deviceId, ecuSerial);
        this.packagesDisableAutoInstallAsync = handleAsyncSuccess(response);
      })
      .catch((error) => {
        this.packagesDisableAutoInstallAsync = handleAsyncError(error);
      });
  }

  _getPackage(data) {
    return _.find(this.packages, pack => pack.id.name === data.name && pack.id.version === data.version);
  }

  getInstalledPackage(filepath, hardwareId) {
    const filteredPacks = _.filter(this.packages, pack => (_.includes(pack.hardwareIds, hardwareId) ? pack : null));
    const result = _.find(filteredPacks, pack => pack.filepath === filepath);
    if (result) {
      result.isInstalled = true;
      return result;
    }
    return this.getReportedPackage(filepath, hardwareId);
  }

  getReportedPackage(filepath) {
    const result = _.find(this.packages, pack => pack.filepath === filepath);
    if (result) {
      result.isInstalled = true;
      return result;
    }
    return null;
  }

  preparePackages(packagesSort = this.packagesSort) {
    const { packages } = this;
    const groupedPackages = {};
    let sortedPackages = {};
    this.packagesSort = packagesSort;
    _.each(
      packages,
      (obj) => {
        if (_.isUndefined(groupedPackages[obj.id.name])) {
          groupedPackages[obj.id.name] = {};
          groupedPackages[obj.id.name].versions = [];
          groupedPackages[obj.id.name].packageName = obj.id.name;
          groupedPackages[obj.id.name].name = obj.id.name;
        }
        groupedPackages[obj.id.name].versions.push(obj);
      },
      this,
    );
    _.each(groupedPackages, (obj, index) => {
      groupedPackages[index].versions = _.sortBy(obj.versions, pack => pack.createdAt).reverse();
    });
    const specialGroup = {
      '#': [],
    };
    Object.keys(groupedPackages)
      .sort((a, b) => {
        if (packagesSort !== 'undefined' && packagesSort === SORT_DIR_DESC) {
          return b.localeCompare(a);
        }
        return a.localeCompare(b);
      })
      .forEach((key) => {
        let firstLetter = key.charAt(0).toUpperCase();
        firstLetter = firstLetter.match(/[A-Z]/) ? firstLetter : '#';
        if ((firstLetter !== '#' && _.isUndefined(sortedPackages[firstLetter]))
          || !(sortedPackages[firstLetter] instanceof Array)) {
          sortedPackages[firstLetter] = [];
        }
        if (firstLetter !== '#') {
          sortedPackages[firstLetter].push(groupedPackages[key]);
        } else {
          specialGroup['#'].push(groupedPackages[key]);
        }
      });
    if (!_.isEmpty(specialGroup['#'])) {
      sortedPackages = packagesSort !== 'undefined' && packagesSort === SORT_DIR_DESC
        ? Object.assign(specialGroup, sortedPackages)
        : Object.assign(sortedPackages, specialGroup);
    }
    this.preparedPackages = sortedPackages;
  }

  prepareDevicePackages(packagesSort = this.packagesSort) {
    this.packagesSort = packagesSort;
    const packages = JSON.parse(JSON.stringify(this.packages));

    if (packages.length) {
      const { autoInstalledPackages } = this;
      const { blocklist } = this;
      const groupedPackages = {};
      let sortedPackages = {};
      const parsedBlocklist = [];

      _.each(blocklist, (pack) => {
        parsedBlocklist[`${pack.packageId.name}-${pack.packageId.version}`] = {
          isBlockListed: true,
          comment: pack.comment,
        };
      });

      _.each(packages, (packInstalled) => {
        if (!_.isUndefined(parsedBlocklist[`${packInstalled.id.name}-${packInstalled.id.version}`])) {
          packInstalled.isBlockListed = true;
        }
        if (autoInstalledPackages.indexOf(packInstalled.id.name) > -1) packInstalled.isAutoInstallEnabled = true;
      });

      _.each(packages, (pack) => {
        if (_.isUndefined(groupedPackages[pack.id.name]) || !(groupedPackages[pack.id.name] instanceof Object)) {
          groupedPackages[pack.id.name] = {
            versions: [],
            packageName: pack.id.name,
            hardwareIds: pack.hardwareIds,
            isBlockListed: pack.isBlockListed,
            isAutoInstallEnabled: pack.isAutoInstallEnabled,
          };
        }
        groupedPackages[pack.id.name].versions.push(pack);
      });
      _.each(groupedPackages, (pack, index) => {
        groupedPackages[index].versions = _.sortBy(pack.versions, element => element.createdAt).reverse();
      });
      const specialGroup = { '#': [] };
      Object.keys(groupedPackages)
        .sort((a, b) => {
          if (packagesSort !== 'undefined' && packagesSort === SORT_DIR_DESC) return b.localeCompare(a);
          return a.localeCompare(b);
        })
        .forEach((key) => {
          let firstLetter = key.charAt(0).toUpperCase();
          firstLetter = firstLetter.match(/[A-Z]/) ? firstLetter : '#';
          if ((firstLetter !== '#' && _.isUndefined(sortedPackages[firstLetter]))
            || !(sortedPackages[firstLetter] instanceof Array)) {
            sortedPackages[firstLetter] = [];
          }
          if (firstLetter !== '#') sortedPackages[firstLetter].push(groupedPackages[key]);
          else specialGroup['#'].push(groupedPackages[key]);
        });
      if (!_.isEmpty(specialGroup['#'])) {
        sortedPackages = packagesSort !== 'undefined' && packagesSort === SORT_DIR_DESC
          ? Object.assign(specialGroup, sortedPackages)
          : Object.assign(sortedPackages, specialGroup);
      }
      this.preparedPackages = sortedPackages;
    } else {
      this.preparedPackages = [];
    }
  }

  prepareOndevicePackages(packagesSort = this.packagesOndeviceSort) {
    this.packagesOndeviceSort = packagesSort;
    if (this.ondevicePackages.length) {
      const packages = [];
      const groupedPackages = {};
      let sortedPackages = {};
      const parsedBlocklist = [];

      _.each(this.blocklist, (pack) => {
        parsedBlocklist[`${pack.packageId.name}-${pack.packageId.version}`] = true;
      });

      _.each(this.ondevicePackages, (pack) => {
        if (pack.packageId !== 'undefined') {
          const newPack = {
            name: pack.packageId.name,
            version: pack.packageId.version,
            isBlockListed: pack.isBlockListed || !_.isUndefined(parsedBlocklist[`${pack.packageId.name}-${pack.packageId.version}`]),
          };
          packages.push(newPack);
        } else {
          const newPack = {
            name: pack.name,
            version: pack.version,
            isBlockListed: pack.isBlockListed || !_.isUndefined(parsedBlocklist[`${pack.name}-${pack.version}`]),
          };
          packages.push(newPack);
        }
      });

      _.each(
        packages,
        (obj) => {
          const objKey = `${obj.name}_${obj.version}`;
          groupedPackages[objKey] = obj;
        },
        this,
      );

      const specialGroup = { '#': [] };
      Object.keys(groupedPackages)
        .sort((a, b) => {
          if (packagesSort !== 'undefined' && packagesSort === SORT_DIR_DESC) return b.localeCompare(a);
          return a.localeCompare(b);
        })
        .forEach((key) => {
          let firstLetter = key.charAt(0).toUpperCase();
          firstLetter = firstLetter.match(/[A-Z]/) ? firstLetter : '#';
          if ((firstLetter !== '#' && _.isUndefined(sortedPackages[firstLetter]))
            || !(Array.isArray(sortedPackages[firstLetter]))) {
            sortedPackages[firstLetter] = [];
          }
          if (firstLetter !== '#') sortedPackages[firstLetter].push(groupedPackages[key]);
          else specialGroup['#'].push(groupedPackages[key]);
        });
      if (!_.isEmpty(specialGroup['#'])) {
        sortedPackages = packagesSort !== 'undefined' && packagesSort === SORT_DIR_DESC
          ? Object.assign(specialGroup, sortedPackages)
          : Object.assign(sortedPackages, specialGroup);
      }

      this.preparedOndevicePackages = sortedPackages;
    } else {
      this.preparedOndevicePackages = [];
    }
  }

  prepareBlocklist() {
    let groupedPackages = {};
    let sortedPackages = {};
    _.each(this.blocklist, (obj, index) => {
      if (_.isUndefined(groupedPackages[obj.packageId.name])) {
        groupedPackages[obj.packageId.name] = {};
        groupedPackages[obj.packageId.name] = {
          versions: [],
          packageName: obj.packageId.name,
          deviceCount: 0,
          groupIds: [],
        };
      }
      groupedPackages[obj.packageId.name].deviceCount += !_.isUndefined(obj.statistics.deviceCount)
        ? obj.statistics.deviceCount
        : 0;
      if (!_.isUndefined(obj.statistics.groupIds)) {
        groupedPackages[obj.packageId.name].groupIds = _.union(
          groupedPackages[obj.packageId.name].groupIds, obj.statistics.groupIds
        );
      }
      groupedPackages[obj.packageId.name].versions.push(this.blocklist[index]);
    });
    _.each(groupedPackages, (obj, index) => {
      groupedPackages[index].versions = _.sortBy(obj.versions, version => version.statistics.deviceCount).reverse();
    });
    groupedPackages = _.sortBy(groupedPackages, version => version.deviceCount).reverse();

    groupedPackages.sort();

    const specialGroup = { '#': [] };
    _.each(groupedPackages, (pack) => {
      let firstLetter = pack.packageName.charAt(0).toUpperCase();

      firstLetter = firstLetter.match(/[A-Z]/) ? firstLetter : '#';
      if ((firstLetter !== '#' && _.isUndefined(sortedPackages[firstLetter]))
        || !(sortedPackages[firstLetter] instanceof Array)) {
        sortedPackages[firstLetter] = [];
      }
      if (firstLetter !== '#') sortedPackages[firstLetter].push(pack);
      else specialGroup['#'].push(pack);
    });
    if (!_.isEmpty(specialGroup['#'])) {
      sortedPackages = Object.assign(specialGroup, sortedPackages);
    }

    this.preparedBlocklist = sortedPackages;
    this.preparedBlocklistRaw = groupedPackages;
  }

  resetBlocklistActions() {
    resetAsync(this.packagesOneBlocklistedFetchAsync);
    resetAsync(this.packagesBlocklistAsync);
    resetAsync(this.packagesUpdateBlocklistedAsync);
    resetAsync(this.packagesRemoveFromBlocklistAsync);
    this.blocklistedPackage = {};
  }

  reset() {
    resetAsync(this.packagesDeleteAsync);
    resetAsync(this.packagesFetchAsync);
    resetAsync(this.packagesSafeFetchAsync);
    resetAsync(this.packagesCreateAsync);
    resetAsync(this.packagesBlocklistFetchAsync);
    resetAsync(this.packagesOneBlocklistedFetchAsync);
    resetAsync(this.packagesBlocklistAsync);
    resetAsync(this.packagesUpdateBlocklistedAsync);
    resetAsync(this.packagesRemoveFromBlocklistAsync);
    resetAsync(this.packagesAutoInstalledFetchAsync);
    resetAsync(this.packagesHistoryFetchAsync);
    resetAsync(this.packagesEnableAutoInstallAsync);
    resetAsync(this.packagesDisableAutoInstallAsync);
    resetAsync(this.commentUpdateAsync);
    this.page = null;
    this.packages = [];
    this.preparedPackages = [];
    this.packagesSort = SORT_DIR_ASC;
    this.preparedOndevicePackages = {};
    this.packagesOndeviceSort = SORT_DIR_ASC;
    this.packagesUploading = [];
    this.blocklist = [];
    this.preparedBlocklist = [];
    this.preparedBlocklistRaw = [];
    this.blocklistedPackage = {};
    this.autoInstalledPackages = [];
    this.packagesHistory = [];
    this.ondevicePackages = [];
    this.ondevicePackagesCurrentPage = 0;
    this.ondevicePackagesTotalCount = 0;
    this.ondeviceFilter = '';
    this.packagesHistoryCurrentPage = 0;
    this.packagesHistoryTotalCount = 0;
    this.packagesHistoryFilter = '';
    this.expandedPackage = null;
    this.compatibilityData = [];
  }

  _resetWizard() {
    resetAsync(this.packagesSafeFetchAsync);
    this.packages = [];
    this.preparedPackages = [];
  }

  /*
   * ToDo: refactoring of messy localStorage accesses
   */
  getAllStorage = () => {
    const values = [];
    const keys = Object.keys(localStorage);

    let i = keys.length - 1;
    while (i > 0) {
      try {
        // localStorage can hold different data from another application
        values.push(JSON.parse(localStorage.getItem(keys[i])));
      } catch (e) {
        // at least console output in case of error
        console.debug(e);
      }
      i -= 1;
    }
    return values;
  }

  handleCompatibles() {
    this.compatibilityData = this.getAllStorage();
  }

  addPackage(pack) {
    const name = pack.custom ? pack.custom.name : pack.filename;
    const version = pack.custom ? pack.custom.version : pack.checksum.hash;
    const hardwareIds = pack.custom ? pack.custom.hardwareIds : [];
    const formattedPack = {
      customExists: !!pack.custom,
      packageHash: pack.checksum.hash,
      filepath: pack.filename,
      createdAt: pack.custom ? pack.custom.createdAt : null,
      updatedAt: pack.custom ? pack.custom.updatedAt : null,
      targetFormat: pack.custom ? pack.custom.targetFormat : OSTREE_FORMAT,
      targetLength: pack.length,
      hardwareIds,
      description: pack.checksum.hash,
      id: {
        name,
        version,
      },
      installedOnEcus: 0,
      isBlockListed: false,
      namespace: pack.namespace,
      signature: null,
      timestamp: null,
      vendor: null,
      comment: 'Default comment',
    };
    const found = _.find(this.packages, singlePack => singlePack.id.name === name && singlePack.id.version === version);
    if (found) {
      found.hardwareIds = hardwareIds;
    } else {
      this.packages.push(formattedPack);
    }
    switch (this.page) {
      case PAGE_DEVICE:
        this.prepareDevicePackages();
        break;
      default:
        this.preparePackages();
        break;
    }
  }

  @computed
  get packagesCount() {
    return Object.keys(_.groupBy(this.packages, pack => pack.id.name)).length;
  }

  @computed
  get lastPackages() {
    return _.sortBy(this.packages, pack => pack.createdAt)
      .reverse()
      .slice(0, SOFTWARES_LIMIT_LATEST);
  }

  @computed
  get blocklistCount() {
    return this.blocklist.length;
  }
}
