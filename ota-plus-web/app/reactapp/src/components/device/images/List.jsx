import React, { Component, PropTypes } from 'react';
import { observable, observe } from 'mobx';
import { observer } from 'mobx-react';
import _ from 'underscore';
import { VelocityTransitionGroup } from 'velocity-react';
import ListItem from './ListItem';
import ListItemVersion from './ListItemVersion';
import { Loader } from '../../../partials';

const headerHeight = 28;

@observer
class List extends Component {
    @observable firstShownIndex = 0;
    @observable lastShownIndex = 50;
    @observable fakeHeaderLetter = null;
    @observable fakeHeaderTopPosition = 0;
    @observable expandedImageName = null;
    @observable tmpIntervalId = null;

    constructor(props) {
        super(props);
        this.generateHeadersPositions = this.generateHeadersPositions.bind(this);
        this.generateItemsPositions = this.generateItemsPositions.bind(this);
        this.listScroll = this.listScroll.bind(this);
        this.toggleImage = this.toggleImage.bind(this);
        this.imagesChangeHandler = observe(props.imagesStore, (change) => {
            if(change.name === 'preparedImages' && !_.isMatch(change.oldValue, change.object[change.name])) {
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
        this.imagesChangeHandler();
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
                    newFakeHeaderLetter = Object.keys(this.props.imagesStore.preparedImages)[index];
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
    toggleImage(imageName) {
        this.expandedImageName = (this.expandedImageName !== imageName ? imageName : null);
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
        const { imagesStore, deviceId, toggleImageAutoUpdate, installImage } = this.props;
        let imageIndex = -1;
        return (
            <div 
                className={"ios-list" + (
                imagesStore.imagesFetchAsync.isFetching ? 
                    " fetching" 
                : 
                    ""
                )}
                ref="list">
                {Object.keys(imagesStore.preparedImages).length ? 
                    <span>
                        <div className="fake-header" style={{top: this.fakeHeaderTopPosition}}>
                            {this.fakeHeaderLetter}
                        </div>
                        {_.map(imagesStore.preparedImages, (images, letter) => {
                            return (
                                <span key={letter}>
                                    <div className="header">{letter}</div>
                                    {_.map(images, (image, index) => {
                                        const that = this;
                                        imageIndex++;
                                        let queuedImage = null;
                                        let installedImage = null;
                                        queuedImage = image.imageName === 'First' ? 'hash1' : null;

                                        if(imageIndex >= this.firstShownIndex && imageIndex <= this.lastShownIndex || this.expandedImageName === image.imageName)
                                            return (
                                                <span key={index}>
                                                    <ListItem 
                                                        image={image}
                                                        deviceId={deviceId}
                                                        queuedImage={queuedImage}
                                                        installedImage={installedImage}
                                                        isSelected={this.expandedImageName === image.imageName}
                                                        toggleImage={this.toggleImage}
                                                        toggleAutoInstall={toggleImageAutoUpdate}
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
                                                        {this.expandedImageName === image.imageName ?
                                                            <ul className="versions">
                                                                <VelocityTransitionGroup 
                                                                    enter={{
                                                                        animation: "slideDown", 
                                                                        begin: () => {that.startIntervalListScroll()},
                                                                        complete: () => {that.stopIntervalListScroll()}
                                                                    }} 
                                                                    leave={{
                                                                        animation: "slideUp",
                                                                        begin: () => {that.startIntervalListScroll()},
                                                                        complete: () => {that.stopIntervalListScroll()}
                                                                    }}>
                                                                    {image.isAutoInstallEnabled ? 
                                                                        <div className="info-auto-update">
                                                                            Automatic update activated. The latest version of this image will automatically be installed on this device.
                                                                        </div>
                                                                    : 
                                                                        null
                                                                    }
                                                                </VelocityTransitionGroup>
                                                                {_.map(image.versions, (version, i) => {
                                                                    return (
                                                                        <ListItemVersion 
                                                                            version={version}
                                                                            queuedImage={queuedImage}
                                                                            isAutoInstallEnabled={image.isAutoInstallEnabled}
                                                                            installImage={installImage}
                                                                            imagesStore={imagesStore}
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
                                        return (
                                            <div className="item" key={index}></div>
                                        );        
                                    })}
                                </span>
                            );
                        })}
                    </span>
                :
                    <span className="content-empty">
                        <div className="wrapper-center">
                            No matching images found.
                        </div>
                    </span>
                }
            </div>
        );
    }
}

List.propTypes = {
    imagesStore: PropTypes.object.isRequired,
    deviceId: PropTypes.string.isRequired,
    toggleImageAutoUpdate: PropTypes.func.isRequired,
    installImage: PropTypes.func.isRequired,
}

export default List;