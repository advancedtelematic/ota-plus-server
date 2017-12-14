import React, { Component, PropTypes } from 'react';
import { observable, observe } from 'mobx';
import { observer } from 'mobx-react';
import _ from 'underscore';
import { VelocityTransitionGroup } from 'velocity-react';
import Dropzone from 'react-dropzone';
import ListItem from './ListItem';
import ListItemVersion from './ListItemVersion';
import { PackagesVersionsStats } from './stats';
import { Loader } from '../../partials';

const headerHeight = 28;

@observer
class List extends Component {
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
        this.highlightPackage = this.highlightPackage.bind(this);
        this.togglePackage = this.togglePackage.bind(this);
        this.packagesChangeHandler = observe(props.packagesStore, (change) => {
            if(change.name === 'preparedPackages' && !_.isMatch(change.oldValue, change.object[change.name])) {
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
        this.highlightPackage(this.props.highlightedPackage);
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
                    newFakeHeaderLetter = Object.keys(this.props.packagesStore.preparedPackages)[index];
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
    highlightPackage(pack) {
        if(this.refs.list && pack) {
            const wrapperPosition = this.refs.list.getBoundingClientRect();
            this.refs.list.scrollTop = document.getElementById("button-package-" + pack).getBoundingClientRect().top - wrapperPosition.top - headerHeight;
            this.expandedPackageName = pack;
        }
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.highlightedPackage !== this.props.highlightedPackage) {
            this.highlightPackage(nextProps.highlightedPackage);
        }
    }
    togglePackage(packageName, e) {
        if(e) e.preventDefault();
        this.expandedPackageName = (this.expandedPackageName !== packageName ? packageName : null);
    }
    startIntervalListScroll() {
        clearInterval(this.tmpIntervalId);
        let intervalId = setInterval(() => {
            this.listScroll();
        }, 10);
        this.tmpIntervalId = intervalId;
    }
    stopIntervalListScroll() {
        clearInterval(this.tmpIntervalId);
        this.tmpIntervalId = null;
    }
    render() {
        const { showBlacklistModal, packagesStore, onFileDrop, highlightedPackage, showRelativesModal } = this.props;
        return (
            <div className={"ios-list" + (packagesStore.packagesFetchAsync.isFetching || packagesStore.packagesTufFetchAsync.isFetching ? " fetching" : "")} ref="list">
                {packagesStore.packagesCount ? 
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
                        {_.map(packagesStore.preparedPackages, (packages, letter) => {
                            return (
                                <span key={letter}>
                                    <div className="header">{letter}</div>
                                    {_.map(packages, (pack, index) => {
                                        const that = this;
                                        return (
                                            <span key={index}>
                                                <ListItem 
                                                    pack={pack}
                                                    togglePackage={this.togglePackage}
                                                    expandedPackageName={this.expandedPackageName}
                                                />
                                                <VelocityTransitionGroup 
                                                    enter={{
                                                        animation: "slideDown",
                                                        begin: () => {that.startIntervalListScroll();},
                                                        complete: () => {that.stopIntervalListScroll();}
                                                    }}
                                                    leave={{
                                                        animation: "slideUp",
                                                        begin: () => {that.startIntervalListScroll();},
                                                        complete: () => {that.stopIntervalListScroll();}
                                                    }}
                                                >
                                                    {this.expandedPackageName === pack.packageName ?
                                                        pack.inDirector ?
                                                            <div className="director-details">
                                                                <div className="pack-name">
                                                                    {pack.packageName}
                                                                </div>
                                                                <div className="distribution">
                                                                    <div className="heading">
                                                                        Distribution by devices
                                                                    </div>
                                                                    <div className="pie">
                                                                        <PackagesVersionsStats
                                                                            pack={pack}
                                                                        />
                                                                    </div>
                                                                </div>                                                                
                                                                <ul className="versions" id="versions">
                                                                    <div className="heading">
                                                                        All versions
                                                                    </div>
                                                                    {_.map(pack.versions, (version, i) => {
                                                                        return (
                                                                            <ListItemVersion 
                                                                                pack={pack}
                                                                                version={version}
                                                                                showBlacklistModal={showBlacklistModal}
                                                                                packagesStore={packagesStore}
                                                                                showRelativesModal={showRelativesModal}
                                                                                key={i}
                                                                            />
                                                                        );
                                                                    })}
                                                                </ul>
                                                            </div>
                                                        :
                                                            <div className="legacy-details">
                                                                <ul className="versions" id="versions">
                                                                    {_.map(pack.versions, (version, i) => {
                                                                        return (
                                                                            <ListItemVersion 
                                                                                pack={pack}
                                                                                version={version}
                                                                                showBlacklistModal={showBlacklistModal}
                                                                                packagesStore={packagesStore}
                                                                                showRelativesModal={showRelativesModal}
                                                                                key={i}
                                                                            />
                                                                        );
                                                                    })}
                                                                </ul>
                                                            </div>
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
                :
                    <span className="content-empty">
                        <div className="wrapper-center">
                            No matching packages found.
                        </div>
                    </span>
                }
            </div>
        );
    }
}

List.propTypes = {
    showBlacklistModal: PropTypes.func.isRequired,
    packagesStore: PropTypes.object.isRequired,
    onFileDrop: PropTypes.func.isRequired,
    highlightedPackage: PropTypes.string
}

export default List;