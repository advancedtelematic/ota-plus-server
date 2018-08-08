import React, { Component, PropTypes } from 'react';
import { observable, observe } from 'mobx';
import { observer, inject } from 'mobx-react';
import _ from 'underscore';
import { VelocityTransitionGroup } from 'velocity-react';
import Dropzone from 'react-dropzone';
import { SubHeader, SearchBar, Loader } from '../../../../partials';
import ListItem from './ListItem';
import { InfiniteScroll } from '../../../../utils';
import { Form } from 'formsy-react';

const headerHeight = 28;
const noSearchResults = "No matching packages found.";

@inject("stores")
@observer
class InstalledList extends Component {
    @observable firstShownIndex = 0;
    @observable lastShownIndex = 50;
    @observable fakeHeaderLetter = null;
    @observable fakeHeaderTopPosition = 0;
    @observable expandedPackageName = null;
    @observable tmpIntervalId = null;

    constructor(props) {
        super(props);
        const { packagesStore } = this.props.stores;
        this.generateHeadersPositions = this.generateHeadersPositions.bind(this);
        this.generateItemsPositions = this.generateItemsPositions.bind(this);
        this.listScroll = this.listScroll.bind(this);
        this.packagesChangeHandler = observe(packagesStore, (change) => {
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
        const { packagesStore } = this.props.stores;
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
                    newFakeHeaderLetter = Object.keys(packagesStore.preparedOndevicePackages)[index];
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
        const { device, showPackageBlacklistModal, onFileDrop } = this.props;
        const { packagesStore } = this.props.stores;
        return (
            <span>
                <div className="ios-list" ref="list">
                    <InfiniteScroll
                        className="wrapper-infinite-scroll"
                        hasMore={packagesStore.ondevicePackagesCurrentPage < packagesStore.ondevicePackagesTotalCount / packagesStore.ondevicePackagesLimit}
                        isLoading={packagesStore.packagesOndeviceFetchAsync.isFetching}
                        useWindow={false}
                        loadMore={() => {
                            packagesStore.fetchOndevicePackages(device.uuid, packagesStore.ondeviceFilter)
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
                                                   <ListItem
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
                            <div className="wrapper-center" style={{height: '100%'}}>
                                {noSearchResults}
                            </div>
                        }
                    </InfiniteScroll>
                </div>
            </span>
        );
    }
}

InstalledList.propTypes = {
    stores: PropTypes.object,
    device: PropTypes.object.isRequired,
    showPackageBlacklistModal: PropTypes.func.isRequired,
    onFileDrop: PropTypes.func.isRequired,
}

export default InstalledList;