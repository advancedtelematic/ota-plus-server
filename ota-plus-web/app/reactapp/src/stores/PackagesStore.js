import { observable, computed } from 'mobx';
import axios from 'axios';
import {
    API_PACKAGES_SEARCH,
    API_PACKAGES_PACKAGE_DETAILS,
    API_PACKAGES_CREATE,
    API_PACKAGES_UPDATE_DETAILS,
    API_PACKAGES_BLACKLIST_FETCH,
    API_PACKAGES_PACKAGE_STATS,
    API_PACKAGES_REAL_PACKAGE_STATS,
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
} from '../config';
import { resetAsync, handleAsyncSuccess, handleAsyncError } from '../utils/Common';
import _ from 'underscore';

export default class PackagesStore {

    @observable packagesFetchAsync = {};
    @observable packageStatisticsFetchAsync = {};
    @observable packagesCreateAsync = {};
    @observable packagesUpdateDetailsAsync = {};
    @observable packagesBlacklistFetchAsync = {};
    @observable packagesOneBlacklistedFetchAsync = {};
    @observable packagesBlacklistAsync = {};
    @observable packagesUpdateBlacklistedAsync = {};
    @observable packagesRemoveFromBlacklistAsync = {};
    @observable packagesAffectedDevicesCountFetchAsync = {};
    @observable packagesForDeviceFetchAsync = {};
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
    @observable packages = [];
    @observable packageStats = [];
    @observable overallPackagesCount = null;
    @observable preparedPackages = {};
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
    @observable devicePackages = [];
    @observable deviceAutoInstalledPackages = [];
    @observable devicePackagesInstalledCount = 0;
    @observable devicePackagesQueuedCount = 0;
    @observable deviceQueue = [];
    @observable deviceHistory = [];
    @observable deviceUpdatesLogs = [];

