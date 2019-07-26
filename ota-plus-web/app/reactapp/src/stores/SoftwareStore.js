/* eslint-disable no-param-reassign */
/** @format */

import { observable, computed } from 'mobx';
import axios from 'axios';
import _ from 'lodash';
import {
  API_SOFTWARE,
  API_UPLOAD_SOFTWARE,
  API_PACKAGES_BLACKLIST_FETCH,
  API_PACKAGES_COUNT_DEVICE_AND_GROUP,
  API_PACKAGES_PACKAGE_BLACKLISTED_FETCH,
  API_PACKAGES_BLACKLIST,
  API_PACKAGES_UPDATE_BLACKLISTED,
  API_PACKAGES_REMOVE_FROM_BLACKLIST,
  API_PACKAGES_AFFECTED_DEVICES_COUNT_FETCH,
  API_SOFTWARE_DEVICE_SOFTWARE,
  API_SOFTWARE_DEVICE_HISTORY,
  API_SOFTWARE_DIRECTOR_DEVICE_AUTO_INSTALL,
  API_SOFTWARE_COUNT_INSTALLED_ECUS,
  API_SOFTWARE_COMMENTS,
  API_DELETE_SOFTWARE,
  API_UPDATES_SEARCH,
  API_CAMPAIGNS_FETCH_SINGLE,
  PACKAGES_DEFAULT_TAB,
  SOFTWARES_LIMIT_LATEST,
} from '../config';
import { resetAsync, handleAsyncSuccess, handleAsyncError } from '../utils/Common';

export default class SoftwareStore {
  @observable packagesDeleteAsync = {};

  @observable packagesFetchAsync = {};

  @observable packagesSafeFetchAsync = {};

  @observable packagesCreateAsync = {};

  @observable packagesBlacklistFetchAsync = {};

  @observable packagesOneBlacklistedFetchAsync = {};

  @observable packagesBlacklistAsync = {};

  @observable packagesUpdateBlacklistedAsync = {};

  @observable packagesRemoveFromBlacklistAsync = {};

  @observable packagesAffectedDevicesCountFetchAsync = {};

  @observable packagesOndeviceFetchAsync = {};

  @observable packagesAutoInstalledFetchAsync = {};

  @observable packagesHistoryFetchAsync = {};

  @observable packagesEnableAutoInstallAsync = {};

  @observable packagesDisableAutoInstallAsync = {};

  @observable commentsFetchAsync = {};

  @observable commentUpdateAsync = {};

  @observable page = null;

  @observable packages = [];

  @observable preparedPackages = [];

  @observable packagesSort = 'asc';

  @observable preparedOndevicePackages = {};

  @observable packagesOndeviceSort = 'asc';

  @observable packagesUploading = [];

  @observable blacklist = [];

  @observable preparedBlacklist = [];

  @observable blacklistedPackage = {};

  @observable affectedDevicesCount = {};

  @observable autoInstalledPackages = [];

  @observable ondevicePackages = [];

  @observable ondevicePackagesCurrentPage = 0;

  @observable ondevicePackagesTotalCount = null;

  @observable ondevicePackagesLimit = 25;

  @observable ondeviceFilter = '';

  @observable packagesHistory = [];

  @observable packagesHistoryFilter = '';

  @observable packagesHistoryCurrentPage = 0;

  @observable packagesHistoryTotalCount = null;

  @observable packagesHistoryLimit = 10;

  @observable expandedPackage = null;

  @observable compatibilityData = [];

  @observable activeTab = PACKAGES_DEFAULT_TAB;

