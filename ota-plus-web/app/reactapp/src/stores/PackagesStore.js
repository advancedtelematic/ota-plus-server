import { observable, computed, extendObservable } from 'mobx';
import axios from 'axios';
import {
    API_PACKAGES,
    API_TUF_PACKAGES,
    API_UPLOAD_TUF_PACKAGE,
    API_PACKAGES_BLACKLIST_FETCH,
    API_PACKAGES_COUNT_DEVICE_AND_GROUP,
    API_PACKAGES_COUNT_VERSION_BY_NAME,
    API_PACKAGES_PACKAGE_BLACKLISTED_FETCH,
    API_PACKAGES_BLACKLIST,
    API_PACKAGES_UPDATE_BLACKLISTED,
    API_PACKAGES_REMOVE_FROM_BLACKLIST,
    API_PACKAGES_AFFECTED_DEVICES_COUNT_FETCH,
    API_PACKAGES_DEVICE_PACKAGES,
    API_PACKAGES_DEVICE_AUTO_INSTALLED_PACKAGES,
    API_PACKAGES_DEVICE_QUEUE,
    API_PACKAGES_DEVICE_HISTORY,
    API_PACKAGES_DEVICE_UPDATES_LOGS,
    API_PACKAGES_DEVICE_AUTO_INSTALL,
    API_PACKAGES_DEVICE_INSTALL,
    API_PACKAGES_DEVICE_CANCEL_INSTALLATION,
    API_CREATE_TUF_REPO,
    API_CREATE_DIRECTOR_REPO
} from '../config';
import { resetAsync, handleAsyncSuccess, handleAsyncError } from '../utils/Common';
import _ from 'underscore';

export default class PackagesStore {

    @observable directorRepoExistsFetchAsync = {};
    @observable tufRepoExistsFetchAsync = {};
    @observable packagesFetchAsync = {};
    @observable packageStatisticsFetchAsync = {};
    @observable packagesCreateAsync = {};
    @observable packagesTufCreateAsync = {};
    @observable packagesUpdateDetailsAsync = {};
    @observable packagesBlacklistFetchAsync = {};
    @observable packagesOneBlacklistedFetchAsync = {};
    @observable packagesBlacklistAsync = {};
    @observable packagesUpdateBlacklistedAsync = {};
    @observable packagesRemoveFromBlacklistAsync = {};
    @observable packagesAffectedDevicesCountFetchAsync = {};
    @observable packagesForDeviceFetchAsync = {};
    @observable initialPackagesForDeviceFetchAsync = {};
    @observable packagesOndeviceFetchAsync = {};
    @observable packagesAutoInstalledForDeviceFetchAsync = {};
    @observable packagesDeviceQueueFetchAsync = {};
    @observable packagesDeviceHistoryFetchAsync = {};
    @observable packagesDeviceUpdatesLogsFetchAsync = {};
    @observable packagesDeviceEnableAutoInstallAsync = {};
    @observable packagesDeviceDisableAutoInstallAsync = {};
    @observable packagesDeviceInstallAsync = {};
    @observable packagesDeviceCancelInstallationAsync = {};
    @observable page = null;
    @observable initialPackages = [];
    @observable packages = [];
    @observable packageStats = [];
    @observable overallPackagesCount = null;
    @observable preparedPackages = {};
    @observable preparedPackagesPerDevice = {};
    @observable packagesFilter = null;
    @observable packagesSort = 'asc';
    @observable preparedOndevicePackages = {};
    @observable packagesOndeviceFilter = null;
    @observable packagesOndeviceSort = 'asc';
    @observable packagesUploading = [];
    @observable blacklist = [];
    @observable preparedBlacklist = [];
    @observable blacklistedPackage = {};
    @observable affectedDevicesCount = {};
    @observable initialDevicePackages = [];
    @observable installedPackagesPerDevice = {};
    @observable devicePackages = [];
    @observable devicePackagesFilter = '';
    @observable deviceAutoInstalledPackages = [];
    @observable devicePackagesInstalledCount = 0;
    @observable devicePackagesQueuedCount = 0;
    @observable deviceQueue = [];
    @observable deviceHistory = [];
    @observable deviceHistoryPerDevice = {};
    @observable deviceUpdatesLogs = [];

    @observable ondevicePackages = [];
    @observable ondevicePackagesCurrentPage = 0;
    @observable ondevicePackagesTotalCount = null;
    @observable ondevicePackagesLimit = 25;
    @observable ondeviceFilter = '';
    @observable activeDeviceId = null;

    constructor() {
        resetAsync(this.directorRepoExistsFetchAsync);
        resetAsync(this.tufRepoExistsFetchAsync);
        resetAsync(this.packagesFetchAsync);
        resetAsync(this.packageStatisticsFetchAsync);
        resetAsync(this.packagesCreateAsync);
        resetAsync(this.packagesTufCreateAsync);
        resetAsync(this.packagesUpdateDetailsAsync);
        resetAsync(this.packagesBlacklistFetchAsync);
        resetAsync(this.packagesOneBlacklistedFetchAsync);
        resetAsync(this.packagesBlacklistAsync);
        resetAsync(this.packagesUpdateBlacklistedAsync);
        resetAsync(this.packagesRemoveFromBlacklistAsync);
        resetAsync(this.packagesAffectedDevicesCountFetchAsync);
        resetAsync(this.packagesForDeviceFetchAsync);
        resetAsync(this.initialPackagesForDeviceFetchAsync);
        resetAsync(this.packagesOndeviceFetchAsync);
        resetAsync(this.packagesAutoInstalledForDeviceFetchAsync);
        resetAsync(this.packagesDeviceQueueFetchAsync);
        resetAsync(this.packagesDeviceHistoryFetchAsync);
        resetAsync(this.packagesDeviceUpdatesLogsFetchAsync);
        resetAsync(this.packagesDeviceEnableAutoInstallAsync);
        resetAsync(this.packagesDeviceDisableAutoInstallAsync);
        resetAsync(this.packagesDeviceInstallAsync);
        resetAsync(this.packagesDeviceCancelInstallationAsync);
    }

