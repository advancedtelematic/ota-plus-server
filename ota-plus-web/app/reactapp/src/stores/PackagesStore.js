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
    API_PACKAGES_DIRECTOR_DEVICE_HISTORY,
    API_PACKAGES_DEVICE_UPDATES_LOGS,
    API_PACKAGES_DEVICE_AUTO_INSTALL,
    API_PACKAGES_DEVICE_INSTALL,
    API_PACKAGES_DEVICE_CANCEL_INSTALLATION,
    API_CREATE_TUF_REPO,
    API_CHECK_TUF_REPO,
    API_CREATE_DIRECTOR_REPO,
    API_CHECK_DIRECTOR_REPO,
    API_PACKAGES_DIRECTOR_DEVICE_AUTO_INSTALL,
    API_PACKAGES_COUNT_INSTALLED_ECUS,
    API_PACKAGES_DEVICE_CANCEL_MTU_UPDATE,
    API_PACKAGES_COMMENTS
} from '../config';
import { resetAsync, handleAsyncSuccess, handleAsyncError } from '../utils/Common';
import _ from 'underscore';

export default class PackagesStore {
    @observable directorRepoExistsFetchAsync = {};
    @observable packagesDeleteAsync = {};
    @observable packageVersionDeleteAsync = {};
    @observable directorRepoCreateFetchAsync = {};
    @observable tufRepoExistsFetchAsync = {};
    @observable tufRepoCreateFetchAsync = {};
    
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

