import React, { Component, PropTypes } from 'react';
import { observable, observe } from 'mobx';
import { observer, inject } from 'mobx-react';
import _ from 'underscore';
import Versions from './Versions';
import { SlideAnimation } from '../../utils';

const headerHeight = 30;

@inject("stores")
@observer
class BlacklistedPackages extends Component {
    @observable firstShownIndex = 0;
    @observable lastShownIndex = 50;
    @observable expandedPackage = null;
    @observable fakeHeaderTopPosition = null;
    @observable fakeHeaderLetter = '';
    @observable tmpIntervalId = null;

    constructor(props) {
        super(props);
        const { packagesStore } = props.stores;
        this.togglePackage = this.togglePackage.bind(this);
        this.generateHeadersPositions = this.generateHeadersPositions.bind(this);
        this.generateItemsPositions = this.generateItemsPositions.bind(this);
        this.listScroll = this.listScroll.bind(this);
        this.packagesChangeHandler = observe(packagesStore, (change) => {
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
                    newFakeHeaderLetter = Object.keys(packagesStore.preparedBlacklist)[index];
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
    togglePackage(name) {
        this.expandedPackage = this.expandedPackage !== name ? name : null;
    }
    render() {
        const { packagesStore } = this.props.stores; 
        const blacklist = packagesStore.preparedBlacklist;
        return (
            <div className="blacklisted-packages-panel">
                <div className="section-header">
                    Blacklisted packages
                </div>
                <div className="ios-list" ref="list">
                    <div className="fake-header" style={{top: this.fakeHeaderTopPosition}}>
                        <div className="left-box">
                            {this.fakeHeaderLetter}
                        </div>
                        <div className="right-box">
                            Impacted devices
                        </div>
                    </div>
                    {_.map(blacklist, (packs, letter) => {
                        return (
                            <span key={letter}>
                                <div className="header">
                                    <div className="left-box">
                                        {letter}
                                    </div>
                                    <div className="right-box">
                                        Impacted devices
                                    </div>
                                    
                                </div>
                                {_.map(packs, (pack, index) => {
                                    return (
                                        <span key={index} className="key">
                                            <button 
                                                className={"item" + (this.expandedPackage == pack.packageName ? " selected" : "")}
                                                id={"impact-analysis-blacklisted-" + pack.packageName}
                                                onClick={this.togglePackage.bind(this, pack.packageName )}
                                                key={pack.packageName }>
                                                <div title={pack.packageName}>
                                                    {pack.packageName}
                                                </div>
                                                <div>
                                                    {pack.deviceCount}
                                                </div>
                                            </button>
                                            <SlideAnimation changeDisplay={false}>
                                                {this.expandedPackage == pack.packageName  ?
                                                    <Versions 
                                                        versions={pack.versions}
                                                    />
                                                : 
                                                    null
                                                }
                                            </SlideAnimation>
                                        </span>
                                    );
                                })}                                    
                            </span>
                        );
                    })}
                </div>
            </div>
        );
    }
}

BlacklistedPackages.propTypes = {
    stores: PropTypes.object
}

export default BlacklistedPackages;