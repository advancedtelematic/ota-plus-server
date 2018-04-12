import React, { Component, PropTypes } from 'react';
import { observable, observe } from 'mobx';
import { observer } from 'mobx-react';
import _ from 'underscore';
import { VelocityTransitionGroup } from 'velocity-react';
import Dropzone from 'react-dropzone';
import ListItem from './ListItem';
import ListItemVersion from './ListItemVersion';
import { Loader } from '../../../partials';
import withAnimatedScroll from '../../../partials/withAnimatedScroll';

const headerHeight = 28;
const autoUpdateInfo = "Automatic update activated. The latest version of this package will automatically be installed on this device.";

@observer
class List extends Component {
    @observable firstShownIndex = 0;
    @observable lastShownIndex = 50;
    @observable fakeHeaderLetter = null;
    @observable fakeHeaderTopPosition = 0;
    @observable expandedPackageName = null;
    @observable tmpIntervalId = null;
    @observable preparedPackages = {};
    @observable initialHighlight = false;

    constructor(props) {
        super(props);
        this.generateHeadersPositions = this.generateHeadersPositions.bind(this);
        this.generateItemsPositions = this.generateItemsPositions.bind(this);
        this.listScroll = this.listScroll.bind(this);
        this.togglePackage = this.togglePackage.bind(this);
        this.packagesChangeHandler = observe(props.packagesStore, (change) => {
            if(change.name === 'preparedPackages' && !_.isMatch(change.oldValue, change.object[change.name])) {
                const that = this;
                  setTimeout(() => {
                      that.listScroll();
                      if(!this.initialHighlight) {
                        that.highlightInstalledPackage(props.packagesStore.expandedPackage);
                        this.initialHighlight = true;
                      }
                  }, 50);
            }
        });
    }
    componentWillReceiveProps(nextProps) {
        const { devicesStore, disableExpand, packagesStore } = nextProps;
        this.selectPackagesToDisplay();
        this.addUnmanagedPackage();
        if(!disableExpand) {
            if(packagesStore.expandedPackage && !packagesStore.expandedPackage.unmanaged) {
                this.expandedPackageName = packagesStore.expandedPackage.id.name;
            }
            else {
                this.expandedPackageName = null;
            }
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
    highlightInstalledPackage(pack) {
        const { animatedScroll } = this.props;
        if(this.refs.list && pack && !pack.unmanaged) {
            const currentScrollTop = this.refs.list.scrollTop;
            const elementCoords = document.getElementById("button-package-" + pack.id.name).getBoundingClientRect();
            let scrollTo = currentScrollTop + elementCoords.top - 150;
            setTimeout(() => {
                animatedScroll(document.querySelector('.ios-list'), scrollTo, 500);
            }, 400);
        }
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
        const { devicesStore, packagesStore, hardwareStore } = this.props;
        let preparedPackages = packagesStore.preparedPackages;
        let dirPacks = {};
        _.map(packagesStore.preparedPackages, (packages, letter) => {
            dirPacks[letter] = [];
            _.map(packages, (pack, index) => {
                let filteredVersions = [];
                _.each(pack.versions, (version, i) => {
                    if(_.includes(version.hardwareIds, hardwareStore.activeEcu.hardwareId)) {
                        filteredVersions.push(version);
                    }
                })
                if(!_.isEmpty(filteredVersions)) {
                    pack.versions = filteredVersions;
                    dirPacks[letter].push(pack);
                }
                _.map(pack.versions, (version, ind) => {
                    if(hardwareStore.activeEcu.type === 'primary') {
                        if(version.filepath === devicesStore._getPrimaryFilepath()) {
                            let packAdded = _.some(dirPacks[letter], (item, index) => {
                                return item.packageName == version.id.name;
                            });
                            if(!packAdded) {
                                dirPacks[letter].push(pack);
                            }
                        }
                    } else {
                        _.map(devicesStore.device.directorAttributes.secondary, (secondaryObj, ind) => {
                            if(version.filepath === secondaryObj.image.filepath && hardwareStore.activeEcu.serial === secondaryObj.id) {
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
            });
        });
        this.clearArray(dirPacks);
        this.preparedPackages = dirPacks;
    }
    addUnmanagedPackage() {
        const { devicesStore, packagesStore, hardwareStore } = this.props;
        let preparedPackages = this.preparedPackages;
        switch(hardwareStore.activeEcu.type) {
            case 'secondary':
                let secondaryObject = devicesStore._getSecondaryBySerial(hardwareStore.activeEcu.serial);
                let reportedHash = secondaryObject.image.filepath;
                let pack = packagesStore._getInstalledPackage(reportedHash, hardwareStore.activeEcu.hardwareId);
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
                let primaryObject = devicesStore._getPrimaryByHardwareId(hardwareStore.activeEcu.hardwareId);
                let hash = primaryObject.image.filepath;
                let packItem = packagesStore._getInstalledPackage(hash, hardwareStore.activeEcu.hardwareId);
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
    checkQueued(version) {
        const { devicesStore, hardwareStore } = this.props;
        let queuedPackage = null;
        let serial = hardwareStore.activeEcu.serial;                                        
        _.each(devicesStore.multiTargetUpdates, (update, i) => {
            if(!_.isEmpty(update.targets[serial])) {
                if(update.targets[serial].image.filepath === version.filepath) {
                    queuedPackage = version.filepath;
                }
            }
        });
        return queuedPackage;
    }
    checkInstalled(version) {
        const { devicesStore, hardwareStore } = this.props;
        const device = devicesStore.device;
        let installedPackage = null;
        if(hardwareStore.activeEcu.type === 'primary') {
            if(version.filepath === devicesStore._getPrimaryFilepath()) {
                installedPackage = version.id.version;
            }
        } else {
            _.each(device.directorAttributes.secondary, (secondaryObj, ind) => {
                if(secondaryObj.id === hardwareStore.activeEcu.serial && 
                    version.filepath === secondaryObj.image.filepath) {
                        installedPackage = version.id.version;
                }                                                       
            });
        }
        return installedPackage;
    }
    render() {        
        const { devicesStore, packagesStore, hardwareStore, onFileDrop, toggleTufPackageAutoUpdate, showPackageDetails } = this.props;
        const device = devicesStore.device;
        const preparedPackages = this.preparedPackages;
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
                                        _.each(pack.versions, (version, i) => {
                                            if(!installedPackage) {
                                                installedPackage = this.checkInstalled(version);
                                            }
                                            if(!queuedPackage) {
                                                queuedPackage = this.checkQueued(version);
                                            }
                                        });
                                        return (
                                            <span key={index}>
                                            <ListItem
                                                pack={pack}
                                                device={device}
                                                queuedPackage={queuedPackage}
                                                installedPackage={installedPackage}
                                                isSelected={this.expandedPackageName === pack.packageName}
                                                togglePackage={this.togglePackage}
                                                toggleTufAutoInstall={toggleTufPackageAutoUpdate}
                                                showPackageDetails={showPackageDetails}
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
                                                                        {autoUpdateInfo}
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
                                                                            showPackageDetails={showPackageDetails}
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

List.propTypes = {
    packagesStore: PropTypes.object.isRequired,
    devicesStore: PropTypes.object.isRequired,
    hardwareStore: PropTypes.object.isRequired,
    onFileDrop: PropTypes.func.isRequired,
    toggleTufPackageAutoUpdate: PropTypes.func.isRequired,
    showPackageDetails: PropTypes.func.isRequired,
}

export default withAnimatedScroll(List);