  constructor() {
    resetAsync(this.packagesDeleteAsync);
    resetAsync(this.packagesFetchAsync);
    resetAsync(this.packagesSafeFetchAsync);
    resetAsync(this.packagesCreateAsync);
    resetAsync(this.packagesBlacklistFetchAsync);
    resetAsync(this.packagesOneBlacklistedFetchAsync);
    resetAsync(this.packagesBlacklistAsync);
    resetAsync(this.packagesUpdateBlacklistedAsync);
    resetAsync(this.packagesRemoveFromBlacklistAsync);
    resetAsync(this.packagesAffectedDevicesCountFetchAsync);
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
          return 'done';
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

  fetchPackages(async = 'packagesFetchAsync') {
    const that = this;
    resetAsync(that[async], true);
    return axios
      .get(API_SOFTWARE)
      .then((response) => {
        const packages = response.data.signed.targets;
        that.formatPackages(packages);
        that.fetchComments();
        const filepaths = that.getFilepaths();
        axios
          .post(API_SOFTWARE_COUNT_INSTALLED_ECUS, filepaths)
          .then((resp) => {
            that.prepareFilePaths(resp.data);
            switch (that.page) {
              case 'device':
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
              case 'device':
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
    this.fetchPackages('packagesFetchAsync', limit);
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
        targetFormat: pack.custom ? pack.custom.targetFormat : 'OSTREE',
        targetLength: pack.length,
        id: {
          name: pack.custom ? pack.custom.name : filepath,
          version: pack.custom ? pack.custom.version : pack.hashes.sha256,
        },
        installedOnEcus: 0,
        isBlackListed: false,
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

    const deletedPackageNames = JSON.parse(localStorage.getItem('deletedPackages'));
    const deletedVersions = JSON.parse(localStorage.getItem('deletedVersions'));
    this.packages = _.filter(
      packs, pack => !_.includes(deletedPackageNames, pack.id.name) && !_.includes(deletedVersions, pack.id.version)
    );
  }

  updatePackageComment(filepath, comment) {
    const result = _.find(this.packages, pack => pack.filepath === filepath);
    result.comment = comment;
  }

  packageURI = (entryName, name, version, hardwareIds) => `${API_UPLOAD_SOFTWARE}/${entryName}?name=${encodeURIComponent(name)}&version=${encodeURIComponent(version)}&hardwareIds=${hardwareIds}`;

  createPackage(data, formData, hardwareIds) {
    const source = axios.CancelToken.source();
    const length = this.packagesUploading.push({
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
    const uploadObj = this.packagesUploading[length - 1];
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
      },
      cancelToken: source.token,
    };
    const entryName = `${data.packageName}_${data.version}`;
    axios
      .put(this.packageURI(entryName, data.packageName, data.version, hardwareIds), formData, config)
      .then((response) => {
        uploadObj.status = 'success';
        this.packagesCreateAsync = handleAsyncSuccess(response);
      })
      .catch((error) => {
        uploadObj.status = 'error';
        this.packagesCreateAsync = handleAsyncError(error);
      });
    uploadObj.source = source;
  }

  fetchBlacklist(ifWithStats = false, ifPrepareBlacklist = false) {
    resetAsync(this.packagesBlacklistFetchAsync, true);
    return axios
      .get(API_PACKAGES_BLACKLIST_FETCH)
      .then((response) => {
        if (ifWithStats) {
          const blacklist = response.data;
          if (blacklist.length) {
            const after = _.after(
              blacklist.length,
              () => {
                this.blacklist = blacklist;
                if (ifPrepareBlacklist) {
                  this.prepareBlacklist();
                }
                switch (this.page) {
                  case 'device':
                    this.prepareDevicePackages();
                    break;
                  case 'packages':
                    this.preparePackages(this.packagesSort, true);
                    break;
                  default:
                    break;
                }
                this.packagesBlacklistFetchAsync = handleAsyncSuccess(response);
              },
              this,
            );
            _.each(blacklist, (pack) => {
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
            this.blacklist = blacklist;
            if (ifPrepareBlacklist) {
              this.preparePackages(this.packagesSort, true);
            }
            this.packagesBlacklistFetchAsync = handleAsyncSuccess(response);
          }
        } else {
          this.blacklist = response.data;
          switch (this.page) {
            case 'device':
              this.prepareDevicePackages();
              this.prepareOndevicePackages();
              break;
            case 'packages':
              this.preparePackages();
              break;
            default:
              break;
          }
          this.packagesBlacklistFetchAsync = handleAsyncSuccess(response);
        }
      })
      .catch((error) => {
        this.packagesBlacklistFetchAsync = handleAsyncError(error);
      });
  }

  fetchBlacklistedPackage(data) {
    this.blacklistedPackage = {};
    resetAsync(this.packagesOneBlacklistedFetchAsync, true);
    return axios
      .get(`${API_PACKAGES_PACKAGE_BLACKLISTED_FETCH}/${data.name}/${data.version}`, data.details)
      .then((response) => {
        this.blacklistedPackage = response.data;
        this.packagesOneBlacklistedFetchAsync = handleAsyncSuccess(response);
      })
      .catch((error) => {
        this.packagesOneBlacklistedFetchAsync = handleAsyncError(error);
      });
  }

  blacklistPackage(data) {
    resetAsync(this.packagesBlacklistAsync, true);
    return axios
      .post(API_PACKAGES_BLACKLIST, data)
      .then((response) => {
        this.packagesBlacklistAsync = handleAsyncSuccess(response);
      })
      .catch((error) => {
        this.packagesBlacklistAsync = handleAsyncError(error);
      });
  }

  updateBlacklistedPackage(data) {
    resetAsync(this.packagesUpdateBlacklistedAsync, true);
    return axios
      .put(API_PACKAGES_UPDATE_BLACKLISTED, data)
      .then((response) => {
        this.fetchBlacklist();
        this.packagesUpdateBlacklistedAsync = handleAsyncSuccess(response);
      })
      .catch((error) => {
        this.packagesUpdateBlacklistedAsync = handleAsyncError(error);
      });
  }

  removePackageFromBlacklist(data) {
    resetAsync(this.packagesRemoveFromBlacklistAsync, true);
    return axios
      .delete(`${API_PACKAGES_REMOVE_FROM_BLACKLIST}/${data.name}/${data.version}`)
      .then((response) => {
        this.fetchBlacklist();
        this.packagesRemoveFromBlacklistAsync = handleAsyncSuccess(response);
      })
      .catch((error) => {
        this.packagesRemoveFromBlacklistAsync = handleAsyncError(error);
      });
  }

  fetchAffectedDevicesCount(data) {
    resetAsync(this.packagesAffectedDevicesCountFetchAsync, true);
    return axios
      .get(`${API_PACKAGES_AFFECTED_DEVICES_COUNT_FETCH}/${data.name}/${data.version}/preview`)
      .then((response) => {
        this.affectedDevicesCount = response.data;
        this.packagesAffectedDevicesCountFetchAsync = handleAsyncSuccess(response);
      })
      .catch((error) => {
        this.packagesAffectedDevicesCountFetchAsync = handleAsyncError(error);
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
          case 'device':
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
          case 'device':
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

  fetchPackagesHistory(id, filter = '', fetchFirstItems = false) {
    resetAsync(this.packagesHistoryFetchAsync, true);
    if (this.packagesHistoryFilter !== filter || fetchFirstItems) {
      this.packagesHistoryTotalCount = null;
      this.packagesHistoryCurrentPage = 0;
    }
    this.packagesHistoryFilter = filter;
    return axios
      .get(`${API_SOFTWARE_DEVICE_HISTORY}/${id}/installation_history?limit=1000`)
      .then((response) => {
        const data = response.data.values;
        const after = _.after(
          data.length,
          () => {
            this.packagesHistoryCurrentPage += 1;
            this.packagesHistoryTotalCount = response.data.total;
            this.packagesHistory = _.uniqBy(this.packagesHistory.concat(data), item => item.correlationId);
            this.preparePackagesHistory();
          },
          this,
        );
        _.each(data, (item) => {
          if (item.correlationId && item.correlationId.search('urn:here-ota:campaign:') >= 0) {
            const campaignId = item.correlationId.substring('urn:here-ota:campaign:'.length);
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
        if (packagesSort !== 'undefined' && packagesSort === 'desc') {
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
      sortedPackages = packagesSort !== 'undefined' && packagesSort === 'desc'
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
      const { blacklist } = this;
      const groupedPackages = {};
      let sortedPackages = {};
      const parsedBlacklist = [];

      _.each(blacklist, (pack) => {
        parsedBlacklist[`${pack.packageId.name}-${pack.packageId.version}`] = {
          isBlackListed: true,
          comment: pack.comment,
        };
      });

      _.each(packages, (packInstalled) => {
        if (!_.isUndefined(parsedBlacklist[`${packInstalled.id.name}-${packInstalled.id.version}`])) {
          packInstalled.isBlackListed = true;
        }
        if (autoInstalledPackages.indexOf(packInstalled.id.name) > -1) packInstalled.isAutoInstallEnabled = true;
      });

      _.each(packages, (pack) => {
        if (_.isUndefined(groupedPackages[pack.id.name]) || !(groupedPackages[pack.id.name] instanceof Object)) {
          groupedPackages[pack.id.name] = {
            versions: [],
            packageName: pack.id.name,
            hardwareIds: pack.hardwareIds,
            isBlackListed: pack.isBlackListed,
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
          if (packagesSort !== 'undefined' && packagesSort === 'desc') return b.localeCompare(a);
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
        sortedPackages = packagesSort !== 'undefined' && packagesSort === 'desc'
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
      const parsedBlacklist = [];

      _.each(this.blacklist, (pack) => {
        parsedBlacklist[`${pack.packageId.name}-${pack.packageId.version}`] = true;
      });

      _.each(this.ondevicePackages, (pack) => {
        if (pack.packageId !== 'undefined') {
          const newPack = {
            name: pack.packageId.name,
            version: pack.packageId.version,
            isBlackListed: pack.isBlackListed || !_.isUndefined(parsedBlacklist[`${pack.packageId.name}-${pack.packageId.version}`]),
          };
          packages.push(newPack);
        } else {
          const newPack = {
            name: pack.name,
            version: pack.version,
            isBlackListed: pack.isBlackListed || !_.isUndefined(parsedBlacklist[`${pack.name}-${pack.version}`]),
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
          if (packagesSort !== 'undefined' && packagesSort === 'desc') return b.localeCompare(a);
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
        sortedPackages = packagesSort !== 'undefined' && packagesSort === 'desc'
          ? Object.assign(specialGroup, sortedPackages)
          : Object.assign(sortedPackages, specialGroup);
      }

      this.preparedOndevicePackages = sortedPackages;
    } else {
      this.preparedOndevicePackages = [];
    }
  }

  prepareBlacklist() {
    let groupedPackages = {};
    let sortedPackages = {};
    _.each(this.blacklist, (obj, index) => {
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
      groupedPackages[obj.packageId.name].versions.push(this.blacklist[index]);
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

    this.preparedBlacklist = sortedPackages;
    this.preparedBlacklistRaw = groupedPackages;
  }

  resetBlacklistActions() {
    resetAsync(this.packagesOneBlacklistedFetchAsync);
    resetAsync(this.packagesBlacklistAsync);
    resetAsync(this.packagesUpdateBlacklistedAsync);
    resetAsync(this.packagesRemoveFromBlacklistAsync);
    resetAsync(this.packagesAffectedDevicesCountFetchAsync);
    this.blacklistedPackage = {};
    this.affectedDevicesCount = {};
  }

  reset() {
    resetAsync(this.packagesDeleteAsync);
    resetAsync(this.packagesFetchAsync);
    resetAsync(this.packagesSafeFetchAsync);
    resetAsync(this.packagesCreateAsync);
    resetAsync(this.packagesBlacklistFetchAsync);
    resetAsync(this.packagesOneBlacklistedFetchAsync);
    resetAsync(this.packagesBlacklistAsync);
    resetAsync(this.packagesUpdateBlacklistedAsync);
    resetAsync(this.packagesRemoveFromBlacklistAsync);
    resetAsync(this.packagesAffectedDevicesCountFetchAsync);
    resetAsync(this.packagesAutoInstalledFetchAsync);
    resetAsync(this.packagesHistoryFetchAsync);
    resetAsync(this.packagesEnableAutoInstallAsync);
    resetAsync(this.packagesDisableAutoInstallAsync);
    resetAsync(this.commentUpdateAsync);
    this.page = null;
    this.packages = [];
    this.preparedPackages = [];
    this.packagesSort = 'asc';
    this.preparedOndevicePackages = {};
    this.packagesOndeviceSort = 'asc';
    this.packagesUploading = [];
    this.blacklist = [];
    this.preparedBlacklist = [];
    this.preparedBlacklistRaw = [];
    this.blacklistedPackage = {};
    this.affectedDevicesCount = {};
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
      targetFormat: pack.custom ? pack.custom.targetFormat : 'OSTREE',
      targetLength: pack.length,
      hardwareIds,
      description: pack.checksum.hash,
      id: {
        name,
        version,
      },
      installedOnEcus: 0,
      isBlackListed: false,
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
      case 'device':
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
  get blacklistCount() {
    return this.blacklist.length;
  }
}