    constructor() {
        resetAsync(this.packagesFetchAsync);
        resetAsync(this.packageStatisticsFetchAsync);
        resetAsync(this.packagesCreateAsync);
        resetAsync(this.packagesUpdateDetailsAsync);
        resetAsync(this.packagesBlacklistFetchAsync);
        resetAsync(this.packagesOneBlacklistedFetchAsync);
        resetAsync(this.packagesBlacklistAsync);
        resetAsync(this.packagesUpdateBlacklistedAsync);
        resetAsync(this.packagesRemoveFromBlacklistAsync);
        resetAsync(this.packagesAffectedDevicesCountFetchAsync);
        resetAsync(this.packagesForDeviceFetchAsync);
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

    fetchPackages(filter = this.packagesFilter) {
        this.packagesFilter = filter;
        resetAsync(this.packagesFetchAsync, true);
        return axios.get(API_PACKAGES_SEARCH + '?regex=' + (filter ? filter : ''))
            .then(function(response) {
                this.packages = response.data;
                switch (this.page) {
                    case 'device':
                        this._prepareDevicePackages();
                        break;
                    default:
                        this._preparePackages();
                        break;
                }
                if (this.overallPackagesCount === null) {
                    this.overallPackagesCount = response.data.length;
                }
                this.packagesFetchAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function(error) {
                this.packagesFetchAsync = handleAsyncError(error);
            }.bind(this));
    }

    fetchPackageStatistics(packageName) {
        resetAsync(this.packageStatisticsFetchAsync, true);
        return axios.get(API_PACKAGES_REAL_PACKAGE_STATS + '/' + packageName)
            .then(function(response) {
                let packageStats = response.data;
                let formattedPackageStatsData = [];

                if (packageStats.values.length) {
                    let after = _.after(packageStats.values.length, () => {
                        this.packageStats = formattedPackageStatsData;
                        this.packageStatisticsFetchAsync = handleAsyncSuccess(response);
                    }, this);
                    _.each(packageStats.values, (statistics, index) => {
                        let packageVersion = statistics.packageVersion;
                        axios.get(API_PACKAGES_PACKAGE_STATS + '/' + packageName + '/' + packageVersion)
                            .then(function(response) {
                                formattedPackageStatsData.push({
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
                    this.packageStats = formattedPackageStatsData;
                    this.packageStatisticsFetchAsync = handleAsyncSuccess(response);
                }

            }.bind(this))
            .catch(function(error) {
                this.packageStatisticsFetchAsync = handleAsyncError(error);
            }.bind(this));
    }

    createPackage(data, formData) {
        resetAsync(this.packagesCreateAsync, true);
        return axios.get(API_PACKAGES_PACKAGE_DETAILS + '/' + data.packageName + '/' + data.version)
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
                const request = axios.put(API_PACKAGES_CREATE + '/' + data.packageName + '/' + data.version + '?description=' + encodeURIComponent(data.description) + '&vendor=' + encodeURIComponent(data.vendor), formData, config)
                    .then(function(response) {
                        uploadObj.status = 'success';
                    }.bind(this))
                    .catch(function(error) {
                        uploadObj.status = 'error';
                    }.bind(this));
                uploadObj.source = source;
            }.bind(this));
    }

    updatePackageDetails(data) {
        resetAsync(this.packagesUpdateDetailsAsync, true);
        return axios.put(API_PACKAGES_UPDATE_DETAILS + '/' + data.name + '/' + data.version + '/info', data.details)
            .then(function(response) {
                this.packagesUpdateDetailsAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function(error) {
                this.packagesUpdateDetailsAsync = handleAsyncError(error);
            }.bind(this));
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
                            axios.get(API_PACKAGES_PACKAGE_STATS + '/' + pack.packageId.name + '/' + pack.packageId.version)
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
                this.fetchBlacklistedPackage({ name: data.packageId.name, version: data.packageId.version });
                this._blacklistPackage(data);
                // console.log('before _prepareBlacklistedPackage');
                // console.log(this.blacklistedPackage);
                // this._prepareBlacklistedPackage(data);
                // console.log('after _prepareBlacklistedPackage');
                // console.log(this.blacklistedPackage);
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
                console.log(data)
                this.fetchBlacklistedPackage({ name: data.packageId.name, version: data.packageId.version });
                // this._prepareBlacklistedPackage(data);
                this.packagesUpdateBlacklistedAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function(error) {
                this.packagesUpdateBlacklistedAsync = handleAsyncError(error);
            }.bind(this));
    }

    _prepareBlacklistedPackage(uuid) {
        this._resetBlacklistedPackage();
        let data = null;
        if(typeof(uuid) !== 'object') {
            let foundPackage = _.find(this.packages, (pack) => {
                return pack.uuid === uuid;
            });
            data = {
                packageId: {
                    name: foundPackage.id.name,
                    version: foundPackage.id.version
                }
            }
        } else {
            data = uuid;
        }
        
        let foundBlacklistedPackage = _.find(this.blacklist, (pack) => {
            return pack.packageId.name === data.packageId.name && pack.packageId.version === data.packageId.version;
        });
        console.log('inside _prepareBlacklistedPackage');
        console.log('foundBlacklistedPackage');
        console.log(foundBlacklistedPackage);

        this.fetchBlacklistedPackage({ name: data.packageId.name, version: data.packageId.version});

        console.log('quit _prepareBlacklistedPackage');
    }

    _resetBlacklistedPackage() {
        console.log('reset');
        this.blacklistedPackage = {};
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
                this.packagesAffectedDevicesCountFetchAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function(error) {
                this.packagesAffectedDevicesCountFetchAsync = handleAsyncError(error);
            }.bind(this));
    }

    fetchDevicePackages(id, filter) {
        resetAsync(this.packagesForDeviceFetchAsync, true);
        //return axios.get(API_PACKAGES_DEVICE_PACKAGES + '/' + id + '/package?regex=' + (filter ? filter : ''))
        return axios.get('http://google.pl')
            .then(function(response) {
                response.data = [{"name":"libapt-pkg4.12","version":"1.0.9.8.1"},{"name":"libgcc-4.8-dev","version":"4.8.4-1"},{"name":"nano","version":"2.2.6-3"},{"name":"libalgorithm-diff-xs-perl","version":"0.04-3+b1"},{"name":"libjbig0","version":"2.1-3.1"},{"name":"libsub-exporter-perl","version":"0.986-1"},{"name":"libgcrypt20","version":"1.6.3-2"},{"name":"xauth","version":"1:1.0.9-1"},{"name":"whois","version":"5.2.7"},{"name":"lsb-base","version":"4.1+Debian13+nmu1"},{"name":"libcairo2","version":"1.14.0-2.1"},{"name":"python2.7-minimal","version":"2.7.9-2"},{"name":"libtext-template-perl","version":"1.46-1"},{"name":"libpaper1","version":"1.1.24+nmu4"},{"name":"ifupdown","version":"0.7.53.1"},{"name":"console-setup-linux","version":"1.123"},{"name":"hostname","version":"3.15"},{"name":"libselinux1","version":"2.3-2"},{"name":"libpcre3","version":"2:8.35-3.3"},{"name":"mlocate","version":"0.26-1"},{"name":"liblwp-protocol-https-perl","version":"6.06-2"},{"name":"libmodule-signature-perl","version":"0.73-1+deb8u2"},{"name":"libtext-soundex-perl","version":"3.4-1+b2"},{"name":"libatomic1","version":"4.9.2-10"},{"name":"libpng12-0","version":"1.2.50-2+b2"},{"name":"libbz2-1.0","version":"1.0.6-7+b3"},{"name":"libpam-modules-bin","version":"1.1.8-3.1"},{"name":"libisccc90","version":"1:9.9.5.dfsg-9+deb8u3"},{"name":"klibc-utils","version":"2.0.4-2"},{"name":"libestr0","version":"0.1.9-1.1"},{"name":"libusb-0.1-4","version":"2:0.1.12-25"},{"name":"libpsl0","version":"0.5.1-1"},{"name":"libacl1","version":"2.2.52-2"},{"name":"libgpgme11","version":"1.5.1-6"},{"name":"libmpfr4","version":"3.1.2-2"},{"name":"libreadline6","version":"6.3-8+b3"},{"name":"libdpkg-perl","version":"1.17.25"},{"name":"libtext-wrapi18n-perl","version":"0.06-7"},{"name":"libcgi-fast-perl","version":"1:2.04-1"},{"name":"libpangoft2-1.0-0","version":"1.36.8-3"},{"name":"python-pygments","version":"2.0.1+dfsg-1.1"},{"name":"libwebpmux1","version":"0.4.1-1.2+b2"},{"name":"libtext-unidecode-perl","version":"1.22-1"},{"name":"openssh-sftp-server","version":"1:6.7p1-5"},{"name":"libxmuu1","version":"2:1.1.2-1"},{"name":"zlib1g-dev","version":"1:1.2.8.dfsg-2+b1"},{"name":"libpod-readme-perl","version":"0.11-1"},{"name":"openssh-server","version":"1:6.7p1-5"},{"name":"liblockfile1","version":"1.09-6"},{"name":"libglib2.0-0","version":"2.42.1-1"},{"name":"isc-dhcp-common","version":"4.3.1-6"},{"name":"docutils-common","version":"0.12+dfsg-1"},{"name":"libclass-c3-perl","version":"0.26-1"},{"name":"systemd","version":"215-17+deb8u2"},{"name":"libss2","version":"1.42.12-1.1"},{"name":"make","version":"4.0-8.1"},{"name":"libxrandr2","version":"2:1.4.2-1+b1"},{"name":"libsub-install-perl","version":"0.928-1"},{"name":"libc6","version":"2.19-18+deb8u1"},{"name":"libasprintf0c2","version":"0.19.3-2"},{"name":"gcc-4.9","version":"4.9.2-10"},{"name":"less","version":"458-3"},{"name":"libhogweed2","version":"2.7.1-5"},{"name":"iputils-ping","version":"3:20121221-5+b2"},{"name":"login","version":"1:4.2-3"},{"name":"xdg-user-dirs","version":"0.15-2"},{"name":"libgtk2.0-0","version":"2.24.25-3"},{"name":"liblwp-mediatypes-perl","version":"6.02-1"},{"name":"keyboard-configuration","version":"1.123"},{"name":"libsemanage-common","version":"2.3-1"},{"name":"libalgorithm-diff-perl","version":"1.19.02-3"},{"name":"libfreetype6","version":"2.5.2-3+deb8u1"},{"name":"libx11-6","version":"2:1.6.2-3"},{"name":"perl-base","version":"5.20.2-3+deb8u1"},{"name":"libpam-runtime","version":"1.1.8-3.1"},{"name":"manpages-dev","version":"3.74-1"},{"name":"libklibc","version":"2.0.4-2"},{"name":"libstdc++6","version":"4.9.2-10"},{"name":"libpaper-utils","version":"1.1.24+nmu4"},{"name":"libcryptsetup4","version":"2:1.6.6-5"},{"name":"libhttp-negotiate-perl","version":"6.00-2"},{"name":"systemd-sysv","version":"215-17+deb8u2"},{"name":"gnupg-agent","version":"2.0.26-6"},{"name":"libassuan0","version":"2.1.2-2"},{"name":"bash","version":"4.3-11+b1"},{"name":"libdata-optlist-perl","version":"0.109-1"},{"name":"libtsan0","version":"4.9.2-10"},{"name":"installation-report","version":"2.58"},{"name":"python-wstools","version":"0.4.3-2"},{"name":"python-defusedxml","version":"0.4.1-2"},{"name":"zlib1g","version":"1:1.2.8.dfsg-2+b1"},{"name":"sensible-utils","version":"0.0.9"},{"name":"liblzma5","version":"5.1.1alpha+20120614-2+b3"},{"name":"shared-mime-info","version":"1.3-1"},{"name":"libisc-export95","version":"1:9.9.5.dfsg-9+deb8u3"},{"name":"libgpm2","version":"1.20.4-6.1+b2"},{"name":"libmount1","version":"2.25.2-6"},{"name":"cpio","version":"2.11+dfsg-4.1"},{"name":"e2fsprogs","version":"1.42.12-1.1"},{"name":"logrotate","version":"3.8.7-1+b1"},{"name":"gettext-base","version":"0.19.3-2"},{"name":"libtokyocabinet9","version":"1.4.48-3"},{"name":"libisc95","version":"1:9.9.5.dfsg-9+deb8u3"},{"name":"traceroute","version":"1:2.0.20-2+b1"},{"name":"util-linux-locales","version":"2.25.2-6"},{"name":"net-tools","version":"1.60-26+b1"},{"name":"libaudit-common","version":"1:2.4-1"},{"name":"libdbus-1-3","version":"1.8.20-0+deb8u1"},{"name":"libnetfilter-acct1","version":"1.0.2-1.1"},{"name":"python-apt-common","version":"0.9.3.12"},{"name":"tasksel-data","version":"3.31+deb8u1"},{"name":"xml-core","version":"0.13+nmu2"},{"name":"mount","version":"2.25.2-6"},{"name":"dbus","version":"1.8.20-0+deb8u1"},{"name":"discover","version":"2.1.2-7"},{"name":"libencode-locale-perl","version":"1.03-1"},{"name":"pinentry-gtk2","version":"0.8.3-2"},{"name":"debconf","version":"1.5.56"},{"name":"usbutils","version":"1:007-2"},{"name":"libssl-doc","version":"1.0.1k-3+deb8u1"},{"name":"python","version":"2.7.9-1"},{"name":"discover-data","version":"2.2013.01.11"},{"name":"libxi6","version":"2:1.7.4-1+b2"},{"name":"libc-bin","version":"2.19-18+deb8u1"},{"name":"openssl","version":"1.0.1k-3+deb8u1"},{"name":"bsdmainutils","version":"9.0.6"},{"name":"libgssapi-krb5-2","version":"1.12.1+dfsg-19"},{"name":"libfcgi-perl","version":"0.77-1+b1"},{"name":"libhttp-message-perl","version":"6.06-1"},{"name":"libio-socket-ip-perl","version":"0.32-1"},{"name":"libpam-modules","version":"1.1.8-3.1"},{"name":"libpython-stdlib","version":"2.7.9-1"},{"name":"acpi-support-base","version":"0.142-6"},{"name":"cpp","version":"4:4.9.2-2"},{"name":"libclass-accessor-perl","version":"0.34-1"},{"name":"dpkg","version":"1.17.25"},{"name":"udev","version":"215-17+deb8u2"},{"name":"libxcursor1","version":"1:1.1.14-1+b1"},{"name":"libavahi-client3","version":"0.6.31-5"},{"name":"bind9-host","version":"1:9.9.5.dfsg-9+deb8u3"},{"name":"libcap-ng0","version":"0.7.4-2"},{"name":"fakeroot","version":"1.20.2-1"},{"name":"xz-utils","version":"5.1.1alpha+20120614-2+b3"},{"name":"libpam0g","version":"1.1.8-3.1"},{"name":"libxml-libxml-perl","version":"2.0116+dfsg-1+deb8u1"},{"name":"libclass-c3-xs-perl","version":"0.13-2+b1"},{"name":"sysvinit-utils","version":"2.88dsf-59"},{"name":"libcap2","version":"1:2.24-8"},{"name":"dash","version":"0.5.7-4+b1"},{"name":"libpython2.7-minimal","version":"2.7.9-2"},{"name":"libpth20","version":"2.0.7-20"},{"name":"insserv","version":"1.14.0-5"},{"name":"liblognorm1","version":"1.0.1-3"},{"name":"tzdata","version":"2015f-0+deb8u1"},{"name":"libatk1.0-0","version":"2.14.0-1"},{"name":"libxcb-render0","version":"1.10-3+b1"},{"name":"libwebpdemux1","version":"0.4.1-1.2+b2"},{"name":"libgtk2.0-common","version":"2.24.25-3"},{"name":"libffi6","version":"3.1-2+b2"},{"name":"wget","version":"1.16-1"},{"name":"libgdk-pixbuf2.0-common","version":"2.31.1-2+deb8u2"},{"name":"libc6-dev","version":"2.19-18+deb8u1"},{"name":"libuuid1","version":"2.25.2-6"},{"name":"libk5crypto3","version":"1.12.1+dfsg-19"},{"name":"liblwres90","version":"1:9.9.5.dfsg-9+deb8u3"},{"name":"librtmp1","version":"2.4+20150115.gita107cef-1"},{"name":"python-reportbug","version":"6.6.3"},{"name":"dnsutils","version":"1:9.9.5.dfsg-9+deb8u3"},{"name":"mime-support","version":"3.58"},{"name":"os-prober","version":"1.65"},{"name":"aptitude-common","version":"0.6.11-1"},{"name":"libgcc1","version":"1:4.9.2-10"},{"name":"libxrender1","version":"1:0.9.8-1+b1"},{"name":"libmodule-pluggable-perl","version":"5.1-1"},{"name":"m4","version":"1.4.17-4"},{"name":"doc-debian","version":"6.2"},{"name":"python-docutils","version":"0.12+dfsg-1"},{"name":"ncurses-base","version":"5.9+20140913-1"},{"name":"apt-listchanges","version":"2.85.13+nmu1"},{"name":"libslang2","version":"2.3.0-2"},{"name":"sysv-rc","version":"2.88dsf-59"},{"name":"libldap-2.4-2","version":"2.4.40+dfsg-1+deb8u1"},{"name":"libgeoip1","version":"1.6.2-4"},{"name":"gcc-4.9-base","version":"4.9.2-10"},{"name":"debianutils","version":"4.4+b1"},{"name":"libsasl2-modules-db","version":"2.1.26.dfsg1-13+deb8u1"},{"name":"wamerican","version":"7.1-1"},{"name":"libthai-data","version":"0.1.21-1"},{"name":"libudev1","version":"215-17+deb8u2"},{"name":"gcc","version":"4:4.9.2-2"},{"name":"initramfs-tools","version":"0.120"},{"name":"libncursesw5","version":"5.9+20140913-1+b1"},{"name":"lsof","version":"4.86+dfsg-1"},{"name":"libatk1.0-data","version":"2.14.0-1"},{"name":"ca-certificates","version":"20141019"},{"name":"libterm-ui-perl","version":"0.42-1"},{"name":"laptop-detect","version":"0.13.7"},{"name":"libfakeroot","version":"1.20.2-1"},{"name":"libsub-name-perl","version":"0.12-1"},{"name":"libglib2.0-data","version":"2.42.1-1"},{"name":"libgraphite2-3","version":"1.2.4-3"},{"name":"whiptail","version":"0.52.17-1+b1"},{"name":"python-debian","version":"0.1.27"},{"name":"dictionaries-common","version":"1.23.17"},{"name":"libpopt0","version":"1.16-10"},{"name":"vim-tiny","version":"2:7.4.488-7"},{"name":"iptables","version":"1.4.21-2+b1"},{"name":"dmsetup","version":"2:1.02.90-2.2"},{"name":"ispell","version":"3.3.02-6"},{"name":"exim4","version":"4.84-8"},{"name":"gnupg2","version":"2.0.26-6"},{"name":"docutils-doc","version":"0.12+dfsg-1"},{"name":"geoip-database","version":"20150317-1"},{"name":"psmisc","version":"22.21-2"},{"name":"libtirpc1","version":"0.2.5-1"},{"name":"libcgi-pm-perl","version":"4.09-1"},{"name":"libhttp-date-perl","version":"6.02-1"},{"name":"kmod","version":"18-3"},{"name":"python-apt","version":"0.9.3.12"},{"name":"multiarch-support","version":"2.19-18+deb8u1"},{"name":"nfacct","version":"1.0.1-1.1"},{"name":"base-files","version":"8+deb8u2"},{"name":"gpgv","version":"1.4.18-7"},{"name":"curl","version":"7.38.0-4+deb8u2"},{"name":"libbind9-90","version":"1:9.9.5.dfsg-9+deb8u3"},{"name":"libxml-sax-expat-perl","version":"0.40-2"},{"name":"libxcb1","version":"1.10-3+b1"},{"name":"libxml2","version":"2.9.1+dfsg1-5"},{"name":"libasan1","version":"4.9.2-10"},{"name":"grub-pc","version":"2.02~beta2-22"},{"name":"libpackage-constants-perl","version":"0.04-1"},{"name":"libdata-section-perl","version":"0.200006-1"},{"name":"libkmod2","version":"18-3"},{"name":"libgomp1","version":"4.9.2-10"},{"name":"libxinerama1","version":"2:1.1.3-1+b1"},{"name":"libhtml-tree-perl","version":"5.03-1"},{"name":"netbase","version":"5.3"},{"name":"sota-client","version":"0.2.16-16-gc38a61a"},{"name":"isc-dhcp-client","version":"4.3.1-6"},{"name":"libmagic1","version":"1:5.22+15-2"},{"name":"sed","version":"4.2.2-4+b1"},{"name":"libtasn1-6","version":"4.2-3+deb8u1"},{"name":"libcloog-isl4","version":"0.18.2-1+b2"},{"name":"libusb-1.0-0","version":"2:1.0.19-1"},{"name":"libnettle4","version":"2.7.1-5"},{"name":"libxau6","version":"1:1.0.8-1"},{"name":"linux-libc-dev","version":"3.16.7-ckt11-1+deb8u5"},{"name":"libtinfo-dev","version":"5.9+20140913-1+b1"},{"name":"xkb-data","version":"2.12-1"},{"name":"libmnl0","version":"1.0.3-5"},{"name":"python2.7","version":"2.7.9-2"},{"name":"libauthen-sasl-perl","version":"2.1600-1"},{"name":"linux-image-amd64","version":"3.16+63"},{"name":"gcc-4.8","version":"4.8.4-1"},{"name":"libwebp5","version":"0.4.1-1.2+b2"},{"name":"libfuse2","version":"2.9.3-15+deb8u1"},{"name":"libsigsegv2","version":"2.10-4+b1"},{"name":"libtinfo5","version":"5.9+20140913-1+b1"},{"name":"task-english","version":"3.31+deb8u1"},{"name":"libxcomposite1","version":"1:0.4.4-1"},{"name":"w3m","version":"0.5.3-19"},{"name":"info","version":"5.2.0.dfsg.1-6"},{"name":"tar","version":"1.27.1-2+b1"},{"name":"texinfo","version":"5.2.0.dfsg.1-6"},{"name":"libharfbuzz0b","version":"0.9.35-2"},{"name":"libaudit1","version":"1:2.4-1+b1"},{"name":"lsb-release","version":"4.1+Debian13+nmu1"},{"name":"python-soappy","version":"0.12.22-1"},{"name":"libfile-fcntllock-perl","version":"0.22-1+b1"},{"name":"libwww-robotrules-perl","version":"6.01-1"},{"name":"iso-codes","version":"3.57-1"},{"name":"libexpat1","version":"2.1.0-6+deb8u1"},{"name":"libcups2","version":"1.7.5-11+deb8u1"},{"name":"libisl10","version":"0.12.2-2"},{"name":"libcurl3","version":"7.38.0-4+deb8u2"},{"name":"libncurses5","version":"5.9+20140913-1+b1"},{"name":"libssh2-1","version":"1.4.3-4.1"},{"name":"liblog-message-simple-perl","version":"0.10-2"},{"name":"libevent-2.0-5","version":"2.0.21-stable-2"},{"name":"gnupg","version":"1.4.18-7"},{"name":"emacsen-common","version":"2.0.8"},{"name":"liblockfile-bin","version":"1.09-6"},{"name":"libfontconfig1","version":"2.11.0-6.3"},{"name":"libcpan-meta-perl","version":"2.142690-1"},{"name":"libirs-export91","version":"1:9.9.5.dfsg-9+deb8u3"},{"name":"gcc-4.8-base","version":"4.8.4-1"},{"name":"liblsan0","version":"4.9.2-10"},{"name":"unzip","version":"6.0-16"},{"name":"libreadline-gplv2-dev","version":"5.2+dfsg-2"},{"name":"patch","version":"2.7.5-1"},{"name":"libxdmcp6","version":"1:1.1.1-1+b1"},{"name":"libparse-debianchangelog-perl","version":"1.2.0-1.1"},{"name":"openssh-client","version":"1:6.7p1-5"},{"name":"libsystemd0","version":"215-17+deb8u2"},{"name":"mawk","version":"1.3.3-17"},{"name":"initscripts","version":"2.88dsf-59"},{"name":"libalgorithm-c3-perl","version":"0.09-1"},{"name":"libkeyutils1","version":"1.5.9-5+b1"},{"name":"libnet-ssleay-perl","version":"1.65-1+b1"},{"name":"man-db","version":"2.7.0.2-5"},{"name":"libpangocairo-1.0-0","version":"1.36.8-3"},{"name":"readline-common","version":"6.3-8"},{"name":"acpi","version":"1.7-1"},{"name":"libx11-data","version":"2:1.6.2-3"},{"name":"libclass-isa-perl","version":"0.36-5"},{"name":"cpp-4.8","version":"4.8.4-1"},{"name":"libsemanage1","version":"2.3-1+b1"},{"name":"liblogging-stdlog0","version":"1.0.4-1"},{"name":"perl-modules","version":"5.20.2-3+deb8u1"},{"name":"libpod-latex-perl","version":"0.61-1"},{"name":"libcurl3-gnutls","version":"7.38.0-4+deb8u2"},{"name":"libboost-iostreams1.55.0","version":"1.55.0+dfsg-3"},{"name":"perl","version":"5.20.2-3+deb8u1"},{"name":"aptitude-doc-en","version":"0.6.11-1"},{"name":"adduser","version":"3.113+nmu3"},{"name":"bc","version":"1.06.95-9"},{"name":"libxtables10","version":"1.4.21-2+b1"},{"name":"passwd","version":"1:4.2-3"},{"name":"libtext-iconv-perl","version":"1.7-5+b2"},{"name":"tcpd","version":"7.6.q-25"},{"name":"sgml-base","version":"1.26+nmu4"},{"name":"libpipeline1","version":"1.4.0-1"},{"name":"libwrap0","version":"7.6.q-25"},{"name":"ucf","version":"3.0030"},{"name":"libhtml-parser-perl","version":"3.71-1+b3"},{"name":"iamerican","version":"3.3.02-6"},{"name":"pciutils","version":"1:3.2.1-3"},{"name":"libmailtools-perl","version":"2.13-1"},{"name":"init-system-helpers","version":"1.22"},{"name":"liburi-perl","version":"1.64-1"},{"name":"ibritish","version":"3.3.02-6"},{"name":"libblkid1","version":"2.25.2-6"},{"name":"python-support","version":"1.0.15"},{"name":"libjson-c2","version":"0.11-4"},{"name":"busybox","version":"1:1.22.0-9+deb8u1"},{"name":"lshw","version":"02.17-1.1"},{"name":"libgtk2.0-bin","version":"2.24.25-3"},{"name":"at","version":"3.1.16-1"},{"name":"dmidecode","version":"2.12-3"},{"name":"diffutils","version":"1:3.3-1+b1"},{"name":"libdevmapper1.02.1","version":"2:1.02.90-2.2"},{"name":"dkms","version":"2.2.0.3-2"},{"name":"ftp","version":"0.17-31"},{"name":"libitm1","version":"4.9.2-10"},{"name":"libasan0","version":"4.8.4-1"},{"name":"libio-html-perl","version":"1.001-1"},{"name":"libubsan0","version":"4.9.2-10"},{"name":"rsyslog","version":"8.4.2-1+deb8u1"},{"name":"libjpeg62-turbo","version":"1:1.3.1-12"},{"name":"libxapian22","version":"1.2.19-1"},{"name":"exim4-config","version":"4.84-8"},{"name":"libedit2","version":"3.1-20140620-2"},{"name":"gzip","version":"1.6-4"},{"name":"coreutils","version":"8.23-4"},{"name":"vim-common","version":"2:7.4.488-7"},{"name":"linux-image-3.16.0-4-amd64","version":"3.16.7-ckt11-1+deb8u5"},{"name":"libc-dev-bin","version":"2.19-18+deb8u1"},{"name":"bsd-mailx","version":"8.1.2-0.20141216cvs-2"},{"name":"libdebconfclient0","version":"0.192"},{"name":"libgnutls-openssl27","version":"3.3.8-6+deb8u3"},{"name":"libreadline5","version":"5.2+dfsg-2"},{"name":"libxfixes3","version":"1:5.0.1-2+b2"},{"name":"libpython2.7-stdlib","version":"2.7.9-2"},{"name":"libswitch-perl","version":"2.17-2"},{"name":"libtext-charwidth-perl","version":"0.04-7+b3"},{"name":"ncurses-bin","version":"5.9+20140913-1+b1"},{"name":"libcilkrts5","version":"4.9.2-10"},{"name":"libapt-inst1.5","version":"1.0.9.8.1"},{"name":"libdns100","version":"1:9.9.5.dfsg-9+deb8u3"},{"name":"libxml-namespacesupport-perl","version":"1.11-1"},{"name":"startpar","version":"0.59-3"},{"name":"liblog-message-perl","version":"0.8-1"},{"name":"libnewt0.52","version":"0.52.17-1+b1"},{"name":"python-debianbts","version":"1.12"},{"name":"libpci3","version":"1:3.2.1-3"},{"name":"libustr-1.0-1","version":"1.0.4-3+b2"},{"name":"acl","version":"2.2.52-2"},{"name":"libperl4-corelibs-perl","version":"0.003-1"},{"name":"reportbug","version":"6.6.3"},{"name":"libgnutls-deb0-28","version":"3.3.8-6+deb8u3"},{"name":"libhttp-daemon-perl","version":"6.01-1"},{"name":"host","version":"1:9.9.5.dfsg-9+deb8u3"},{"name":"libpixman-1-0","version":"0.32.6-3"},{"name":"libmro-compat-perl","version":"0.12-1"},{"name":"libisccfg90","version":"1:9.9.5.dfsg-9+deb8u3"},{"name":"python-pil","version":"2.6.1-2"},{"name":"file","version":"1:5.22+15-2"},{"name":"libgmp10","version":"2:6.0.0+dfsg-6"},{"name":"cpp-4.9","version":"4.9.2-10"},{"name":"fontconfig","version":"2.11.0-6.3"},{"name":"libsmartcols1","version":"2.25.2-6"},{"name":"libsqlite3-0","version":"3.8.7.1-1+deb8u1"},{"name":"apt-utils","version":"1.0.9.8.1"},{"name":"libbsd0","version":"0.7.0-2"},{"name":"groff-base","version":"1.22.2-8"},{"name":"libintl-perl","version":"1.23-1"},{"name":"rpcbind","version":"0.2.1-6+deb8u1"},{"name":"libkrb5support0","version":"1.12.1+dfsg-19"},{"name":"libidn11","version":"1.29-1+b2"},{"name":"manpages","version":"3.74-1"},{"name":"libgc1c2","version":"1:7.2d-6.4"},{"name":"libxml-sax-base-perl","version":"1.07-1"},{"name":"libcomerr2","version":"1.42.12-1.1"},{"name":"libp11-kit0","version":"0.20.7-1"},{"name":"netcat-traditional","version":"1.10-41"},{"name":"util-linux","version":"2.25.2-6"},{"name":"libdatrie1","version":"0.2.8-1"},{"name":"apt","version":"1.0.9.8.1"},{"name":"libhtml-form-perl","version":"6.03-1"},{"name":"libgdk-pixbuf2.0-0","version":"2.31.1-2+deb8u2"},{"name":"install-info","version":"5.2.0.dfsg.1-6"},{"name":"fontconfig-config","version":"2.11.0-6.3"},{"name":"libcap2-bin","version":"1:2.24-8"},{"name":"libthai0","version":"0.1.21-1"},{"name":"libxml-parser-perl","version":"2.41-3"},{"name":"libdb5.3","version":"5.3.28-9"},{"name":"binutils","version":"2.25-5"},{"name":"libsigc++-2.0-0c2a","version":"2.4.0-1"},{"name":"libparams-util-perl","version":"1.07-2+b1"},{"name":"dpkg-dev","version":"1.17.25"},{"name":"findutils","version":"4.4.2-9+b1"},{"name":"libcwidget3","version":"0.5.17-2"},{"name":"libpango-1.0-0","version":"1.36.8-3"},{"name":"procps","version":"2:3.3.9-9"},{"name":"telnet","version":"0.17-36"},{"name":"libarchive-extract-perl","version":"0.72-1"},{"name":"python-chardet","version":"2.3.0-1"},{"name":"libquadmath0","version":"4.9.2-10"},{"name":"fonts-dejavu-core","version":"2.34-1"},{"name":"libxext6","version":"2:1.3.3-1"},{"name":"libavahi-common-data","version":"0.6.31-5"},{"name":"libxdamage1","version":"1:1.1.4-2+b1"},{"name":"grub-common","version":"2.02~beta2-22"},{"name":"grub-pc-bin","version":"2.02~beta2-22"},{"name":"libsasl2-modules","version":"2.1.26.dfsg1-13+deb8u1"},{"name":"libuuid-perl","version":"0.05-1+b1"},{"name":"python-six","version":"1.8.0-1"},{"name":"tasksel","version":"3.31+deb8u1"},{"name":"libhtml-format-perl","version":"2.11-1"},{"name":"libssl1.0.0","version":"1.0.1k-3+deb8u1"},{"name":"bsdutils","version":"1:2.25.2-6"},{"name":"libgpg-error0","version":"1.17-3"},{"name":"nfs-common","version":"1:1.2.8-9"},{"name":"libnet-smtp-ssl-perl","version":"1.01-3"},{"name":"libsasl2-2","version":"2.1.26.dfsg1-13+deb8u1"},{"name":"exim4-base","version":"4.84-8"},{"name":"dc","version":"1.06.95-9"},{"name":"libio-string-perl","version":"1.08-3"},{"name":"locales","version":"2.19-18+deb8u1"},{"name":"libsepol1","version":"2.3-2"},{"name":"debian-faq","version":"5.0.3"},{"name":"bzip2","version":"1.0.6-7+b3"},{"name":"aptitude","version":"0.6.11-1+b1"},{"name":"init","version":"1.22"},{"name":"libfont-afm-perl","version":"1.20-1"},{"name":"iproute2","version":"3.16.0-2"},{"name":"libhttp-cookies-perl","version":"6.01-1"},{"name":"rename","version":"0.20-3"},{"name":"python-minimal","version":"2.7.9-1"},{"name":"exim4-daemon-light","version":"4.84-8"},{"name":"libhtml-tagset-perl","version":"3.20-2"},{"name":"hicolor-icon-theme","version":"0.13-1"},{"name":"libgdbm3","version":"1.8.3-13.1"},{"name":"libnfnetlink0","version":"1.0.1-3"},{"name":"krb5-locales","version":"1.12.1+dfsg-19"},{"name":"libmpc3","version":"1.0.2-1"},{"name":"cron","version":"3.0pl1-127+deb8u1"},{"name":"libdns-export100","version":"1:9.9.5.dfsg-9+deb8u3"},{"name":"procmail","version":"3.22-24"},{"name":"libregexp-common-perl","version":"2013031301-1"},{"name":"libksba8","version":"1.3.2-1"},{"name":"base-passwd","version":"3.5.37"},{"name":"kbd","version":"1.15.5-2"},{"name":"console-setup","version":"1.123"},{"name":"libwww-perl","version":"6.08-1"},{"name":"libxml-sax-perl","version":"0.99+dfsg-2"},{"name":"libtimedate-perl","version":"2.3000-2"},{"name":"libnet-http-perl","version":"6.07-1"},{"name":"libfile-listing-perl","version":"6.04-1"},{"name":"libkrb5-3","version":"1.12.1+dfsg-19"},{"name":"libalgorithm-merge-perl","version":"0.08-2"},{"name":"acpid","version":"1:2.0.23-2"},{"name":"liblcms2-2","version":"2.6-3+b3"},{"name":"liblocale-gettext-perl","version":"1.05-8+b1"},{"name":"libio-socket-ssl-perl","version":"2.002-2+deb8u1"},{"name":"mutt","version":"1.5.23-3"},{"name":"e2fslibs","version":"1.42.12-1.1"},{"name":"sudo","version":"1.8.10p3-1+deb8u2"},{"name":"libxcb-shm0","version":"1.10-3+b1"},{"name":"libjasper1","version":"1.900.1-debian1-2.4"},{"name":"libavahi-common3","version":"0.6.31-5"},{"name":"debconf-i18n","version":"1.5.56"},{"name":"libdiscover2","version":"2.1.2-7"},{"name":"eject","version":"2.1.5+deb1+cvs20081104-13.1"},{"name":"libicu52","version":"52.1-8+deb8u3"},{"name":"libsoftware-license-perl","version":"0.103010-3"},{"name":"libprocps3","version":"2:3.3.9-9"},{"name":"libgcc-4.9-dev","version":"4.9.2-10"},{"name":"ncurses-term","version":"5.9+20140913-1"},{"name":"python-pkg-resources","version":"5.5.1-1"},{"name":"grub2-common","version":"2.02~beta2-22"},{"name":"time","version":"1.7-25"},{"name":"linux-base","version":"3.5"},{"name":"libmodule-build-perl","version":"0.421000-2"},{"name":"ienglish-common","version":"3.3.02-6"},{"name":"python-roman","version":"2.0.0-1"},{"name":"libisccfg-export90","version":"1:9.9.5.dfsg-9+deb8u3"},{"name":"debian-archive-keyring","version":"2014.3"},{"name":"libattr1","version":"1:2.4.47-2"},{"name":"libnfsidmap2","version":"0.25-5"},{"name":"libtiff5","version":"4.0.3-12.3"},{"name":"bash-completion","version":"1:2.1-4"},{"name":"libssl-dev","version":"1.0.1k-3+deb8u1"},{"name":"grep","version":"2.20-4.1"}];
                this.devicePackages = response.data;
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
                console.log(JSON.stringify(error))
                this.packagesForDeviceFetchAsync = handleAsyncError(error);
            }.bind(this));
    }

    fetchOndevicePackages(id, filter) {
        resetAsync(this.packagesOndeviceFetchAsync, true);
        //return axios.get(API_PACKAGES_DEVICE_PACKAGES + '/' + id + '/package?regex=' + (filter ? filter : ''))
        return axios.get('http://google.pl')
            .then(function(response) {
                response.data = [{"name":"libapt-pkg4.12","version":"1.0.9.8.1"},{"name":"libgcc-4.8-dev","version":"4.8.4-1"},{"name":"nano","version":"2.2.6-3"},{"name":"libalgorithm-diff-xs-perl","version":"0.04-3+b1"},{"name":"libjbig0","version":"2.1-3.1"},{"name":"libsub-exporter-perl","version":"0.986-1"},{"name":"libgcrypt20","version":"1.6.3-2"},{"name":"xauth","version":"1:1.0.9-1"},{"name":"whois","version":"5.2.7"},{"name":"lsb-base","version":"4.1+Debian13+nmu1"},{"name":"libcairo2","version":"1.14.0-2.1"},{"name":"python2.7-minimal","version":"2.7.9-2"},{"name":"libtext-template-perl","version":"1.46-1"},{"name":"libpaper1","version":"1.1.24+nmu4"},{"name":"ifupdown","version":"0.7.53.1"},{"name":"console-setup-linux","version":"1.123"},{"name":"hostname","version":"3.15"},{"name":"libselinux1","version":"2.3-2"},{"name":"libpcre3","version":"2:8.35-3.3"},{"name":"mlocate","version":"0.26-1"},{"name":"liblwp-protocol-https-perl","version":"6.06-2"},{"name":"libmodule-signature-perl","version":"0.73-1+deb8u2"},{"name":"libtext-soundex-perl","version":"3.4-1+b2"},{"name":"libatomic1","version":"4.9.2-10"},{"name":"libpng12-0","version":"1.2.50-2+b2"},{"name":"libbz2-1.0","version":"1.0.6-7+b3"},{"name":"libpam-modules-bin","version":"1.1.8-3.1"},{"name":"libisccc90","version":"1:9.9.5.dfsg-9+deb8u3"},{"name":"klibc-utils","version":"2.0.4-2"},{"name":"libestr0","version":"0.1.9-1.1"},{"name":"libusb-0.1-4","version":"2:0.1.12-25"},{"name":"libpsl0","version":"0.5.1-1"},{"name":"libacl1","version":"2.2.52-2"},{"name":"libgpgme11","version":"1.5.1-6"},{"name":"libmpfr4","version":"3.1.2-2"},{"name":"libreadline6","version":"6.3-8+b3"},{"name":"libdpkg-perl","version":"1.17.25"},{"name":"libtext-wrapi18n-perl","version":"0.06-7"},{"name":"libcgi-fast-perl","version":"1:2.04-1"},{"name":"libpangoft2-1.0-0","version":"1.36.8-3"},{"name":"python-pygments","version":"2.0.1+dfsg-1.1"},{"name":"libwebpmux1","version":"0.4.1-1.2+b2"},{"name":"libtext-unidecode-perl","version":"1.22-1"},{"name":"openssh-sftp-server","version":"1:6.7p1-5"},{"name":"libxmuu1","version":"2:1.1.2-1"},{"name":"zlib1g-dev","version":"1:1.2.8.dfsg-2+b1"},{"name":"libpod-readme-perl","version":"0.11-1"},{"name":"openssh-server","version":"1:6.7p1-5"},{"name":"liblockfile1","version":"1.09-6"},{"name":"libglib2.0-0","version":"2.42.1-1"},{"name":"isc-dhcp-common","version":"4.3.1-6"},{"name":"docutils-common","version":"0.12+dfsg-1"},{"name":"libclass-c3-perl","version":"0.26-1"},{"name":"systemd","version":"215-17+deb8u2"},{"name":"libss2","version":"1.42.12-1.1"},{"name":"make","version":"4.0-8.1"},{"name":"libxrandr2","version":"2:1.4.2-1+b1"},{"name":"libsub-install-perl","version":"0.928-1"},{"name":"libc6","version":"2.19-18+deb8u1"},{"name":"libasprintf0c2","version":"0.19.3-2"},{"name":"gcc-4.9","version":"4.9.2-10"},{"name":"less","version":"458-3"},{"name":"libhogweed2","version":"2.7.1-5"},{"name":"iputils-ping","version":"3:20121221-5+b2"},{"name":"login","version":"1:4.2-3"},{"name":"xdg-user-dirs","version":"0.15-2"},{"name":"libgtk2.0-0","version":"2.24.25-3"},{"name":"liblwp-mediatypes-perl","version":"6.02-1"},{"name":"keyboard-configuration","version":"1.123"},{"name":"libsemanage-common","version":"2.3-1"},{"name":"libalgorithm-diff-perl","version":"1.19.02-3"},{"name":"libfreetype6","version":"2.5.2-3+deb8u1"},{"name":"libx11-6","version":"2:1.6.2-3"},{"name":"perl-base","version":"5.20.2-3+deb8u1"},{"name":"libpam-runtime","version":"1.1.8-3.1"},{"name":"manpages-dev","version":"3.74-1"},{"name":"libklibc","version":"2.0.4-2"},{"name":"libstdc++6","version":"4.9.2-10"},{"name":"libpaper-utils","version":"1.1.24+nmu4"},{"name":"libcryptsetup4","version":"2:1.6.6-5"},{"name":"libhttp-negotiate-perl","version":"6.00-2"},{"name":"systemd-sysv","version":"215-17+deb8u2"},{"name":"gnupg-agent","version":"2.0.26-6"},{"name":"libassuan0","version":"2.1.2-2"},{"name":"bash","version":"4.3-11+b1"},{"name":"libdata-optlist-perl","version":"0.109-1"},{"name":"libtsan0","version":"4.9.2-10"},{"name":"installation-report","version":"2.58"},{"name":"python-wstools","version":"0.4.3-2"},{"name":"python-defusedxml","version":"0.4.1-2"},{"name":"zlib1g","version":"1:1.2.8.dfsg-2+b1"},{"name":"sensible-utils","version":"0.0.9"},{"name":"liblzma5","version":"5.1.1alpha+20120614-2+b3"},{"name":"shared-mime-info","version":"1.3-1"},{"name":"libisc-export95","version":"1:9.9.5.dfsg-9+deb8u3"},{"name":"libgpm2","version":"1.20.4-6.1+b2"},{"name":"libmount1","version":"2.25.2-6"},{"name":"cpio","version":"2.11+dfsg-4.1"},{"name":"e2fsprogs","version":"1.42.12-1.1"},{"name":"logrotate","version":"3.8.7-1+b1"},{"name":"gettext-base","version":"0.19.3-2"},{"name":"libtokyocabinet9","version":"1.4.48-3"},{"name":"libisc95","version":"1:9.9.5.dfsg-9+deb8u3"},{"name":"traceroute","version":"1:2.0.20-2+b1"},{"name":"util-linux-locales","version":"2.25.2-6"},{"name":"net-tools","version":"1.60-26+b1"},{"name":"libaudit-common","version":"1:2.4-1"},{"name":"libdbus-1-3","version":"1.8.20-0+deb8u1"},{"name":"libnetfilter-acct1","version":"1.0.2-1.1"},{"name":"python-apt-common","version":"0.9.3.12"},{"name":"tasksel-data","version":"3.31+deb8u1"},{"name":"xml-core","version":"0.13+nmu2"},{"name":"mount","version":"2.25.2-6"},{"name":"dbus","version":"1.8.20-0+deb8u1"},{"name":"discover","version":"2.1.2-7"},{"name":"libencode-locale-perl","version":"1.03-1"},{"name":"pinentry-gtk2","version":"0.8.3-2"},{"name":"debconf","version":"1.5.56"},{"name":"usbutils","version":"1:007-2"},{"name":"libssl-doc","version":"1.0.1k-3+deb8u1"},{"name":"python","version":"2.7.9-1"},{"name":"discover-data","version":"2.2013.01.11"},{"name":"libxi6","version":"2:1.7.4-1+b2"},{"name":"libc-bin","version":"2.19-18+deb8u1"},{"name":"openssl","version":"1.0.1k-3+deb8u1"},{"name":"bsdmainutils","version":"9.0.6"},{"name":"libgssapi-krb5-2","version":"1.12.1+dfsg-19"},{"name":"libfcgi-perl","version":"0.77-1+b1"},{"name":"libhttp-message-perl","version":"6.06-1"},{"name":"libio-socket-ip-perl","version":"0.32-1"},{"name":"libpam-modules","version":"1.1.8-3.1"},{"name":"libpython-stdlib","version":"2.7.9-1"},{"name":"acpi-support-base","version":"0.142-6"},{"name":"cpp","version":"4:4.9.2-2"},{"name":"libclass-accessor-perl","version":"0.34-1"},{"name":"dpkg","version":"1.17.25"},{"name":"udev","version":"215-17+deb8u2"},{"name":"libxcursor1","version":"1:1.1.14-1+b1"},{"name":"libavahi-client3","version":"0.6.31-5"},{"name":"bind9-host","version":"1:9.9.5.dfsg-9+deb8u3"},{"name":"libcap-ng0","version":"0.7.4-2"},{"name":"fakeroot","version":"1.20.2-1"},{"name":"xz-utils","version":"5.1.1alpha+20120614-2+b3"},{"name":"libpam0g","version":"1.1.8-3.1"},{"name":"libxml-libxml-perl","version":"2.0116+dfsg-1+deb8u1"},{"name":"libclass-c3-xs-perl","version":"0.13-2+b1"},{"name":"sysvinit-utils","version":"2.88dsf-59"},{"name":"libcap2","version":"1:2.24-8"},{"name":"dash","version":"0.5.7-4+b1"},{"name":"libpython2.7-minimal","version":"2.7.9-2"},{"name":"libpth20","version":"2.0.7-20"},{"name":"insserv","version":"1.14.0-5"},{"name":"liblognorm1","version":"1.0.1-3"},{"name":"tzdata","version":"2015f-0+deb8u1"},{"name":"libatk1.0-0","version":"2.14.0-1"},{"name":"libxcb-render0","version":"1.10-3+b1"},{"name":"libwebpdemux1","version":"0.4.1-1.2+b2"},{"name":"libgtk2.0-common","version":"2.24.25-3"},{"name":"libffi6","version":"3.1-2+b2"},{"name":"wget","version":"1.16-1"},{"name":"libgdk-pixbuf2.0-common","version":"2.31.1-2+deb8u2"},{"name":"libc6-dev","version":"2.19-18+deb8u1"},{"name":"libuuid1","version":"2.25.2-6"},{"name":"libk5crypto3","version":"1.12.1+dfsg-19"},{"name":"liblwres90","version":"1:9.9.5.dfsg-9+deb8u3"},{"name":"librtmp1","version":"2.4+20150115.gita107cef-1"},{"name":"python-reportbug","version":"6.6.3"},{"name":"dnsutils","version":"1:9.9.5.dfsg-9+deb8u3"},{"name":"mime-support","version":"3.58"},{"name":"os-prober","version":"1.65"},{"name":"aptitude-common","version":"0.6.11-1"},{"name":"libgcc1","version":"1:4.9.2-10"},{"name":"libxrender1","version":"1:0.9.8-1+b1"},{"name":"libmodule-pluggable-perl","version":"5.1-1"},{"name":"m4","version":"1.4.17-4"},{"name":"doc-debian","version":"6.2"},{"name":"python-docutils","version":"0.12+dfsg-1"},{"name":"ncurses-base","version":"5.9+20140913-1"},{"name":"apt-listchanges","version":"2.85.13+nmu1"},{"name":"libslang2","version":"2.3.0-2"},{"name":"sysv-rc","version":"2.88dsf-59"},{"name":"libldap-2.4-2","version":"2.4.40+dfsg-1+deb8u1"},{"name":"libgeoip1","version":"1.6.2-4"},{"name":"gcc-4.9-base","version":"4.9.2-10"},{"name":"debianutils","version":"4.4+b1"},{"name":"libsasl2-modules-db","version":"2.1.26.dfsg1-13+deb8u1"},{"name":"wamerican","version":"7.1-1"},{"name":"libthai-data","version":"0.1.21-1"},{"name":"libudev1","version":"215-17+deb8u2"},{"name":"gcc","version":"4:4.9.2-2"},{"name":"initramfs-tools","version":"0.120"},{"name":"libncursesw5","version":"5.9+20140913-1+b1"},{"name":"lsof","version":"4.86+dfsg-1"},{"name":"libatk1.0-data","version":"2.14.0-1"},{"name":"ca-certificates","version":"20141019"},{"name":"libterm-ui-perl","version":"0.42-1"},{"name":"laptop-detect","version":"0.13.7"},{"name":"libfakeroot","version":"1.20.2-1"},{"name":"libsub-name-perl","version":"0.12-1"},{"name":"libglib2.0-data","version":"2.42.1-1"},{"name":"libgraphite2-3","version":"1.2.4-3"},{"name":"whiptail","version":"0.52.17-1+b1"},{"name":"python-debian","version":"0.1.27"},{"name":"dictionaries-common","version":"1.23.17"},{"name":"libpopt0","version":"1.16-10"},{"name":"vim-tiny","version":"2:7.4.488-7"},{"name":"iptables","version":"1.4.21-2+b1"},{"name":"dmsetup","version":"2:1.02.90-2.2"},{"name":"ispell","version":"3.3.02-6"},{"name":"exim4","version":"4.84-8"},{"name":"gnupg2","version":"2.0.26-6"},{"name":"docutils-doc","version":"0.12+dfsg-1"},{"name":"geoip-database","version":"20150317-1"},{"name":"psmisc","version":"22.21-2"},{"name":"libtirpc1","version":"0.2.5-1"},{"name":"libcgi-pm-perl","version":"4.09-1"},{"name":"libhttp-date-perl","version":"6.02-1"},{"name":"kmod","version":"18-3"},{"name":"python-apt","version":"0.9.3.12"},{"name":"multiarch-support","version":"2.19-18+deb8u1"},{"name":"nfacct","version":"1.0.1-1.1"},{"name":"base-files","version":"8+deb8u2"},{"name":"gpgv","version":"1.4.18-7"},{"name":"curl","version":"7.38.0-4+deb8u2"},{"name":"libbind9-90","version":"1:9.9.5.dfsg-9+deb8u3"},{"name":"libxml-sax-expat-perl","version":"0.40-2"},{"name":"libxcb1","version":"1.10-3+b1"},{"name":"libxml2","version":"2.9.1+dfsg1-5"},{"name":"libasan1","version":"4.9.2-10"},{"name":"grub-pc","version":"2.02~beta2-22"},{"name":"libpackage-constants-perl","version":"0.04-1"},{"name":"libdata-section-perl","version":"0.200006-1"},{"name":"libkmod2","version":"18-3"},{"name":"libgomp1","version":"4.9.2-10"},{"name":"libxinerama1","version":"2:1.1.3-1+b1"},{"name":"libhtml-tree-perl","version":"5.03-1"},{"name":"netbase","version":"5.3"},{"name":"sota-client","version":"0.2.16-16-gc38a61a"},{"name":"isc-dhcp-client","version":"4.3.1-6"},{"name":"libmagic1","version":"1:5.22+15-2"},{"name":"sed","version":"4.2.2-4+b1"},{"name":"libtasn1-6","version":"4.2-3+deb8u1"},{"name":"libcloog-isl4","version":"0.18.2-1+b2"},{"name":"libusb-1.0-0","version":"2:1.0.19-1"},{"name":"libnettle4","version":"2.7.1-5"},{"name":"libxau6","version":"1:1.0.8-1"},{"name":"linux-libc-dev","version":"3.16.7-ckt11-1+deb8u5"},{"name":"libtinfo-dev","version":"5.9+20140913-1+b1"},{"name":"xkb-data","version":"2.12-1"},{"name":"libmnl0","version":"1.0.3-5"},{"name":"python2.7","version":"2.7.9-2"},{"name":"libauthen-sasl-perl","version":"2.1600-1"},{"name":"linux-image-amd64","version":"3.16+63"},{"name":"gcc-4.8","version":"4.8.4-1"},{"name":"libwebp5","version":"0.4.1-1.2+b2"},{"name":"libfuse2","version":"2.9.3-15+deb8u1"},{"name":"libsigsegv2","version":"2.10-4+b1"},{"name":"libtinfo5","version":"5.9+20140913-1+b1"},{"name":"task-english","version":"3.31+deb8u1"},{"name":"libxcomposite1","version":"1:0.4.4-1"},{"name":"w3m","version":"0.5.3-19"},{"name":"info","version":"5.2.0.dfsg.1-6"},{"name":"tar","version":"1.27.1-2+b1"},{"name":"texinfo","version":"5.2.0.dfsg.1-6"},{"name":"libharfbuzz0b","version":"0.9.35-2"},{"name":"libaudit1","version":"1:2.4-1+b1"},{"name":"lsb-release","version":"4.1+Debian13+nmu1"},{"name":"python-soappy","version":"0.12.22-1"},{"name":"libfile-fcntllock-perl","version":"0.22-1+b1"},{"name":"libwww-robotrules-perl","version":"6.01-1"},{"name":"iso-codes","version":"3.57-1"},{"name":"libexpat1","version":"2.1.0-6+deb8u1"},{"name":"libcups2","version":"1.7.5-11+deb8u1"},{"name":"libisl10","version":"0.12.2-2"},{"name":"libcurl3","version":"7.38.0-4+deb8u2"},{"name":"libncurses5","version":"5.9+20140913-1+b1"},{"name":"libssh2-1","version":"1.4.3-4.1"},{"name":"liblog-message-simple-perl","version":"0.10-2"},{"name":"libevent-2.0-5","version":"2.0.21-stable-2"},{"name":"gnupg","version":"1.4.18-7"},{"name":"emacsen-common","version":"2.0.8"},{"name":"liblockfile-bin","version":"1.09-6"},{"name":"libfontconfig1","version":"2.11.0-6.3"},{"name":"libcpan-meta-perl","version":"2.142690-1"},{"name":"libirs-export91","version":"1:9.9.5.dfsg-9+deb8u3"},{"name":"gcc-4.8-base","version":"4.8.4-1"},{"name":"liblsan0","version":"4.9.2-10"},{"name":"unzip","version":"6.0-16"},{"name":"libreadline-gplv2-dev","version":"5.2+dfsg-2"},{"name":"patch","version":"2.7.5-1"},{"name":"libxdmcp6","version":"1:1.1.1-1+b1"},{"name":"libparse-debianchangelog-perl","version":"1.2.0-1.1"},{"name":"openssh-client","version":"1:6.7p1-5"},{"name":"libsystemd0","version":"215-17+deb8u2"},{"name":"mawk","version":"1.3.3-17"},{"name":"initscripts","version":"2.88dsf-59"},{"name":"libalgorithm-c3-perl","version":"0.09-1"},{"name":"libkeyutils1","version":"1.5.9-5+b1"},{"name":"libnet-ssleay-perl","version":"1.65-1+b1"},{"name":"man-db","version":"2.7.0.2-5"},{"name":"libpangocairo-1.0-0","version":"1.36.8-3"},{"name":"readline-common","version":"6.3-8"},{"name":"acpi","version":"1.7-1"},{"name":"libx11-data","version":"2:1.6.2-3"},{"name":"libclass-isa-perl","version":"0.36-5"},{"name":"cpp-4.8","version":"4.8.4-1"},{"name":"libsemanage1","version":"2.3-1+b1"},{"name":"liblogging-stdlog0","version":"1.0.4-1"},{"name":"perl-modules","version":"5.20.2-3+deb8u1"},{"name":"libpod-latex-perl","version":"0.61-1"},{"name":"libcurl3-gnutls","version":"7.38.0-4+deb8u2"},{"name":"libboost-iostreams1.55.0","version":"1.55.0+dfsg-3"},{"name":"perl","version":"5.20.2-3+deb8u1"},{"name":"aptitude-doc-en","version":"0.6.11-1"},{"name":"adduser","version":"3.113+nmu3"},{"name":"bc","version":"1.06.95-9"},{"name":"libxtables10","version":"1.4.21-2+b1"},{"name":"passwd","version":"1:4.2-3"},{"name":"libtext-iconv-perl","version":"1.7-5+b2"},{"name":"tcpd","version":"7.6.q-25"},{"name":"sgml-base","version":"1.26+nmu4"},{"name":"libpipeline1","version":"1.4.0-1"},{"name":"libwrap0","version":"7.6.q-25"},{"name":"ucf","version":"3.0030"},{"name":"libhtml-parser-perl","version":"3.71-1+b3"},{"name":"iamerican","version":"3.3.02-6"},{"name":"pciutils","version":"1:3.2.1-3"},{"name":"libmailtools-perl","version":"2.13-1"},{"name":"init-system-helpers","version":"1.22"},{"name":"liburi-perl","version":"1.64-1"},{"name":"ibritish","version":"3.3.02-6"},{"name":"libblkid1","version":"2.25.2-6"},{"name":"python-support","version":"1.0.15"},{"name":"libjson-c2","version":"0.11-4"},{"name":"busybox","version":"1:1.22.0-9+deb8u1"},{"name":"lshw","version":"02.17-1.1"},{"name":"libgtk2.0-bin","version":"2.24.25-3"},{"name":"at","version":"3.1.16-1"},{"name":"dmidecode","version":"2.12-3"},{"name":"diffutils","version":"1:3.3-1+b1"},{"name":"libdevmapper1.02.1","version":"2:1.02.90-2.2"},{"name":"dkms","version":"2.2.0.3-2"},{"name":"ftp","version":"0.17-31"},{"name":"libitm1","version":"4.9.2-10"},{"name":"libasan0","version":"4.8.4-1"},{"name":"libio-html-perl","version":"1.001-1"},{"name":"libubsan0","version":"4.9.2-10"},{"name":"rsyslog","version":"8.4.2-1+deb8u1"},{"name":"libjpeg62-turbo","version":"1:1.3.1-12"},{"name":"libxapian22","version":"1.2.19-1"},{"name":"exim4-config","version":"4.84-8"},{"name":"libedit2","version":"3.1-20140620-2"},{"name":"gzip","version":"1.6-4"},{"name":"coreutils","version":"8.23-4"},{"name":"vim-common","version":"2:7.4.488-7"},{"name":"linux-image-3.16.0-4-amd64","version":"3.16.7-ckt11-1+deb8u5"},{"name":"libc-dev-bin","version":"2.19-18+deb8u1"},{"name":"bsd-mailx","version":"8.1.2-0.20141216cvs-2"},{"name":"libdebconfclient0","version":"0.192"},{"name":"libgnutls-openssl27","version":"3.3.8-6+deb8u3"},{"name":"libreadline5","version":"5.2+dfsg-2"},{"name":"libxfixes3","version":"1:5.0.1-2+b2"},{"name":"libpython2.7-stdlib","version":"2.7.9-2"},{"name":"libswitch-perl","version":"2.17-2"},{"name":"libtext-charwidth-perl","version":"0.04-7+b3"},{"name":"ncurses-bin","version":"5.9+20140913-1+b1"},{"name":"libcilkrts5","version":"4.9.2-10"},{"name":"libapt-inst1.5","version":"1.0.9.8.1"},{"name":"libdns100","version":"1:9.9.5.dfsg-9+deb8u3"},{"name":"libxml-namespacesupport-perl","version":"1.11-1"},{"name":"startpar","version":"0.59-3"},{"name":"liblog-message-perl","version":"0.8-1"},{"name":"libnewt0.52","version":"0.52.17-1+b1"},{"name":"python-debianbts","version":"1.12"},{"name":"libpci3","version":"1:3.2.1-3"},{"name":"libustr-1.0-1","version":"1.0.4-3+b2"},{"name":"acl","version":"2.2.52-2"},{"name":"libperl4-corelibs-perl","version":"0.003-1"},{"name":"reportbug","version":"6.6.3"},{"name":"libgnutls-deb0-28","version":"3.3.8-6+deb8u3"},{"name":"libhttp-daemon-perl","version":"6.01-1"},{"name":"host","version":"1:9.9.5.dfsg-9+deb8u3"},{"name":"libpixman-1-0","version":"0.32.6-3"},{"name":"libmro-compat-perl","version":"0.12-1"},{"name":"libisccfg90","version":"1:9.9.5.dfsg-9+deb8u3"},{"name":"python-pil","version":"2.6.1-2"},{"name":"file","version":"1:5.22+15-2"},{"name":"libgmp10","version":"2:6.0.0+dfsg-6"},{"name":"cpp-4.9","version":"4.9.2-10"},{"name":"fontconfig","version":"2.11.0-6.3"},{"name":"libsmartcols1","version":"2.25.2-6"},{"name":"libsqlite3-0","version":"3.8.7.1-1+deb8u1"},{"name":"apt-utils","version":"1.0.9.8.1"},{"name":"libbsd0","version":"0.7.0-2"},{"name":"groff-base","version":"1.22.2-8"},{"name":"libintl-perl","version":"1.23-1"},{"name":"rpcbind","version":"0.2.1-6+deb8u1"},{"name":"libkrb5support0","version":"1.12.1+dfsg-19"},{"name":"libidn11","version":"1.29-1+b2"},{"name":"manpages","version":"3.74-1"},{"name":"libgc1c2","version":"1:7.2d-6.4"},{"name":"libxml-sax-base-perl","version":"1.07-1"},{"name":"libcomerr2","version":"1.42.12-1.1"},{"name":"libp11-kit0","version":"0.20.7-1"},{"name":"netcat-traditional","version":"1.10-41"},{"name":"util-linux","version":"2.25.2-6"},{"name":"libdatrie1","version":"0.2.8-1"},{"name":"apt","version":"1.0.9.8.1"},{"name":"libhtml-form-perl","version":"6.03-1"},{"name":"libgdk-pixbuf2.0-0","version":"2.31.1-2+deb8u2"},{"name":"install-info","version":"5.2.0.dfsg.1-6"},{"name":"fontconfig-config","version":"2.11.0-6.3"},{"name":"libcap2-bin","version":"1:2.24-8"},{"name":"libthai0","version":"0.1.21-1"},{"name":"libxml-parser-perl","version":"2.41-3"},{"name":"libdb5.3","version":"5.3.28-9"},{"name":"binutils","version":"2.25-5"},{"name":"libsigc++-2.0-0c2a","version":"2.4.0-1"},{"name":"libparams-util-perl","version":"1.07-2+b1"},{"name":"dpkg-dev","version":"1.17.25"},{"name":"findutils","version":"4.4.2-9+b1"},{"name":"libcwidget3","version":"0.5.17-2"},{"name":"libpango-1.0-0","version":"1.36.8-3"},{"name":"procps","version":"2:3.3.9-9"},{"name":"telnet","version":"0.17-36"},{"name":"libarchive-extract-perl","version":"0.72-1"},{"name":"python-chardet","version":"2.3.0-1"},{"name":"libquadmath0","version":"4.9.2-10"},{"name":"fonts-dejavu-core","version":"2.34-1"},{"name":"libxext6","version":"2:1.3.3-1"},{"name":"libavahi-common-data","version":"0.6.31-5"},{"name":"libxdamage1","version":"1:1.1.4-2+b1"},{"name":"grub-common","version":"2.02~beta2-22"},{"name":"grub-pc-bin","version":"2.02~beta2-22"},{"name":"libsasl2-modules","version":"2.1.26.dfsg1-13+deb8u1"},{"name":"libuuid-perl","version":"0.05-1+b1"},{"name":"python-six","version":"1.8.0-1"},{"name":"tasksel","version":"3.31+deb8u1"},{"name":"libhtml-format-perl","version":"2.11-1"},{"name":"libssl1.0.0","version":"1.0.1k-3+deb8u1"},{"name":"bsdutils","version":"1:2.25.2-6"},{"name":"libgpg-error0","version":"1.17-3"},{"name":"nfs-common","version":"1:1.2.8-9"},{"name":"libnet-smtp-ssl-perl","version":"1.01-3"},{"name":"libsasl2-2","version":"2.1.26.dfsg1-13+deb8u1"},{"name":"exim4-base","version":"4.84-8"},{"name":"dc","version":"1.06.95-9"},{"name":"libio-string-perl","version":"1.08-3"},{"name":"locales","version":"2.19-18+deb8u1"},{"name":"libsepol1","version":"2.3-2"},{"name":"debian-faq","version":"5.0.3"},{"name":"bzip2","version":"1.0.6-7+b3"},{"name":"aptitude","version":"0.6.11-1+b1"},{"name":"init","version":"1.22"},{"name":"libfont-afm-perl","version":"1.20-1"},{"name":"iproute2","version":"3.16.0-2"},{"name":"libhttp-cookies-perl","version":"6.01-1"},{"name":"rename","version":"0.20-3"},{"name":"python-minimal","version":"2.7.9-1"},{"name":"exim4-daemon-light","version":"4.84-8"},{"name":"libhtml-tagset-perl","version":"3.20-2"},{"name":"hicolor-icon-theme","version":"0.13-1"},{"name":"libgdbm3","version":"1.8.3-13.1"},{"name":"libnfnetlink0","version":"1.0.1-3"},{"name":"krb5-locales","version":"1.12.1+dfsg-19"},{"name":"libmpc3","version":"1.0.2-1"},{"name":"cron","version":"3.0pl1-127+deb8u1"},{"name":"libdns-export100","version":"1:9.9.5.dfsg-9+deb8u3"},{"name":"procmail","version":"3.22-24"},{"name":"libregexp-common-perl","version":"2013031301-1"},{"name":"libksba8","version":"1.3.2-1"},{"name":"base-passwd","version":"3.5.37"},{"name":"kbd","version":"1.15.5-2"},{"name":"console-setup","version":"1.123"},{"name":"libwww-perl","version":"6.08-1"},{"name":"libxml-sax-perl","version":"0.99+dfsg-2"},{"name":"libtimedate-perl","version":"2.3000-2"},{"name":"libnet-http-perl","version":"6.07-1"},{"name":"libfile-listing-perl","version":"6.04-1"},{"name":"libkrb5-3","version":"1.12.1+dfsg-19"},{"name":"libalgorithm-merge-perl","version":"0.08-2"},{"name":"acpid","version":"1:2.0.23-2"},{"name":"liblcms2-2","version":"2.6-3+b3"},{"name":"liblocale-gettext-perl","version":"1.05-8+b1"},{"name":"libio-socket-ssl-perl","version":"2.002-2+deb8u1"},{"name":"mutt","version":"1.5.23-3"},{"name":"e2fslibs","version":"1.42.12-1.1"},{"name":"sudo","version":"1.8.10p3-1+deb8u2"},{"name":"libxcb-shm0","version":"1.10-3+b1"},{"name":"libjasper1","version":"1.900.1-debian1-2.4"},{"name":"libavahi-common3","version":"0.6.31-5"},{"name":"debconf-i18n","version":"1.5.56"},{"name":"libdiscover2","version":"2.1.2-7"},{"name":"eject","version":"2.1.5+deb1+cvs20081104-13.1"},{"name":"libicu52","version":"52.1-8+deb8u3"},{"name":"libsoftware-license-perl","version":"0.103010-3"},{"name":"libprocps3","version":"2:3.3.9-9"},{"name":"libgcc-4.9-dev","version":"4.9.2-10"},{"name":"ncurses-term","version":"5.9+20140913-1"},{"name":"python-pkg-resources","version":"5.5.1-1"},{"name":"grub2-common","version":"2.02~beta2-22"},{"name":"time","version":"1.7-25"},{"name":"linux-base","version":"3.5"},{"name":"libmodule-build-perl","version":"0.421000-2"},{"name":"ienglish-common","version":"3.3.02-6"},{"name":"python-roman","version":"2.0.0-1"},{"name":"libisccfg-export90","version":"1:9.9.5.dfsg-9+deb8u3"},{"name":"debian-archive-keyring","version":"2014.3"},{"name":"libattr1","version":"1:2.4.47-2"},{"name":"libnfsidmap2","version":"0.25-5"},{"name":"libtiff5","version":"4.0.3-12.3"},{"name":"bash-completion","version":"1:2.1-4"},{"name":"libssl-dev","version":"1.0.1k-3+deb8u1"},{"name":"grep","version":"2.20-4.1"}];
                this.ondevicePackages = response.data;
                switch (this.page) {
                    case 'device':
                        this._prepareOndevicePackages();
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
                this.deviceHistory = response.data;
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
            const installedPackages = this.devicePackages;
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
                parsedBlacklist[pack.packageId.name + '-' + pack.packageId.version] = true;
            });

            _.each(installedPackages, (pack) => {
                installedIds[pack.name + '_' + pack.version] = pack.name + '_' + pack.version;
            });

            _.each(packages, (packInstalled) => {
                if(!_.isUndefined(parsedBlacklist[packInstalled.id.name + '-' + packInstalled.id.version]))
                    packInstalled.isBlackListed = true;
                if(autoInstalledPackages.indexOf(packInstalled.id.name) > -1)
                    packInstalled.isAutoInstallEnabled = true;
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
            this.devicePackagesQueuedCount = queuedCount;
            this.devicePackagesInstalledCount = installedCount;
        } else {
            this.preparedPackages = [];
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
                let newPack = {
                    name: pack.name,
                    version: pack.version,
                    isBlackListed: pack.isBlackListed || !_.isUndefined(parsedBlacklist[pack.name + '-' + pack.version]),
                };
                packages.push(newPack);
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
        resetAsync(this.packagesFetchAsync);
        resetAsync(this.packagesCreateAsync);
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
        this.packages = [];
        this.overallPackagesCount = null;
        this.preparedPackages = [];
        this.packagesFilter = null;
        this.packagesSort = 'asc';
        this.blacklist = [];
        this.preparedBlacklist = [];
        this.blacklistedPackage = {};
        this.affectedDevicesCount = {};
        this.devicePackages = [];
        this.deviceAutoInstalledPackages = [];
        this.devicePackagesInstalledCount = 0;
        this.devicePackagesQueuedCount = 0;
        this.deviceQueue = [];
        this.deviceHistory = [];
        this.deviceUpdatesLogs = [];
    }

    _resetWizard() {
        resetAsync(this.packagesFetchAsync);
        this.packages = [];
        this.overallPackagesCount = null;
        this.preparedPackages = [];
    }

    _addPackage(data) {
        data.isBlackListed = false;
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

    _blacklistPackage(data) {
        var formattedData = {
            name: data.packageId.name,
            version: data.packageId.version,
        }
        let foundPackage = this._getPackage(formattedData);
        if(foundPackage) {
            foundPackage.isBlackListed = true;
        }

        if(this.page === 'device') {
            const foundOndevicePackage = _.find(this.ondevicePackages, (ondevicePackage) => {
                return ondevicePackage.name === data.packageId.name && ondevicePackage.version === data.packageId.version;
            });

            if(foundOndevicePackage) {
                foundOndevicePackage.isBlackListed = true;
            }
        }

        this.fetchBlacklist();
    }

    _removePackageFromBlacklist(data) {
        console.log(data);
        var foundPackage = this._getPackage(data);
        if (foundPackage) {
            foundPackage.isBlackListed = false;
        }

        if(this.page === 'device') {
            const foundOndevicePackage = _.find(this.ondevicePackages, (ondevicePackage) => {
                return ondevicePackage.name === data.name && ondevicePackage.version === data.version;
            });

            if(foundOndevicePackage) {
                foundOndevicePackage.isBlackListed = false;
            }
        }

        this.fetchBlacklist();
    }

    @computed
    get packagesCount() {
        return this.packages.length;
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

    @computed
    get uniqueGroupsCount() {
        let groups = [];
        _.each(this.blacklist, (obj, index) => {
            groups = _.union(obj.statistics.groupIds, groups);
        })
        return groups.length;
    }
}