    fetchDirectorRepoExists() {
        resetAsync(this.directorRepoExistsFetchAsync, true);
        return axios.post(API_CREATE_DIRECTOR_REPO)
            .then(function(response) {
                this.directorRepoExistsFetchAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function(error) {
                this.directorRepoExistsFetchAsync = handleAsyncError(error);
            }.bind(this));
    }

    fetchTufRepoExists() {
        resetAsync(this.tufRepoExistsFetchAsync, true);
        return axios.post(API_CREATE_TUF_REPO)
            .then(function(response) {
                this.tufRepoExistsFetchAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function(error) {
                this.tufRepoExistsFetchAsync = handleAsyncError(error);
            }.bind(this));
    }

    fetchPackages(filter = this.packagesFilter) {
        this.packagesFilter = filter;
        resetAsync(this.packagesFetchAsync, true);
        return axios.get(API_PACKAGES + '?regex=' + (filter ? filter : ''))
            .then(function(response) {
                this.initialPackages = response.data;
                this.packages = response.data;
                let directorPackages = [];
                let after = _.after(directorPackages.length, () => {
                    this._prepareDirectorPackages(directorPackages);
                    switch (this.page) {
                        case 'device':                        
                            this._prepareDevicePackages();
                            break;
                        default:
                            this._preparePackages();
                            break;
                    }
                    this.packagesFetchAsync = handleAsyncSuccess(response);
                }, this);
                axios.get(API_TUF_PACKAGES)
                    .then(function(responseDirector) {
                        directorPackages.push(responseDirector.data.signed.targets);
                        after();
                    })
                    .catch(function() {
                        after();
                    });

                if (this.overallPackagesCount === null) {
                    this.overallPackagesCount = response.data.length;
                }
            }.bind(this))
            .catch(function(error) {
                this.packagesFetchAsync = handleAsyncError(error);
            }.bind(this));
    }

    _prepareDirectorPackages(directorPackages) {
        let versionedDirectorPackages = [];
        _.each(directorPackages, (versionObject, index) => {
            _.each(versionObject, (version, imageName) => {
                let packageName = null;
                let packageVersion = null;
                let packageHash = version.hashes.sha256;
                if(version.custom) {
                    packageName = version.custom.name.value;   
                    packageVersion = version.custom.version.value;
                } else {
                    packageName = imageName;   
                    packageVersion = version.hashes.sha256;
                }
                
                let formattedVersion = {
                    checkSum: packageHash,
                    imageName: imageName,
                    createdAt: null,
                    description: packageHash,
                    id: {
                        name: packageName,
                        version: packageVersion
                    },
                    isBlackListed: false,
                    namespace: null,
                    signature: null,
                    size: 0,
                    uri: {
                        uri: null
                    },
                    uuid: packageHash,
                    inDirector: true,
                    hardwareIds: version.custom.hardwareIds
                };
                versionedDirectorPackages.push(formattedVersion);
            });
        });

        let mergedPackages = [];
        _.each(versionedDirectorPackages, (dirPack, dirIndex) => {
            mergedPackages.push(dirPack);
        });
        _.each(this.packages, (corePack, index) => {
            mergedPackages.push(corePack);
        });
        this.packages = mergedPackages;
    }

    fetchPackageStatistics(packageName) {
        resetAsync(this.packageStatisticsFetchAsync, true);
        return axios.get(API_PACKAGES_COUNT_VERSION_BY_NAME + '/' + packageName)
            .then(function(response) {
                let countByVersion = response.data;
                let countOnDeviceAndGroup = [];

                if (countByVersion.values.length) {
                    let after = _.after(countByVersion.values.length, () => {
                        this.packageStats = countOnDeviceAndGroup;
                        this.packageStatisticsFetchAsync = handleAsyncSuccess(response);
                    }, this);
                    _.each(countByVersion.values, (statistics, index) => {
                        let packageVersion = statistics.packageVersion;
                        axios.get(API_PACKAGES_COUNT_DEVICE_AND_GROUP + '/' + packageName + '/' + packageVersion)
                            .then(function(response) {
                                countOnDeviceAndGroup.push({
                                    packageVersion: packageVersion,
                                    deviceCount: response.data.deviceCount,
                                    groupsCount: response.data.groupIds.length
                                });
                                after();
                            })
                            .catch(function() {
                                after();
                            });
                    });
                } else {
                    this.packageStats = countOnDeviceAndGroup;
                    this.packageStatisticsFetchAsync = handleAsyncSuccess(response);
                }

            }.bind(this))
            .catch(function(error) {
                this.packageStatisticsFetchAsync = handleAsyncError(error);
            }.bind(this));
    }

    _packageURI(name, version) {
        return API_PACKAGES + '/' +
            encodeURIComponent(name) + '/' +
            encodeURIComponent(version);
    }

    createPackage(data, formData) {
        resetAsync(this.packagesCreateAsync, true);
        return axios.get(this._packageURI(data.packageName, data.version))
            .then(function(resp) {
                let error = {
                    response: {
                        status: 400,
                        data: {
                            description: "Package already exists."
                        }
                    }
                }
                this.packagesCreateAsync = handleAsyncError(error);
            }.bind(this))
            .catch(function(err) {
                let success = {
                    status: 200,
                    data: null
                }
                this.packagesCreateAsync = handleAsyncSuccess(success);
                let source = axios.CancelToken.source();
                let length = this.packagesUploading.push({
                    status: null,
                    size: 0,
                    uploaded: 0,
                    progress: 0,
                    upSpeed: 0,
                    package: {
                        name: data.packageName,
                        version: data.version
                    }
                });
                const uploadObj = this.packagesUploading[length - 1];
                const config = {
                    onUploadProgress: function(progressEvent) {
                        let currentTime = new Date().getTime();
                        let lastUpTime = uploadObj.lastUpTime || currentTime;
                        let upSpeed = ((progressEvent.loaded - uploadObj.uploaded) * 1000) / ((currentTime - lastUpTime) * 1024)
                        uploadObj.progress = progressEvent.loaded * 100 / progressEvent.total;
                        uploadObj.size = progressEvent.total;
                        uploadObj.uploaded = progressEvent.loaded;
                        uploadObj.upSpeed = upSpeed;
                        uploadObj.lastUpTime = currentTime;
                    }.bind(this),
                    cancelToken: source.token
                };
                const request = axios.put(
                        this._packageURI(data.packageName, data.version) +
                            '?description=' + encodeURIComponent(data.description) +
                            '&vendor=' + encodeURIComponent(data.vendor),
                        formData,
                        config)
                    .then(function(response) {
                        uploadObj.status = 'success';
                    }.bind(this))
                    .catch(function(error) {
                        uploadObj.status = 'error';
                    }.bind(this));
                uploadObj.source = source;
            }.bind(this));
    }

    _tufPackageURI(entryName, name, version, hardwareIds) {
        return API_UPLOAD_TUF_PACKAGE + '/' + entryName + '?name=' + encodeURIComponent(name) + '&version=' + encodeURIComponent(version) + '&hardwareIds=' + hardwareIds;
    }

    createTufPackage(data, formData, hardwareIds) {
        let source = axios.CancelToken.source();
        let length = this.packagesUploading.push({
            status: null,
            size: 0,
            uploaded: 0,
            progress: 0,
            upSpeed: 0,
            package: {
                name: data.packageName,
                version: data.version
            }
        });
        const uploadObj = this.packagesUploading[length - 1];
        const config = {
            onUploadProgress: function(progressEvent) {
                let currentTime = new Date().getTime();
                let lastUpTime = uploadObj.lastUpTime || currentTime;
                let upSpeed = ((progressEvent.loaded - uploadObj.uploaded) * 1000) / ((currentTime - lastUpTime) * 1024)
                uploadObj.progress = progressEvent.loaded * 100 / progressEvent.total;
                uploadObj.size = progressEvent.total;
                uploadObj.uploaded = progressEvent.loaded;
                uploadObj.upSpeed = upSpeed;
                uploadObj.lastUpTime = currentTime;
            }.bind(this),
            cancelToken: source.token
        };
        const entryName = data.packageName + '_' + data.version;
        const request = axios.put(
                this._tufPackageURI(entryName, data.packageName, data.version, hardwareIds) +
                    '&description=' + encodeURIComponent(data.description) +
                    '&vendor=' + encodeURIComponent(data.vendor),
                formData,
                config)
            .then(function(response) {
                uploadObj.status = 'success';
                this.packagesTufCreateAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function(error) {
                uploadObj.status = 'error';
                this.packagesTufCreateAsync = handleAsyncError(error);
            }.bind(this));
        uploadObj.source = source;
    }

    updatePackageDetails(data) {
        resetAsync(this.packagesUpdateDetailsAsync, true);
        return axios.put(this._packageURI(data.name, data.version) + '/info', data.details)
            .then(function(response) {
                this._updatePackageComment(data);
                this.packagesUpdateDetailsAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function(error) {
                this.packagesUpdateDetailsAsync = handleAsyncError(error);
            }.bind(this));
    }

    _updatePackageComment(data) {
        let comment = data.details.description;
        let pack = this._getPackage(data);
        pack.description = comment;
    }

    fetchBlacklist(ifWithStats = false, ifPrepareBlacklist = false) {
        resetAsync(this.packagesBlacklistFetchAsync, true);
        return axios.get(API_PACKAGES_BLACKLIST_FETCH)
            .then(function(response) {
                if (ifWithStats) {
                    let blacklist = response.data;
                    if (blacklist.length) {
                        let after = _.after(blacklist.length, () => {
                            this.blacklist = blacklist;
                            if (ifPrepareBlacklist) {
                                this._prepareBlacklist();
                            }
                            switch (this.page) {
                                case 'device':
                                    this._prepareDevicePackages();
                                    break;
                                case 'packages':
                                    this._preparePackages();
                                    break;
                                default:
                                    break;
                            }
                            this.packagesBlacklistFetchAsync = handleAsyncSuccess(response);
                        }, this);
                        _.each(blacklist, (pack, index) => {
                            axios.get(API_PACKAGES_COUNT_DEVICE_AND_GROUP + '/' + pack.packageId.name + '/' + pack.packageId.version)
                                .then(function(count) {
                                    pack.statistics = count.data;
                                    after();
                                })
                                .catch(function(err) {
                                    pack.statistics = {};
                                    after();
                                });
                        });
                    } else {
                        this.blacklist = blacklist;
                        if (ifPrepareBlacklist) {
                            this._prepareBlacklist();
                        }
                        this.packagesBlacklistFetchAsync = handleAsyncSuccess(response);
                    }
                } else {
                    this.blacklist = response.data;
                    switch (this.page) {
                        case 'device':
                            this._prepareDevicePackages();
                            this._prepareOndevicePackages();
                            break;
                        case 'packages':
                            this._preparePackages();
                            break;
                        default:
                            break;
                    }
                    this.packagesBlacklistFetchAsync = handleAsyncSuccess(response);
                }
            }.bind(this))
            .catch(function(error) {
                this.packagesBlacklistFetchAsync = handleAsyncError(error);
            }.bind(this));
    }

    fetchBlacklistedPackage(data) {
        this.blacklistedPackage = {};
        resetAsync(this.packagesOneBlacklistedFetchAsync, true);
        return axios.get(API_PACKAGES_PACKAGE_BLACKLISTED_FETCH + '/' + data.name + '/' + data.version, data.details)
            .then(function(response) {
                let comment = data.comment;
                if(!_.isUndefined(comment)) {
                      _.each(this.packages, (obj, index) => {
                        if(obj.id.name === data.name && obj.id.version === data.version && obj.isBlackListed === true) {
                            extendObservable(obj, {
                                blacklistComment: comment,
                            })
                        }
                    });
                }
                this.blacklistedPackage = response.data;
                this.packagesOneBlacklistedFetchAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function(error) {
                this.packagesOneBlacklistedFetchAsync = handleAsyncError(error);
            }.bind(this));
    }

    blacklistPackage(data) {
        resetAsync(this.packagesBlacklistAsync, true);
        return axios.post(API_PACKAGES_BLACKLIST, data)
            .then(function(response) {
                this.fetchBlacklistedPackage({ name: data.packageId.name, version: data.packageId.version, comment: data.comment });
                this._blacklistPackage(data);
                this.packagesBlacklistAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function(error) {
                this.packagesBlacklistAsync = handleAsyncError(error);
            }.bind(this));
    }

    updateBlacklistedPackage(data) {
        resetAsync(this.packagesUpdateBlacklistedAsync, true);
        return axios.put(API_PACKAGES_UPDATE_BLACKLISTED, data)
            .then(function(response) {
                this.fetchBlacklistedPackage({ name: data.packageId.name, version: data.packageId.version, comment: data.comment });
                this._blacklistPackage(data);
                this.packagesUpdateBlacklistedAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function(error) {
                this.packagesUpdateBlacklistedAsync = handleAsyncError(error);
            }.bind(this));
    }

    removePackageFromBlacklist(data) {
        resetAsync(this.packagesRemoveFromBlacklistAsync, true);
        return axios.delete(API_PACKAGES_REMOVE_FROM_BLACKLIST + '/' + data.name + '/' + data.version)
            .then(function(response) {
                this._removePackageFromBlacklist(data);
                this.packagesRemoveFromBlacklistAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function(error) {
                this.packagesRemoveFromBlacklistAsync = handleAsyncError(error);
            }.bind(this));
    }

    fetchAffectedDevicesCount(data) {
        resetAsync(this.packagesAffectedDevicesCountFetchAsync, true);
        return axios.get(API_PACKAGES_AFFECTED_DEVICES_COUNT_FETCH + '/' + data.name + '/' + data.version + '/preview')
            .then(function(response) {
                this.affectedDevicesCount = response.data;
                this.packagesAffectedDevicesCountFetchAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function(error) {
                this.packagesAffectedDevicesCountFetchAsync = handleAsyncError(error);
            }.bind(this));
    }

    fetchInitialDevicePackages(id, filter = this.devicePackagesFilter) {
        resetAsync(this.initialPackagesForDeviceFetchAsync, true);
        return axios.get(API_PACKAGES_DEVICE_PACKAGES + '/' + id + '/packages')
            .then(function(response) {
                let totalPackagesCount = response.data.total;
                let initialDevicePackages = [];

                if (totalPackagesCount) {
                    let after = _.after(initialDevicePackages.length, () => {
                        this.initialDevicePackages = initialDevicePackages;
                        extendObservable(this.installedPackagesPerDevice, {
                            [id]: initialDevicePackages
                        });
                        switch (this.page) {
                            case 'device':
                                this._prepareDevicePackages();
                                break;
                            default:
                                break;
                        }
                        this.initialPackagesForDeviceFetchAsync = handleAsyncSuccess(response);                        
                    }, this);

                    axios.get(API_PACKAGES_DEVICE_PACKAGES + '/' + id + '/packages?regex=' + '&limit=' + totalPackagesCount)
                        .then(function(response) {
                            initialDevicePackages = response.data.values;
                            after();
                        })
                        .catch(function() {
                            after();
                        });
                } else {
                    this.initialDevicePackages = [];
                    this.installedPackagesPerDevice[id] = [];
                    this.initialPackagesForDeviceFetchAsync = handleAsyncSuccess(response);
                }                
                this.initialPackagesForDeviceFetchAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function(error) {
                this.initialPackagesForDeviceFetchAsync = handleAsyncError(error);
            }.bind(this));
    }

    fetchDevicePackages(id, filter = this.devicePackagesFilter) {
        resetAsync(this.packagesForDeviceFetchAsync, true);
        return axios.get(API_PACKAGES_DEVICE_PACKAGES + '/' + id + '/packages?regex=' + (this.devicePackagesFilter ? this.devicePackagesFilter : ''))
            .then(function(response) {
                this.devicePackages = response.data.values;
                switch (this.page) {
                    case 'device':
                        this._prepareDevicePackages();
                        break;
                    default:
                        break;
                }
                this.packagesForDeviceFetchAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function(error) {
                this.packagesForDeviceFetchAsync = handleAsyncError(error);
            }.bind(this));
    }

    fetchOndevicePackages(id, filter = '') {
        resetAsync(this.packagesOndeviceFetchAsync, true);
        if(this.ondeviceFilter !== filter) {
            this.ondevicePackagesTotalCount = null;
            this.ondevicePackagesCurrentPage = 0;
            this.ondevicePackages = [];
            this.preparedOndevicePackages = [];
        }
        this.ondeviceFilter = filter;
        return axios.get(API_PACKAGES_DEVICE_PACKAGES + '/' + id + '/packages?regex=' + (filter ? filter : '') + 
                        '&limit=' + this.ondevicePackagesLimit + '&offset=' + this.ondevicePackagesCurrentPage * this.ondevicePackagesLimit)
            .then(function(response) {
                this.ondevicePackages = _.uniq(this.ondevicePackages.concat(response.data.values), pack => pack.packageId.name);
                switch (this.page) {
                    case 'device':
                        this._prepareOndevicePackages();
                        this.ondevicePackagesCurrentPage++;
                        this.ondevicePackagesTotalCount = response.data.total;
                        break;
                    default:
                        break;
                }
                this.packagesOndeviceFetchAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function(error) {
                this.packagesOndeviceFetchAsync = handleAsyncError(error);
            }.bind(this));
    }

    fetchDeviceAutoInstalledPackages(id) {
        resetAsync(this.packagesAutoInstalledForDeviceFetchAsync, true);
        return axios.get(API_PACKAGES_DEVICE_AUTO_INSTALLED_PACKAGES + '?device=' + id)
            .then(function(response) {
                this.deviceAutoInstalledPackages = response.data;
                switch (this.page) {
                    case 'device':
                        this._prepareDevicePackages();
                        break;
                    default:
                        break;
                }
                this.packagesAutoInstalledForDeviceFetchAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function(error) {
                this.packagesAutoInstalledForDeviceFetchAsync = handleAsyncError(error);
            }.bind(this));
    }

    fetchDevicePackagesQueue(id) {
        resetAsync(this.packagesDeviceQueueFetchAsync, true);
        return axios.get(API_PACKAGES_DEVICE_QUEUE + '/' + id + '/queued')
            .then(function(response) {
                this.deviceQueue = response.data;
                switch (this.page) {
                    case 'device':
                        this._prepareDevicePackages();
                        break;
                    default:
                        break;
                }
                this.packagesDeviceQueueFetchAsync = handleAsyncSuccess(response);

            }.bind(this))
            .catch(function(error) {
                this.packagesDeviceQueueFetchAsync = handleAsyncError(error);
            }.bind(this));
    }    

    fetchDevicePackagesHistory(id) {
        resetAsync(this.packagesDeviceHistoryFetchAsync, true);
        return axios.get(API_PACKAGES_DEVICE_HISTORY + '?uuid=' + id)
            .then(function(response) {
                let data = response.data.reverse();
                this.deviceHistory = data;
                this.deviceHistoryPerDevice[this.activeDeviceId] = data;
                this.packagesDeviceHistoryFetchAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function(error) {
                this.packagesDeviceHistoryFetchAsync = handleAsyncError(error);
            }.bind(this));
    }

    fetchDevicePackagesUpdatesLogs(id) {
        resetAsync(this.packagesDeviceUpdatesLogsFetchAsync, true);
        return axios.get(API_PACKAGES_DEVICE_UPDATES_LOGS + '/' + id + '/results')
            .then(function(response) {
                this.deviceUpdatesLogs = response.data;
                this.packagesDeviceUpdatesLogsFetchAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function(error) {
                this.packagesDeviceUpdatesLogsFetchAsync = handleAsyncError(error);
            }.bind(this));
    }

    enableDevicePackageAutoInstall(packageName, deviceId) {
        resetAsync(this.packagesDeviceEnableAutoInstallAsync, true);
        return axios.put(API_PACKAGES_DEVICE_AUTO_INSTALL + '/' + packageName + '/' + deviceId)
            .then(function(response) {
                this.fetchDeviceAutoInstalledPackages(deviceId);
                this.packagesDeviceEnableAutoInstallAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function(error) {
                this.packagesDeviceEnableAutoInstallAsync = handleAsyncError(error);
            }.bind(this));
    }

    disableDevicePackageAutoInstall(packageName, deviceId) {
        resetAsync(this.packagesDeviceDisableAutoInstallAsync, true);
        return axios.delete(API_PACKAGES_DEVICE_AUTO_INSTALL + '/' + packageName + '/' + deviceId)
            .then(function(response) {
                this.fetchDeviceAutoInstalledPackages(deviceId);
                this.packagesDeviceDisableAutoInstallAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function(error) {
                this.packagesDeviceDisableAutoInstallAsync = handleAsyncError(error);
            }.bind(this));
    }

    installPackage(id, data) {
        resetAsync(this.packagesDeviceInstallAsync, true);
        return axios.post(API_PACKAGES_DEVICE_INSTALL + '/' + id, data)
            .then(function(response) {
                this.fetchDevicePackagesQueue(id);
                this.packagesDeviceInstallAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function(error) {
                this.packagesDeviceInstallAsync = handleAsyncError(error);
            }.bind(this));
    }

    cancelInstallation(deviceId, requestId) {
        resetAsync(this.packagesDeviceCancelInstallationAsync, true);
        return axios.put(API_PACKAGES_DEVICE_CANCEL_INSTALLATION + '/' + deviceId + '/' + requestId + '/cancelupdate')
            .then(function(response) {
                this.fetchDevicePackagesQueue(deviceId);
                this.packagesDeviceCancelInstallationAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function(error) {
                this.packagesDeviceCancelInstallationAsync = handleAsyncError(error);
            }.bind(this));
    }

    _getPackage(data) {
        return _.find(this.packages, (pack) => {
            return pack.id.name === data.name && pack.id.version === data.version;
        });
    }

    _getPackageVersionByUuid(uuid) {
        let found = _.find(this.packages, (pack) => {
            return pack.uuid === uuid;
        });
        return found;
    }

    _getPackageByVersion(version) {
        let found = _.find(this.packages, (pack) => {
            return pack.id.version === version;
        });

        return found ? {
            checkSum: found.checkSum,
            imageName: found.imageName,
            createdAt: found.createdAt,
            description: found.description,
            packageId: {
                name: found.id.name,
                version: found.id.version
            },
            isBlackListed: found.isBlackListed,
            isInstalled: true,
            namespace: found.namespace,
            signature: found.signature,
            size: found.size,
            uri: {
                uri: found.uri
            },
            uuid: found.uuid,
            vendor: found.vendor
        } : {};
    }

    _getDevicePackage(data) {
        return _.find(this.devicePackages, (pack) => {
            return pack.name === data.name && pack.version === data.version;
        });
    }

    _preparePackages(packagesSort = this.packagesSort) {
        let packages = this.packages;        
        let groupedPackages = {};
        let sortedPackages = {};
        this.packagesSort = packagesSort;
        _.each(packages, (obj, index) => {
            if (_.isUndefined(groupedPackages[obj.id.name]) || !groupedPackages[obj.id.name] instanceof Array) {
                groupedPackages[obj.id.name] = new Object();
                groupedPackages[obj.id.name].versions = [];
                groupedPackages[obj.id.name].packageName = obj.id.name;
                groupedPackages[obj.id.name].inDirector = obj.inDirector;
            }
            groupedPackages[obj.id.name].versions.push(obj);
        }, this);
        _.each(groupedPackages, (obj, index) => {
            groupedPackages[index].versions = _.sortBy(obj.versions, (pack) => {
                return pack.createdAt;
            }).reverse();
            let uniqueVersions = _.uniq(groupedPackages[index].versions.reverse(), function (item, key, a) {
                return item.checkSum;
            });
            groupedPackages[index].versions = uniqueVersions;
        });
        let specialGroup = {
            '#': []
        };
        Object.keys(groupedPackages).sort((a, b) => {
            if (packagesSort !== 'undefined' && packagesSort == 'desc') {
                return b.localeCompare(a);
            } else {
                return a.localeCompare(b);
            }
        }).forEach((key) => {
            let firstLetter = key.charAt(0).toUpperCase();
            firstLetter = firstLetter.match(/[A-Z]/) ? firstLetter : '#';
            if (firstLetter != '#' && _.isUndefined(sortedPackages[firstLetter]) || !sortedPackages[firstLetter] instanceof Array) {
                sortedPackages[firstLetter] = [];
            }
            if (firstLetter != '#') {
                sortedPackages[firstLetter].push(groupedPackages[key]);
            } else {
                specialGroup['#'].push(groupedPackages[key]);
            }
        });
        if (!_.isEmpty(specialGroup['#'])) {
            sortedPackages = (packagesSort !== 'undefined' && packagesSort == 'desc' ? Object.assign(specialGroup, sortedPackages) : Object.assign(sortedPackages, specialGroup));
        }
        this.preparedPackages = sortedPackages;
    }

    _prepareDevicePackages(packagesSort = this.packagesSort) {
        this.packagesSort = packagesSort;
        let packages = JSON.parse(JSON.stringify(this.packages));
        if(packages.length) {
            const installedPackages = this.installedPackagesPerDevice[this.activeDeviceId];
            const autoInstalledPackages = this.deviceAutoInstalledPackages;
            const blacklist = this.blacklist;
            const queuedPackages = this.deviceQueue;
            let groupedPackages = {};
            let sortedPackages = {};
            let parsedBlacklist = [];
            let installedIds = [];
            let queuedCount = 0;
            let installedCount = 0;

            _.each(blacklist, (pack) => {
                parsedBlacklist[pack.packageId.name + '-' + pack.packageId.version] = {
                    isBlackListed: true,
                    comment: pack.comment
                };
            });

            _.each(installedPackages, (pack) => {
                installedIds[pack.packageId.name + '_' + pack.packageId.version] = pack.packageId.name + '_' + pack.packageId.version;
            });

            _.each(packages, (packInstalled) => {
                if(!_.isUndefined(parsedBlacklist[packInstalled.id.name + '-' + packInstalled.id.version])) {
                    packInstalled.isBlackListed = true;
                    packInstalled.blacklistComment = parsedBlacklist[packInstalled.id.name + '-' + packInstalled.id.version].comment;
                }
                if(autoInstalledPackages.indexOf(packInstalled.id.name) > -1)
                    packInstalled.isAutoInstallEnabled = true;
            });

            // In order to display comments, we should set this.packages = packages, but then there is a problem with auto update
            // So for now setting of blacklist comment looks the following way 
            _.each(this.packages, (packageObj) => {
                _.each(packages, (packInstalled) => {
                    if(packInstalled.id.name === packageObj.id.name && packInstalled.id.version === packageObj.id.version) {
                        if(!_.isUndefined(packInstalled.blacklistComment)) {
                            packageObj.blacklistComment = packInstalled.blacklistComment;
                        }
                    }
                });
            });

            let queuedIds = [];
            _.each(queuedPackages, (pack) => {
                queuedIds[pack.packageId.name + '_' + pack.packageId.version] = pack.packageId.name + '_' + pack.packageId.version;
            });

            _.each(packages, (pack, index) => {
                const packageKey = pack.id.name + '_' + pack.id.version;
                let isQueued = false;
                let isInstalled = false;

                if(packageKey in installedIds) {
                    pack.attributes = {
                        status: 'installed'
                    };
                    isInstalled = true;
                } else if(packageKey in queuedIds) {
                    pack.attributes = {
                        status: 'queued'
                    };
                    isQueued = true;
                } else {
                    pack.attributes = {
                        status: 'notinstalled'
                    };
                }

                if(_.isUndefined(groupedPackages[pack.id.name]) || !groupedPackages[pack.id.name] instanceof Object ) {
                    groupedPackages[pack.id.name] = {
                        versions: [],
                        packageName: pack.id.name,
                        inDirector: pack.inDirector ? true : false,
                        hardwareIds: pack.hardwareIds,
                        isQueued: isQueued,
                        isInstalled: isInstalled,
                        isBlackListed: pack.isBlackListed && isInstalled ? true : false,
                        isAutoInstallEnabled: !_.isUndefined(pack.isAutoInstallEnabled) ? pack.isAutoInstallEnabled : false
                    };
                }

                if(!groupedPackages[pack.id.name].isQueued && isQueued)
                    groupedPackages[pack.id.name].isQueued = true;
                if(!groupedPackages[pack.id.name].isInstalled && isInstalled)
                    groupedPackages[pack.id.name].isInstalled = true;
                if(!groupedPackages[pack.id.name].isBlackListed && pack.isBlackListed && isInstalled)
                    groupedPackages[pack.id.name].isBlackListed = true;
                groupedPackages[pack.id.name].versions.push(pack);
            });
            
            _.each(groupedPackages, (pack, index) => {
                groupedPackages[index].versions = _.sortBy(pack.versions, (element) => {
                    return element.createdAt;
                }).reverse();
                pack.isQueued ? queuedCount++ : null;
                pack.isInstalled ? installedCount++ : null;

                let uniqueVersions = _.uniq(groupedPackages[index].versions.reverse(), function (item, key, a) {
                    return item.checkSum;
                });
                groupedPackages[index].versions = uniqueVersions;
            });
            
            let specialGroup = {'#' : []};
            Object.keys(groupedPackages).sort((a, b) => {
                if(packagesSort !== 'undefined' && packagesSort == 'desc')
                    return b.localeCompare(a);
                else
                    return a.localeCompare(b);
            }).forEach((key) => {
                let firstLetter = key.charAt(0).toUpperCase();
                firstLetter = firstLetter.match(/[A-Z]/) ? firstLetter : '#';
                if(firstLetter != '#' && _.isUndefined(sortedPackages[firstLetter]) || !sortedPackages[firstLetter] instanceof Array ) {
                    sortedPackages[firstLetter] = [];
                }
                if(firstLetter != '#')
                    sortedPackages[firstLetter].push(groupedPackages[key]);
                else
                    specialGroup['#'].push(groupedPackages[key]);
            });
            if(!_.isEmpty(specialGroup['#'])) {
                sortedPackages = (packagesSort !== 'undefined' && packagesSort == 'desc' ? Object.assign(specialGroup, sortedPackages) : Object.assign(sortedPackages, specialGroup));
            }
            this.preparedPackages = sortedPackages;
            extendObservable(this.preparedPackagesPerDevice, {
                [this.activeDeviceId]: sortedPackages
            });
            this.devicePackagesQueuedCount = queuedCount;
            this.devicePackagesInstalledCount = installedCount;
        } else {
            this.preparedPackages = {};
            extendObservable(this.preparedPackagesPerDevice, {
                [this.activeDeviceId]: {}
            });
            this.devicePackagesQueuedCount = 0;
            this.devicePackagesInstalledCount = 0;
        }
    }

    _prepareOndevicePackages(packagesSort = this.packagesOndeviceSort) {
        this.packagesOndeviceSort = packagesSort;
        if(this.ondevicePackages.length) {
            let packages = [];
            let groupedPackages = {};
            let sortedPackages = {};
            let parsedBlacklist = [];

            _.each(this.blacklist, (pack) => {
                parsedBlacklist[pack.packageId.name + '-' + pack.packageId.version] = true;
            });

            _.each(this.ondevicePackages, (pack) => {
                if(pack.packageId !== 'undefined') {
                    let newPack = {
                        name: pack.packageId.name,
                        version: pack.packageId.version,
                        isBlackListed: pack.isBlackListed || !_.isUndefined(parsedBlacklist[pack.packageId.name + '-' + pack.packageId.version]),
                    };
                    packages.push(newPack);
                }
                else {
                    let newPack = {
                        name: pack.name,
                        version: pack.version,
                        isBlackListed: pack.isBlackListed || !_.isUndefined(parsedBlacklist[pack.name + '-' + pack.version]),
                    };
                    packages.push(newPack);
                }
            });

            _.each(packages, (obj, index) => {
                const objKey = obj.name + '_' + obj.version;
                groupedPackages[objKey] = obj;
            }, this);

            let specialGroup = {'#' : []};
            Object.keys(groupedPackages).sort((a, b) => {
                if(packagesSort !== 'undefined' && packagesSort == 'desc')
                    return b.localeCompare(a);
                else
                    return a.localeCompare(b);
            }).forEach((key) => {
                let firstLetter = key.charAt(0).toUpperCase();
                firstLetter = firstLetter.match(/[A-Z]/) ? firstLetter : '#';
                if(firstLetter != '#' && _.isUndefined(sortedPackages[firstLetter]) || !sortedPackages[firstLetter] instanceof Array ) {
                    sortedPackages[firstLetter] = [];
                }
                if(firstLetter != '#')
                    sortedPackages[firstLetter].push(groupedPackages[key]);
                else
                    specialGroup['#'].push(groupedPackages[key]);
            });
            if(!_.isEmpty(specialGroup['#'])) {
                sortedPackages = (packagesSort !== 'undefined' && packagesSort == 'desc' ? Object.assign(specialGroup, sortedPackages) : Object.assign(sortedPackages, specialGroup));
            }

            this.preparedOndevicePackages = sortedPackages;
        } else {
            this.preparedOndevicePackages = [];
        }
    }

    _prepareBlacklist() {
        let groupedPackages = {};
        _.each(this.blacklist, (obj, index) => {
            if (_.isUndefined(groupedPackages[obj.packageId.name]) || !groupedPackages[obj.packageId.name] instanceof Array) {
                groupedPackages[obj.packageId.name] = new Object();
                groupedPackages[obj.packageId.name] = {
                    versions: [],
                    packageName: obj.packageId.name,
                    deviceCount: 0,
                    groupIds: []
                };
            }
            groupedPackages[obj.packageId.name].deviceCount += !_.isUndefined(obj.statistics.deviceCount) ? obj.statistics.deviceCount : 0;
            if (!_.isUndefined(obj.statistics.groupIds)) {
                groupedPackages[obj.packageId.name].groupIds = _.union(groupedPackages[obj.packageId.name].groupIds, obj.statistics.groupIds);
            }
            groupedPackages[obj.packageId.name].versions.push(this.blacklist[index]);
        });
        _.each(groupedPackages, (obj, index) => {
            groupedPackages[index].versions = _.sortBy(obj.versions, (version) => {
                return version.statistics.deviceCount;
            }).reverse();
        });
        groupedPackages = _.sortBy(groupedPackages, (version) => {
            return version.deviceCount;
        }).reverse();
        this.preparedBlacklist = groupedPackages;
    }

    _resetBlacklistActions() {
        resetAsync(this.packagesOneBlacklistedFetchAsync);
        resetAsync(this.packagesBlacklistAsync);
        resetAsync(this.packagesUpdateBlacklistedAsync);
        resetAsync(this.packagesRemoveFromBlacklistAsync);
        resetAsync(this.packagesAffectedDevicesCountFetchAsync);
        this.blacklistedPackage = {};
        this.affectedDevicesCount = {};
    }

    _reset() {
        resetAsync(this.directorRepoExistsFetchAsync);
        resetAsync(this.tufRepoExistsFetchAsync);
        resetAsync(this.packagesFetchAsync);
        resetAsync(this.packagesCreateAsync);
        resetAsync(this.packagesTufCreateAsync);
        resetAsync(this.packagesUpdateDetailsAsync);
        resetAsync(this.packagesBlacklistFetchAsync);
        resetAsync(this.packagesOneBlacklistedFetchAsync);
        resetAsync(this.packagesBlacklistAsync);
        resetAsync(this.packagesUpdateBlacklistedAsync);
        resetAsync(this.packagesRemoveFromBlacklistAsync);
        resetAsync(this.packagesAffectedDevicesCountFetchAsync);
        resetAsync(this.packagesForDeviceFetchAsync);
        resetAsync(this.packagesAutoInstalledForDeviceFetchAsync);
        resetAsync(this.packagesDeviceQueueFetchAsync);
        resetAsync(this.packagesDeviceHistoryFetchAsync);
        resetAsync(this.packagesDeviceUpdatesLogsFetchAsync);
        resetAsync(this.packagesDeviceEnableAutoInstallAsync);
        resetAsync(this.packagesDeviceDisableAutoInstallAsync);
        resetAsync(this.packagesDeviceInstallAsync);
        resetAsync(this.packagesDeviceCancelInstallationAsync);
        this.page = null;
        this.initialPackages = [];
        this.packages = [];
        this.overallPackagesCount = null;
        this.preparedPackages = {};
        this.preparedPackagesPerDevice = {};
        this.packagesFilter = null;
        this.packagesSort = 'asc';
        this.blacklist = [];
        this.preparedBlacklist = [];
        this.blacklistedPackage = {};
        this.affectedDevicesCount = {};
        this.initialDevicePackages = [];
        this.installedPackagesPerDevice = [];
        this.devicePackages = [];
        this.deviceAutoInstalledPackages = [];
        this.devicePackagesInstalledCount = 0;
        this.devicePackagesQueuedCount = 0;
        this.deviceQueue = [];
        this.deviceHistory = [];
        this.deviceHistoryPerDevice = [];
        this.deviceUpdatesLogs = [];
        this.ondevicePackages = [];
        this.ondevicePackagesCurrentPage = 0;
        this.ondevicePackagesTotalCount = 0;
        this.ondeviceFilter = '';
        this.activeDeviceId = null;
    }

    _resetWizard() {
        resetAsync(this.packagesFetchAsync);
        this.packages = [];
        this.overallPackagesCount = null;
        this.preparedPackages = [];
    }

    _addPackage(data) {
        if (_.filter(this.packages, function(o) { return ((o.id.version == data.packageId.version) && (o.id.name == data.packageId.name)); }).length <= 0) {
            data.isBlackListed = false;
            data.id = data.packageId;
            delete data.packageId;
            this.packages.push(data);
            switch (this.page) {
                case 'device':
                    this._prepareDevicePackages();
                    break;
                default:
                    this._preparePackages();
                    break;
            }
            this.overallPackagesCount++;
        }
    }

    _addTufPackage(data) {
        let name = null;
        let version = null;
        if(data.custom) {
            name = data.custom.name.value;
            version = data.custom.version.value;
        } else {
            name = data.filename;
            version = data.checksum.hash;
        }
        let formattedData = {
            description: '',
            id: {
                name: name,
                version: version
            },
            isBlackListed: false,
            inDirector: true,
            namespace: data.namespace,
            signature: null,
            timestamp: null,
            vendor: null
        }
        this.packages.push(formattedData);
        switch (this.page) {
            case 'device':
                this._prepareDevicePackages();
                break;
            default:
                this._preparePackages();
                break;
        }
        this.overallPackagesCount++;
    }

    _blacklistPackage(data) {
        var formattedData = {
            name: data.packageId.name,
            version: data.packageId.version,
        }
        let foundPackage = this._getPackage(formattedData);
        if(foundPackage) {
            foundPackage.isBlackListed = true;
        }
        const foundOndevicePackage = _.find(this.ondevicePackages, (ondevicePackage) => {
            return ondevicePackage.name === data.packageId.name && ondevicePackage.version === data.packageId.version;
        });

        if(foundOndevicePackage) {
            foundOndevicePackage.isBlackListed = true;
        }
        this.fetchBlacklist();
    }

    _removePackageFromBlacklist(data) {
        var foundPackage = this._getPackage(data);
        if (foundPackage) {
            foundPackage.isBlackListed = false;
            foundPackage.blacklistComment = '';
        }
        const foundOndevicePackage = _.find(this.ondevicePackages, (ondevicePackage) => {
            return ondevicePackage.name === data.name && ondevicePackage.version === data.version;
        });
        if(foundOndevicePackage) {
            foundOndevicePackage.isBlackListed = false;
        }
        this.fetchBlacklist();
    }

    @computed
    get packagesCount() {
        return this.packages.length;
    }

    @computed
    get lastPackages() {
        return _.sortBy(this.initialPackages, function(pack) {
            return pack.createdAt;
        }).reverse().slice(0, 10);
    }

    @computed
    get blacklistCount() {
        return this.blacklist.length;
    }

    @computed
    get uniqueGroupsCount() {
        let groups = [];
        _.each(this.blacklist, (obj, index) => {
            groups = _.union(obj.statistics.groupIds, groups);
        })
        return groups.length;
    }
}