    constructor() {
        resetAsync(this.directorRepoExistsFetchAsync);
        resetAsync(this.packagesDeleteAsync);
        resetAsync(this.packageVersionDeleteAsync);
        resetAsync(this.directorRepoCreateFetchAsync);
        resetAsync(this.tufRepoExistsFetchAsync);
        resetAsync(this.tufRepoCreateFetchAsync);
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

    deletePackage(name) {
        resetAsync(this.packagesDeleteAsync, true);
        const that = this;
        return new Promise(function(resolve, reject) {
            setTimeout(() => {
                if(localStorage.getItem('deletedPackages')) {
                    let deletedPackageNames = JSON.parse(localStorage.getItem('deletedPackages'));
                    if(!_.contains(deletedPackageNames, name)) {
                        deletedPackageNames.push(name);
                        localStorage.setItem('deletedPackages', JSON.stringify(deletedPackageNames));                        
                    }
                } else {
                    localStorage.setItem('deletedPackages', JSON.stringify([name]));
                }
                that._removePackage(name);
                that.packagesDeleteAsync = handleAsyncSuccess({});
                resolve();
            }, 500);
        });
    }

    deleteVersion(version) {
        resetAsync(this.packageVersionDeleteAsync, true);
            const that = this;
            return new Promise(function(resolve, reject) {
                setTimeout(() => {
                    if(localStorage.getItem('deletedVersions')) {
                        let deletedVersions = JSON.parse(localStorage.getItem('deletedVersions'));
                        if(!_.contains(deletedVersions, version)) {
                            deletedVersions.push(version);
                            localStorage.setItem('deletedVersions', JSON.stringify(deletedVersions));                        
                        }
                    } else {
                        localStorage.setItem('deletedVersions', JSON.stringify([version]));
                    }
                    that._removeVersion(version);
                    that.packageVersionDeleteAsync = handleAsyncSuccess({});
                    resolve();
                }, 500);
        });
    }

    _removePackage(name) {
        this.packages = _.filter(this.packages, pack => pack.id.name !== name);
        this._preparePackages();
    }

    _removeVersion(version) {
        this.packages = _.filter(this.packages, pack => pack.id.version !== version);
        this._preparePackages();
    }

    fetchDirectorRepoExists() {
        resetAsync(this.directorRepoExistsFetchAsync, true);
        return axios.get(API_CHECK_DIRECTOR_REPO)
            .then(function(response) {
                this.directorRepoExistsFetchAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function(error) {
                this.directorRepoExistsFetchAsync = handleAsyncError(error);
            }.bind(this));
    }

    createDirectorRepo() {
        resetAsync(this.directorRepoCreateFetchAsync, true);
        return axios.post(API_CREATE_DIRECTOR_REPO)
            .then(function(response) {
                this.directorRepoCreateFetchAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function(error) {
                this.directorRepoCreateFetchAsync = handleAsyncError(error);
            }.bind(this));
    }

    fetchTufRepoExists() {
        resetAsync(this.tufRepoExistsFetchAsync, true);
        return axios.get(API_CHECK_TUF_REPO)
            .then(function(response) {
                this.tufRepoExistsFetchAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function(error) {
                this.tufRepoExistsFetchAsync = handleAsyncError(error);
            }.bind(this));
    }

    createTufRepo() {
        resetAsync(this.tufRepoCreateFetchAsync, true);
        return axios.post(API_CREATE_TUF_REPO)
            .then(function(response) {
                this.tufRepoCreateFetchAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function(error) {
                this.tufRepoCreateFetchAsync = handleAsyncError(error);
            }.bind(this));
    }

    fetchComments() {
        resetAsync(this.commentsFetchAsync, true);
        return axios.get(API_PACKAGES_COMMENTS)
            .then(function(response) {
                this._prepareComments(response.data);
            }.bind(this))
            .catch(function(error) {
                this.commentsFetchAsync = handleAsyncError(error);
            }.bind(this));
    }

    updateComment(filepath, data) {
        return axios.put(`${API_PACKAGES_COMMENTS}/${filepath}`, {"comment": data})
            .then(function(response) {
                this._updatePackageComment(filepath, data);
            }.bind(this))
            .catch(function(error) {
                this.commentUpdateAsync = handleAsyncError(error);
            }.bind(this));
    }

    fetchPackages(async = 'packagesFetchAsync') {
        let that = this;
        resetAsync(that[async], true);
        return axios.get(API_TUF_PACKAGES)
            .then(function(response) {
                let packages = response.data.signed.targets;
                that._formatPackages(packages);
                let filepaths = that._getFilepaths();
                axios.post(API_PACKAGES_COUNT_INSTALLED_ECUS, filepaths)
                    .then(function(resp) {
                        that._prepareFilePaths(resp.data);
                        switch (that.page) {
                            case 'device':                        
                                that._prepareDevicePackages();
                                break;
                            default:
                                that._preparePackages();
                                break;
                        }
                        that[async] = handleAsyncSuccess(response);
                    })
                    .catch(function(e) {
                        switch (that.page) {
                            case 'device':                        
                                that._prepareDevicePackages();
                                break;
                            default:
                                that._preparePackages();
                                break;
                        }
                        that[async] = handleAsyncSuccess(response);
                    });
            })
            .catch(function(error) {
                that[async] = handleAsyncError(error);
            });
    }

    _getFilepaths() {
        return {
            filepaths: this.packages.map(function(pack) { return pack.filepath; })
        }
    }

    _prepareFilePaths(filepaths) {
        _.each(this.packages, (pack, index) => {
            _.each(filepaths, (installedOn, filepath) => {
                if(pack.filepath === filepath) {                    
                    pack.installedOnEcus = installedOn;
                }
            });
        });
    }

    _prepareComments(comments) {
       _.each(this.packages, pack => {
           _.each(comments, obj => {
               if (obj.filename === pack.filepath) {
                   pack.comment = obj.comment;
               }
           })
       });
    }

    _formatPackages(packages) {
        let packs = [];
        _.each(packages, (pack, filepath) => {
            let formattedPack = {
                customExists: pack.custom ? true : false,
                packageHash: pack.hashes.sha256,
                filepath: filepath,
                createdAt: pack.custom ? pack.custom.createdAt : null,
                updatedAt: pack.custom ? pack.custom.updatedAt : null,
                description: pack.hashes.sha256,
                targetFormat: pack.custom ? pack.custom.targetFormat : 'OSTREE',
                targetLength: pack.length,
                id: {
                    name: pack.custom ? pack.custom.name : filepath,
                    version: pack.custom ? pack.custom.version : pack.hashes.sha256
                },
                installedOnEcus: 0,
                isBlackListed: false,
                namespace: null,
                signature: null,
                size: 0,
                uri: {
                    uri: null
                },
                uuid: pack.hashes.sha256,
                hardwareIds: pack.custom ? pack.custom.hardwareIds : [],
                comment: 'No comment'
            };
            packs.push(formattedPack);
        });

        let deletedPackageNames = JSON.parse(localStorage.getItem('deletedPackages'));
        let deletedVersions = JSON.parse(localStorage.getItem('deletedVersions'));
        this.packages =  _.filter(packs, pack => !_.contains(deletedPackageNames, pack.id.name) && !_.contains(deletedVersions, pack.id.version));
    }

    _updatePackageComment(filepath, comment) {
        let result = _.find(this.packages, pack => pack.filepath === filepath);
        result.comment = comment;
    }

    _packageURI(entryName, name, version, hardwareIds) {
        return API_UPLOAD_TUF_PACKAGE + '/' + entryName + '?name=' + encodeURIComponent(name) + '&version=' + encodeURIComponent(version) + '&hardwareIds=' + hardwareIds;
    }

    createPackage(data, formData, hardwareIds) {
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
                this._packageURI(entryName, data.packageName, data.version, hardwareIds),
                formData,
                config)
            .then(function(response) {
                uploadObj.status = 'success';
                this.packagesCreateAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function(error) {
                uploadObj.status = 'error';
                this.packagesCreateAsync = handleAsyncError(error);
            }.bind(this));
        uploadObj.source = source;
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
                                    this._preparePackages(this.packagesSort, true);
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
                            this._preparePackages(this.packagesSort, true);
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
                this.fetchBlacklist();
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
                this.fetchBlacklist();
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

    fetchAutoInstalledPackages(deviceId, ecuSerial) {
        resetAsync(this.packagesAutoInstalledFetchAsync, true);
        return axios.get(API_PACKAGES_DIRECTOR_DEVICE_AUTO_INSTALL + '/' + deviceId + '/ecus/' + ecuSerial + '/auto_update')
            .then(function(response) {
                this.autoInstalledPackages = response.data;
                switch (this.page) {
                    case 'device':
                        this._prepareDevicePackages();
                        break;
                    default:
                        break;
                }
                this.packagesAutoInstalledFetchAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function(error) {
                this.packagesAutoInstalledFetchAsync = handleAsyncError(error);
            }.bind(this));
    }

    fetchPackagesHistory(id, filter = '', fetchFirstItems = false) {
        resetAsync(this.packagesHistoryFetchAsync, true);
        if(this.packagesHistoryFilter !== filter || fetchFirstItems) {
            this.packagesHistoryTotalCount = null;
            this.packagesHistoryCurrentPage = 0;
        }
        this.packagesHistoryFilter = filter;
        return axios.get(API_PACKAGES_DIRECTOR_DEVICE_HISTORY + '/' + id + '?limit=' + this.packagesHistoryLimit + 
            '&offset=' + this.packagesHistoryCurrentPage * this.packagesHistoryLimit)
            .then(function(response) {
                let data = response.data.values;
                this.packagesHistory = _.uniq(this.packagesHistory.concat(data), item => item.updateId);
                this.packagesHistoryCurrentPage++;
                this.packagesHistoryTotalCount = response.data.total;
                this._preparePackagesHistory();
                this.packagesHistoryFetchAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function(error) {
                this.packagesHistoryFetchAsync = handleAsyncError(error);
            }.bind(this));
    }

    _preparePackagesHistory() {
        this.packagesHistory = _.sortBy(this.packagesHistory, (pack) => {
            return pack.receivedAt;
        }).reverse();
    }

    enablePackageAutoInstall(targetName, deviceId, ecuSerial) {
        resetAsync(this.packagesEnableAutoInstallAsync, true);
        return axios.put(API_PACKAGES_DIRECTOR_DEVICE_AUTO_INSTALL + '/' + deviceId + '/ecus/' + ecuSerial + '/auto_update/' + targetName)
            .then(function(response) {
                this.fetchAutoInstalledPackages(deviceId, ecuSerial);
                this.packagesEnableAutoInstallAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function(error) {
                this.packagesEnableAutoInstallAsync = handleAsyncError(error);
            }.bind(this));
    }

    disablePackageAutoInstall(packageName, deviceId, ecuSerial) {
        resetAsync(this.packagesDisableAutoInstallAsync, true);
        return axios.delete(API_PACKAGES_DIRECTOR_DEVICE_AUTO_INSTALL + '/' + deviceId + '/ecus/' + ecuSerial + '/auto_update/' + packageName)
            .then(function(response) {
                this.fetchAutoInstalledPackages(deviceId, ecuSerial);
                this.packagesDisableAutoInstallAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function(error) {
                this.packagesDisableAutoInstallAsync = handleAsyncError(error);
            }.bind(this));
    }

    _getPackage(data) {
        return _.find(this.packages, (pack) => {
            return pack.id.name === data.name && pack.id.version === data.version;
        });
    }

    _getInstalledPackage(filepath, hardwareId) {
        let filteredPacks = _.filter(this.packages, (pack) => {
            return _.contains(pack.hardwareIds, hardwareId) ? pack : null;
        });
        let result = _.find(filteredPacks, (pack) => {            
            return pack.filepath === filepath;
        });
        if(result) {
            result.isInstalled = true;
            return result;
        } else {
            return this._getReportedPackage(filepath, hardwareId);
        }
    }

    _getReportedPackage(filepath, hardwareId) {
        let result = _.find(this.packages, (pack) => {            
            return pack.filepath === filepath;
        });
        if(result) {
            result.isInstalled = true;
            return result;
        }
        return null;
    }

    _preparePackages(packagesSort = this.packagesSort, isFromBlacklistRequest = false) {
        let packages = this.packages;
        let groupedPackages = {};
        let sortedPackages = {};
        this.packagesSort = packagesSort;        
        _.each(packages, (obj, index) => {
            if (_.isUndefined(groupedPackages[obj.id.name]) || !groupedPackages[obj.id.name] instanceof Array) {
                groupedPackages[obj.id.name] = new Object();
                groupedPackages[obj.id.name].versions = [];
                groupedPackages[obj.id.name].packageName = obj.id.name;
            }
            groupedPackages[obj.id.name].versions.push(obj);
        }, this);
        _.each(groupedPackages, (obj, index) => {
            groupedPackages[index].versions = _.sortBy(obj.versions, (pack) => {
                return pack.createdAt;
            }).reverse();
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
            const autoInstalledPackages = this.autoInstalledPackages;
            const blacklist = this.blacklist;
            let groupedPackages = {};
            let sortedPackages = {};
            let parsedBlacklist = [];

            _.each(blacklist, (pack) => {
                parsedBlacklist[pack.packageId.name + '-' + pack.packageId.version] = {
                    isBlackListed: true,
                    comment: pack.comment
                };
            });

            _.each(packages, (packInstalled) => {
                if(!_.isUndefined(parsedBlacklist[packInstalled.id.name + '-' + packInstalled.id.version])) {
                    packInstalled.isBlackListed = true;
                }
                if(autoInstalledPackages.indexOf(packInstalled.id.name) > -1)
                    packInstalled.isAutoInstallEnabled = true;
            });

            _.each(packages, (pack, index) => {
                if(_.isUndefined(groupedPackages[pack.id.name]) || !groupedPackages[pack.id.name] instanceof Object ) {
                    groupedPackages[pack.id.name] = {
                        versions: [],
                        packageName: pack.id.name,
                        hardwareIds: pack.hardwareIds,
                        isBlackListed: pack.isBlackListed,
                        isAutoInstallEnabled: pack.isAutoInstallEnabled
                    };
                }
                groupedPackages[pack.id.name].versions.push(pack);
            });
            _.each(groupedPackages, (pack, index) => {
                groupedPackages[index].versions = _.sortBy(pack.versions, (element) => {
                    return element.createdAt;
                }).reverse();
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
        } else {
            this.preparedPackages = [];           
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
        let sortedPackages = {};
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

        groupedPackages.sort();

        let specialGroup = {'#' : []};
        _.each(groupedPackages, (pack, key) => {
            let firstLetter = pack.packageName.charAt(0).toUpperCase();

            firstLetter = firstLetter.match(/[A-Z]/) ? firstLetter : '#';
            if(firstLetter != '#' && _.isUndefined(sortedPackages[firstLetter]) || !sortedPackages[firstLetter] instanceof Array ) {
                sortedPackages[firstLetter] = [];
            }
            if(firstLetter != '#')
                sortedPackages[firstLetter].push(pack);
            else
                specialGroup['#'].push(pack);
        });
        if(!_.isEmpty(specialGroup['#'])) {
            sortedPackages = Object.assign(specialGroup, sortedPackages);
        }

        this.preparedBlacklist = sortedPackages;
        this.preparedBlacklistRaw = groupedPackages;
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
        resetAsync(this.packagesDeleteAsync);
        resetAsync(this.packageVersionDeleteAsync);
        resetAsync(this.directorRepoCreateFetchAsync);
        resetAsync(this.tufRepoExistsFetchAsync);
        resetAsync(this.tufRepoCreateFetchAsync);
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

    _getAllStorage() {
        var values = [],
            keys = Object.keys(localStorage),
            i = keys.length;
        while ( i-- ) {
            try {
                values.push( JSON.parse(localStorage.getItem(keys[i])) );
            } catch(e) {
            }
        }
        return values;
    }

    _handleCompatibles(compatibilityData = null) {
        let data = this._getAllStorage();
        this.compatibilityData = data;
    }

    _addPackage(pack) {
        let name = pack.custom ? pack.custom.name : pack.filename;
        let version = pack.custom ? pack.custom.version : pack.checksum.hash;
        let hardwareIds = pack.custom ? pack.custom.hardwareIds : [];
        let formattedPack = {
            customExists: pack.custom ? true : false,
            packageHash: pack.checksum.hash,
            filepath: pack.filename,
            createdAt: pack.custom ? pack.custom.createdAt : null,
            updatedAt: pack.custom ? pack.custom.updatedAt : null,
            targetFormat: pack.custom ? pack.custom.targetFormat : 'OSTREE',
            targetLength: pack.length,
            hardwareIds: hardwareIds,
            description: pack.checksum.hash,
            id: {
                name: name,
                version: version
            },
            installedOnEcus: 0,
            isBlackListed: false,
            namespace: pack.namespace,
            signature: null,
            timestamp: null,
            vendor: null,
            comment: 'Default comment'
        };
        let found = _.find(this.packages, (pack) => {
            return pack.id.name === name && pack.id.version === version;
        });
        if(found) {
            found.hardwareIds = hardwareIds;
        } else {
            this.packages.push(formattedPack);
        }
        switch (this.page) {
            case 'device':
                this._prepareDevicePackages();
                break;
            default:
                this._preparePackages();
                break;
        }
    }

    @computed
    get packagesCount() {
        return Object.keys(_.groupBy(this.packages, pack => pack.id.name)).length;
    }

    @computed
    get lastPackages() {
        return _.sortBy(this.packages, function(pack) {
            return pack.createdAt;
        }).reverse().slice(0, 10);
    }

    @computed
    get blacklistCount() {
        return this.blacklist.length;
    }
}
