import React, { Component, PropTypes } from 'react';
import { observable, observe } from 'mobx';
import { observer } from 'mobx-react';
import _ from 'underscore';
import { VelocityTransitionGroup } from 'velocity-react';
import Dropzone from 'react-dropzone';
import { Loader } from '../../../partials';
import ListItemOnDevice from './ListItemOnDevice';
import { InfiniteScroll } from '../../../utils';

const headerHeight = 28;

@observer
class OnDeviceList extends Component {
    @observable firstShownIndex = 0;
    @observable lastShownIndex = 50;
    @observable fakeHeaderLetter = null;
    @observable fakeHeaderTopPosition = 0;
    @observable expandedPackageName = null;
    @observable tmpIntervalId = null;

    constructor(props) {
        super(props);
        this.generateHeadersPositions = this.generateHeadersPositions.bind(this);
        this.generateItemsPositions = this.generateItemsPositions.bind(this);
        this.listScroll = this.listScroll.bind(this);
        this.togglePackage = this.togglePackage.bind(this);
        this.packagesChangeHandler = observe(props.packagesStore, (change) => {
            if(change.name === 'preparedOndevicePackages' && !_.isMatch(change.oldValue, change.object[change.name])) {
                const that = this;
                  setTimeout(() => {
                      that.listScroll();
                  }, 50);
            }
        });
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
                    newFakeHeaderLetter = Object.keys(this.props.packagesStore.preparedOndevicePackages)[index];
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
    render() {
        const { packageVersion, deviceId, showPackageBlacklistModal, packagesStore, onFileDrop, togglePackageAutoUpdate, installPackage } = this.props;
        let packageIndex = -1;
        return (
            <div className="ios-list" ref="list">
                {packageVersion.isInstalled ?
                    <InfiniteScroll
                        className="wrapper-infinite-scroll"
                        hasMore={packagesStore.ondevicePackagesCurrentPage < packagesStore.ondevicePackagesTotalCount / packagesStore.ondevicePackagesLimit}
                        isLoading={packagesStore.packagesOndeviceFetchAsync.isFetching}
                        useWindow={false}
                        loadMore={() => {
                            packagesStore.fetchOndevicePackages(deviceId, packagesStore.ondeviceFilter)
                        }}
                    >
                        {Object.keys(packagesStore.preparedOndevicePackages).length ? 
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
                                {_.map(packagesStore.preparedOndevicePackages, (packages, letter) => {
                                    return (
                                        <span key={letter}>
                                            <div className="header">{letter}</div>
                                            {_.map(packages, (pack, index) => {
                                                return (
                                                   <ListItemOnDevice 
                                                        pack={pack}
                                                        showPackageBlacklistModal={showPackageBlacklistModal}
                                                        key={index}
                                                    />
                                                );
                                                    
                                            })}
                                        </span>
                                    );
                                })}
                            </Dropzone>
                        :
                            <span className="content-empty">
                                <div className="wrapper-center">
                                    No matching packages found.
                                </div>
                            </span>
                        }
                    </InfiniteScroll>
                :
                    <div className="wrapper-center">
                        None reported for the current selection
                    </div>
                }
            </div>
        );
    }
}

OnDeviceList.propTypes = {
    deviceId: PropTypes.string.isRequired,
    showPackageBlacklistModal: PropTypes.func.isRequired,
    onFileDrop: PropTypes.func.isRequired,
    togglePackageAutoUpdate: PropTypes.func.isRequired,
    installPackage: PropTypes.func.isRequired,
    packagesStore: PropTypes.object.isRequired,
}

export default OnDeviceList;