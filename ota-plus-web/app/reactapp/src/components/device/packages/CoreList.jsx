import React, { Component, PropTypes } from 'react';
import { observable, observe } from 'mobx';
import { observer } from 'mobx-react';
import _ from 'underscore';
import { VelocityTransitionGroup } from 'velocity-react';
import Dropzone from 'react-dropzone';
import ListItem from './ListItem';
import ListItemVersion from './ListItemVersion';
import ListItemOnDevice from './ListItemOnDevice';
import { Loader } from '../../../partials';

const headerHeight = 28;

@observer
class CoreList extends Component {
    @observable firstShownIndex = 0;
    @observable lastShownIndex = 50;
    @observable fakeHeaderLetter = null;
    @observable fakeHeaderTopPosition = 0;
    @observable packageExpandedManually = false;
    @observable expandedPackageName = null;
    @observable selectedPackageVersion = null;
    @observable tmpIntervalId = null;
    @observable preparedPackages = {};

    constructor(props) {
        super(props);
        this.generateHeadersPositions = this.generateHeadersPositions.bind(this);
        this.generateItemsPositions = this.generateItemsPositions.bind(this);
        this.listScroll = this.listScroll.bind(this);
        this.togglePackage = this.togglePackage.bind(this);
        this.togglePackageVersion = this.togglePackageVersion.bind(this);
        this.packagesChangeHandler = observe(props.packagesStore, (change) => {
            if(change.name === 'preparedPackages' && !_.isMatch(change.oldValue, change.object[change.name])) {
                const that = this;
                  setTimeout(() => {
                      that.listScroll();
                  }, 50);
            }
        });
    }
    componentWillMount() {
        if(!this.props.device.isDirector) {
            this.preparedPackages = this.selectPackagesToDisplay();
        }
    }
    componentWillReceiveProps(nextProps) {
        this.preparedPackages = this.selectPackagesToDisplay();
        if(this.props.device.isDirector) {
            if(nextProps.expandedPack && !nextProps.expandedPack.unmanaged && !this.packageExpandedManually) {
                this.expandedPackageName = nextProps.expandedPack.id.name;
                this.selectedPackageVersion = nextProps.expandedPack.id.version;
            }
            else if(!this.packageExpandedManually) {
                this.expandedPackageName = null;
                this.selectedPackageVersion = null;
            }
            this.addUnmanagedPackage(this.preparedPackages);
        }
    }
    componentDidMount() {
        this.refs.list.addEventListener('scroll', this.listScroll);
        this.listScroll();
    }
    componentWillUnmount() {
        this.packagesChangeHandler();
        this.refs.list.removeEventListener('scroll', this.listScroll);
    }
    generateHeadersPositions() {
        const headers = this.refs.list.getElementsByClassName('header');
        const wrapperPosition = this.refs.list.getBoundingClientRect();
        let positions = [];
        _.each(headers, (header) => {
            let position = header.getBoundingClientRect().top - wrapperPosition.top + this.refs.list.scrollTop;
            positions.push(position);
        }, this);
        return positions;
    }
    generateItemsPositions() {
        const items = this.refs.list.getElementsByClassName('item');
        const wrapperPosition = this.refs.list.getBoundingClientRect();
        let positions = [];
        _.each(items, (item) => {
            let position = item.getBoundingClientRect().top - wrapperPosition.top + this.refs.list.scrollTop;
            positions.push(position);
        }, this);
        return positions;
    }
    listScroll() {
        if(this.refs.list) {
            const headersPositions = this.generateHeadersPositions();
            const itemsPositions = this.generateItemsPositions();
            let scrollTop = this.refs.list.scrollTop;
            let listHeight = this.refs.list.getBoundingClientRect().height;
            let newFakeHeaderLetter = this.fakeHeaderLetter;
            let firstShownIndex = null;
            let lastShownIndex = null;
            _.each(headersPositions, (position, index) => {
                if(scrollTop >= position) {
                    newFakeHeaderLetter = Object.keys(this.preparedPackages)[index];
                    return true;
                } else if(scrollTop >= position - headerHeight) {
                    scrollTop -= scrollTop - (position - headerHeight);
                    return true;
                }
            }, this);
            _.each(itemsPositions, (position, index) => {
                if(firstShownIndex === null && scrollTop <= position) {
                    firstShownIndex = index;
                } else if(lastShownIndex === null && scrollTop + listHeight <= position) {
                    lastShownIndex = index;
                }
            }, this);
            this.firstShownIndex = firstShownIndex;
              this.lastShownIndex = lastShownIndex !== null ? lastShownIndex : itemsPositions.length - 1;
            this.fakeHeaderLetter = newFakeHeaderLetter;
            this.fakeHeaderTopPosition = scrollTop;
        }
    }
    togglePackage(packageName) {
        this.expandedPackageName = (this.expandedPackageName !== packageName ? packageName : null);
        this.packageExpandedManually = true;
    }
    togglePackageVersion(hash) {
        this.selectedPackageVersion = (this.selectedPackageVersion !== hash ? hash : null);;
    }
    startIntervalListScroll() {
        clearInterval(this.tmpIntervalId);
        const that = this;
        let intervalId = setInterval(() => {
            that.listScroll();
        }, 10);
        this.tmpIntervalId = intervalId;
    }
    stopIntervalListScroll() {
        clearInterval(this.tmpIntervalId);
        this.tmpIntervalId = null;
    }
    clearArray(array) {
        _.map(array, (item, index) => {
            if(!array[index].length) {
                delete array[index];
            }
        });
    }
    selectPackagesToDisplay() {
        let preparedPackages = this.props.packagesStore.preparedPackages;
        let dirPacks = {};
        let corePacks = {};
        _.map(this.props.packagesStore.preparedPackages, (packages, letter) => {
            dirPacks[letter] = [];
            corePacks[letter] = [];
            _.map(packages, (pack, index) => {
                if(pack.inDirector) {
                    let filteredVersions = [];
                    _.each(pack.versions, (version, i) => {
                        if(_.includes(version.hardwareIds, this.props.activeEcu.hardwareId)) {
                            filteredVersions.push(version);
                        }
                    })
                    if(!_.isEmpty(filteredVersions)) {
                        pack.versions = filteredVersions;
                        dirPacks[letter].push(pack);
                    }
                }
                if(!pack.inDirector) {
                    corePacks[letter].push(pack);
                }
                if(this.props.device.isDirector) {
                    _.map(pack.versions, (version, ind) => {

                        if(this.props.activeEcu.type === 'primary') {
                            if(version.id.version === this.props.devicesStore._getPrimaryHash()) {
                                let packAdded = _.some(dirPacks[letter], (item, index) => {
                                    return item.packageName == version.id.name;
                                });
                                if(!packAdded) {
                                    dirPacks[letter].push(pack);
                                }
                            }
                        } else {
                            _.map(this.props.device.directorAttributes.secondary, (secondaryObj, ind) => {
                                if(version.id.version === secondaryObj.image.hash.sha256) {
                                    let packAdded = _.some(dirPacks[letter], (item, index) => {
                                        return item.packageName == version.id.name;
                                    });
                                    if(!packAdded) {
                                        dirPacks[letter].push(pack);
                                    }
                                }
                            });
                        }
                    });
                }
            });
        });
        this.clearArray(dirPacks);
        this.clearArray(corePacks);
        return this.props.device.isDirector ? dirPacks : corePacks;
    }
    addUnmanagedPackage(preparedPackages) {
        const { devicesStore, packagesStore, device, activeEcu } = this.props;
        switch(activeEcu.type) {
            case 'secondary':
                let secondaryObject = devicesStore._getSecondaryByHardwareId(activeEcu.hardwareId);
                let reportedHash = secondaryObject.image.hash.sha256;
                let pack = packagesStore._getInstalledPackage(reportedHash);
                if(!pack) {
                    let unmanagedPack = {
                        filepath: secondaryObject.image.filepath,
                        size: secondaryObject.image.size,
                        hash: reportedHash,
                        unmanaged: true
                    };
                    if(_.isUndefined(preparedPackages['#'])) {
                        preparedPackages['#'] = [];
                    }
                    preparedPackages['#'].push(unmanagedPack);
                }
                break;
            case 'primary':
                let primaryObject = devicesStore._getPrimaryByHardwareId(activeEcu.hardwareId);
                let hash = primaryObject.image.hash.sha256;
                let packItem = packagesStore._getInstalledPackage(hash);
                if(!packItem) {
                    let unmanagedPack = {
                        filepath: primaryObject.image.filepath,
                        size: primaryObject.image.size,
                        hash: hash,
                        unmanaged: true
                    };
                    if(_.isUndefined(preparedPackages['#'])) {
                        preparedPackages['#'] = [];
                    }
                    preparedPackages['#'].push(unmanagedPack);
                }
                break;
            default:
                break;
        }
    }
    render() {
        const { devicesStore, packagesStore, hardwareStore, device, onFileDrop, togglePackageAutoUpdate, toggleTufPackageAutoUpdate, expandedPack, loadPackageVersionProperties, activeEcu } = this.props;
        let preparedPackages = this.preparedPackages;
        return (
            <div className="ios-list" ref="list">
                <Dropzone
                    ref="dropzone"
                    onDrop={onFileDrop}
                    multiple={false}
                    disableClick={true}
                    className="dnd-zone"
                    activeClassName={"dnd-zone-active"}>
                    <div className="fake-header" style={{top: this.fakeHeaderTopPosition}}>
                        {this.fakeHeaderLetter}
                    </div>
                    {_.map(preparedPackages, (packages, letter) => {
                        return (
                            <span key={letter}>
                                <div className="header">{letter}</div>
                                    {_.map(packages, (pack, index) => {
                                        const that = this;
                                        let queuedPackage = null;
                                        let installedPackage = null;
                                        let blacklistedPackage = null;
                                        let blacklistedAndInstalled = null;
                                        const foundQueued = _.find(pack.versions, (version) => {
                                            return version.attributes.status == 'queued';
                                        });
                                        queuedPackage = foundQueued ? foundQueued.id.version : null;
                                        const foundInstalled = _.find(pack.versions, (version) => {
                                            return version.attributes.status == 'installed';
                                        });
                                        
                                        installedPackage = foundInstalled ? foundInstalled.id.version : null;

                                        if(device.isDirector && activeEcu) {
                                            {_.map(pack.versions, (version, i) => {
                                                if(activeEcu.type === 'primary') {
                                                    if(version.id.version === devicesStore._getPrimaryHash()) {
                                                        installedPackage = version.id.version;
                                                    }
                                                } else {
                                                    _.map(device.directorAttributes.secondary, (secondaryObj, ind) => {
                                                        if(version.id.version === secondaryObj.image.hash.sha256) {
                                                            installedPackage = version.id.version;
                                                        }
                                                    });
                                                }
                                            })};
                                        }

                                        const foundBlacklistedAndInstalled = _.find(pack.versions, (version) => {
                                            return version.isBlackListed && version.attributes.status == 'installed';
                                        });
                                        blacklistedAndInstalled = foundBlacklistedAndInstalled ? foundBlacklistedAndInstalled.id.version : null;

                                        return (
                                            <span key={index}>
                                            <ListItem
                                                pack={pack}
                                                device={device}
                                                queuedPackage={queuedPackage}
                                                installedPackage={installedPackage}
                                                blacklistedAndInstalled={blacklistedAndInstalled}
                                                isSelected={this.expandedPackageName === pack.packageName}
                                                togglePackage={this.togglePackage}
                                                toggleAutoInstall={togglePackageAutoUpdate}
                                                toggleTufAutoInstall={toggleTufPackageAutoUpdate}
                                                loadPackageVersionProperties={loadPackageVersionProperties}
                                            />
                                            <VelocityTransitionGroup
                                                enter={{
                                                    animation: "slideDown",
                                                    begin: () => {
                                                        that.startIntervalListScroll()
                                                    },
                                                    complete: () => {
                                                        that.stopIntervalListScroll()
                                                    }
                                                }}
                                                leave={{
                                                    animation: "slideUp",
                                                    begin: () => {
                                                        that.startIntervalListScroll()
                                                    },
                                                    complete: () => {
                                                        that.stopIntervalListScroll()
                                                    }
                                                }}>
                                                {this.expandedPackageName === pack.packageName ?
                                                    <ul className="versions-container">
                                                        <li className="auto-update">
                                                            <VelocityTransitionGroup
                                                                enter={{
                                                                    animation: "slideDown",
                                                                    begin: () => {
                                                                        that.startIntervalListScroll()
                                                                    },
                                                                    complete: () => {
                                                                        that.stopIntervalListScroll()
                                                                    }
                                                                }}
                                                                leave={{
                                                                    animation: "slideUp",
                                                                    begin: () => {
                                                                        that.startIntervalListScroll()
                                                                    },
                                                                    complete: () => {
                                                                        that.stopIntervalListScroll()
                                                                    }
                                                                }}>
                                                                {pack.isAutoInstallEnabled ?
                                                                    <div className="info-auto-update">
                                                                        Automatic update activated. The latest
                                                                        version of this package will
                                                                        automatically be installed on this
                                                                        device.
                                                                    </div>
                                                                :
                                                                    null
                                                                }
                                                            </VelocityTransitionGroup>
                                                        </li>
                                                        <li>
                                                            <ul className="versions">
                                                                {_.map(pack.versions, (version, i) => {
                                                                    return (
                                                                        <ListItemVersion
                                                                            packagesStore={packagesStore}
                                                                            version={version}
                                                                            queuedPackage={queuedPackage}
                                                                            installedPackage={installedPackage}
                                                                            expandedPack={expandedPack}
                                                                            loadPackageVersionProperties={loadPackageVersionProperties}
                                                                            togglePackageVersion={this.togglePackageVersion}
                                                                            selectedPackageVersion={this.selectedPackageVersion}
                                                                            key={i}
                                                                        />
                                                                    );
                                                                })}
                                                            </ul>
                                                        </li>
                                                    </ul>
                                                    :
                                                    null
                                                }
                                            </VelocityTransitionGroup>
                                        </span>
                                        );
                                        
                                    })}
                            </span>
                        );
                    })}
                </Dropzone>

            </div>
        );
    }
}

CoreList.propTypes = {
    packagesStore: PropTypes.object.isRequired,
    devicesStore: PropTypes.object.isRequired,
    hardwareStore: PropTypes.object.isRequired,
    device: PropTypes.object.isRequired,
    onFileDrop: PropTypes.func.isRequired,
    togglePackageAutoUpdate: PropTypes.func.isRequired,
    toggleTufPackageAutoUpdate: PropTypes.func.isRequired,
    expandedPack: PropTypes.object,
    loadPackageVersionProperties: PropTypes.func.isRequired,
    activeEcu: PropTypes.object,
}

export default CoreList;