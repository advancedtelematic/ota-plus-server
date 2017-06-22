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
    @observable expandedPackageName = null;
    @observable selectedPackageVersion = null;
    @observable tmpIntervalId = null;

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
        if(this.props.device.isDirector) {
            this.expandedPackageName = this.props.packagesStore.installedDirectorPackage.id.name;
            this.selectedPackageVersion = this.props.packagesStore.installedDirectorPackage.id.version;
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
                    newFakeHeaderLetter = Object.keys(this.props.packagesStore.preparedPackagesPerDevice[this.props.device.uuid])[index];
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
    render() {
        const { packagesStore, device, onFileDrop, togglePackageAutoUpdate, packageVersion, loadPackageVersionProperties } = this.props;
        let packageIndex = -1;
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
                    {_.map(packagesStore.preparedPackagesPerDevice[device.uuid], (packages, letter) => {
                        return (
                            <span key={letter}>
                        <div className="header">{letter}</div>
                            {_.map(packages, (pack, index) => {
                                const that = this;
                                packageIndex++;
                                let queuedPackage = null;
                                let installedPackage = null;
                                let blacklistedAndInstalled = null;
                                const foundQueued = _.find(pack.versions, (version) => {
                                    return version.attributes.status == 'queued';
                                });
                                queuedPackage = foundQueued ? foundQueued.id.version : null;
                                const foundInstalled = _.find(pack.versions, (version) => {
                                    return version.attributes.status == 'installed';
                                });
                                installedPackage = foundInstalled ? foundInstalled.id.version : null;

                                const foundBlacklistedAndInstalled = _.find(pack.versions, (version) => {
                                    return version.isBlackListed && version.attributes.status == 'installed';
                                });
                                blacklistedAndInstalled = foundBlacklistedAndInstalled ? foundBlacklistedAndInstalled.id.version : null;

                                if(packageIndex >= this.firstShownIndex && packageIndex <= this.lastShownIndex || this.expandedPackageName === pack.packageName) {
                                    return (
                                        <span key={index}>
                                        <ListItem
                                            pack={pack}
                                            deviceId={device.uuid}
                                            queuedPackage={queuedPackage}
                                            installedPackage={installedPackage}
                                            blacklistedAndInstalled={blacklistedAndInstalled}
                                            isSelected={this.expandedPackageName === pack.packageName}
                                            togglePackage={this.togglePackage}
                                            toggleAutoInstall={togglePackageAutoUpdate}
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
                                                <ul className="versions">
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
                                                    {_.map(pack.versions, (version, i) => {
                                                        return (
                                                            <ListItemVersion
                                                                device={device}
                                                                version={version}
                                                                queuedPackage={queuedPackage}
                                                                installedPackage={installedPackage}
                                                                isAutoInstallEnabled={pack.isAutoInstallEnabled}
                                                                packagesStore={packagesStore}
                                                                packageVersion={packageVersion}
                                                                loadPackageVersionProperties={loadPackageVersionProperties}
                                                                togglePackageVersion={this.togglePackageVersion}
                                                                selectedPackageVersion={this.selectedPackageVersion}
                                                                key={i}
                                                            />
                                                        );
                                                    })}
                                                </ul>
                                                :
                                                null
                                            }
                                        </VelocityTransitionGroup>
                                    </span>
                                    );
                                } else {
                                    return (
                                        <div className="item" key={index}></div>
                                    );
                                }
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
    device: PropTypes.object.isRequired,
    onFileDrop: PropTypes.func.isRequired,
    togglePackageAutoUpdate: PropTypes.func.isRequired,
    packageVersion: PropTypes.object.isRequired,
    loadPackageVersionProperties: PropTypes.func.isRequired,
}

export default CoreList;