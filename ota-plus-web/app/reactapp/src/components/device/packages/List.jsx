import React, { Component, PropTypes } from 'react';
import { observable, observe } from 'mobx';
import { observer, inject } from 'mobx-react';
import _ from 'underscore';
import { VelocityTransitionGroup } from 'velocity-react';
import Dropzone from 'react-dropzone';
import ListItem from './ListItem';
import ListItemVersion from './ListItemVersion';
import { Loader } from '../../../partials';
import withAnimatedScroll from '../../../partials/hoc/withAnimatedScroll';

const headerHeight = 28;
const autoUpdateInfo = "Automatic update activated. The latest version of this package will automatically be installed on this device.";

@inject("stores")
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
        const { packagesStore } = props.stores;
        this.generateHeadersPositions = this.generateHeadersPositions.bind(this);
        this.generateItemsPositions = this.generateItemsPositions.bind(this);
        this.listScroll = this.listScroll.bind(this);
        this.togglePackage = this.togglePackage.bind(this);
        this.packagesChangeHandler = observe(packagesStore, (change) => {
            if(change.name === 'preparedPackages' && !_.isMatch(change.oldValue, change.object[change.name])) {
                const that = this;
                  setTimeout(() => {
                      that.listScroll();
                      if(!this.initialHighlight) {
                        that.highlightInstalledPackage(packagesStore.expandedPackage);
                        this.initialHighlight = true;
                      }
                  }, 50);
            }
        });
    }
    componentWillReceiveProps(nextProps) {
        const { disableExpand } = nextProps;
        const { packagesStore } = nextProps.stores;
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
            let scrollTo = currentScrollTop + elementCoords.top - 225;
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
        const { devicesStore, packagesStore, hardwareStore } = this.props.stores;
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
        const { devicesStore, packagesStore, hardwareStore } = this.props.stores;
        let preparedPackages = this.preparedPackages;
        let ecuObject = null;
        switch(hardwareStore.activeEcu.type) {
            case 'secondary':
                ecuObject = devicesStore._getSecondaryBySerial(hardwareStore.activeEcu.serial);
                break;
            case 'primary':
                ecuObject = devicesStore._getPrimaryByHardwareId(hardwareStore.activeEcu.hardwareId);
                break;
            default:
                break;
        }
        const filepath = ecuObject.image.filepath;
        const hash = ecuObject.image.hash.sha256;
        const size = ecuObject.image.size;
        const pack = packagesStore._getInstalledPackage(filepath, hardwareStore.activeEcu.hardwareId);
        if(!pack) {
            let unmanagedPack = {
                filepath: filepath,
                size: size,
                hash: hash,
                unmanaged: true
            };
            if(_.isUndefined(preparedPackages['#'])) {
                preparedPackages['#'] = [];
            }
            preparedPackages['#'].push(unmanagedPack);
        }
    }
    checkQueued(version) {
        const { devicesStore, hardwareStore } = this.props.stores;
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
        const { devicesStore, hardwareStore } = this.props.stores;
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
        const { onFileDrop, toggleTufPackageAutoUpdate, showPackageDetails } = this.props;
        const { devicesStore } = this.props.stores;
        const { device } = devicesStore;
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
                                                    <ul className="software-panel__details">
                                                        <li>
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
                                                                    <div className="software-panel__auto-update-tip">
                                                                        {autoUpdateInfo}
                                                                    </div>
                                                                :
                                                                    null
                                                                }
                                                            </VelocityTransitionGroup>
                                                        </li>
                                                        <li>
                                                            <ul className="software-panel__versions">
                                                                {_.map(pack.versions, (version, i) => {
                                                                    return (
                                                                        <ListItemVersion
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
    stores: PropTypes.object,
    onFileDrop: PropTypes.func.isRequired,
    toggleTufPackageAutoUpdate: PropTypes.func.isRequired,
    showPackageDetails: PropTypes.func.isRequired,
}

export default withAnimatedScroll(List);