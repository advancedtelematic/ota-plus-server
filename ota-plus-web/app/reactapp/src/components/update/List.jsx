import React, { Component, PropTypes } from 'react';
import { observer, inject } from 'mobx-react';
import { observable, observe } from 'mobx';
import ListItem from './ListItem';
import _ from 'underscore';

const headerHeight = 30;

@inject("stores")
@observer
class List extends Component {
	@observable firstShownIndex = 0;
    @observable lastShownIndex = 50;
    @observable fakeHeaderLetter = null;
    @observable fakeHeaderTopPosition = 0;

	constructor(props) {
        super(props);
        const { updateStore } = props.stores;
        this.generateHeadersPositions = this.generateHeadersPositions.bind(this);
        this.generateItemsPositions = this.generateItemsPositions.bind(this);
        this.listScroll = this.listScroll.bind(this);
        this.updatesChangeHandler = observe(updateStore, (change) => {
            if(change.name === 'preparedUpdates' && !_.isMatch(change.oldValue, change.object[change.name])) {
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
        this.updatesChangeHandler();
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
        const { updateStore } = this.props.stores;
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
                    newFakeHeaderLetter = Object.keys(updateStore.preparedUpdates)[index];
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

    render() {
        const { updateStore } = this.props.stores;
        return (
            <div className="ios-list" ref="list">
                <div className="fake-header" style={{top: this.fakeHeaderTopPosition}}>
                    {this.fakeHeaderLetter}
                </div>
                {_.map(updateStore.preparedUpdates, (updates, letter) => {
                     return (
                        <span key={letter}>
                            <div className="header">{letter}</div>
                            {_.map(updates, (update, index) => {
                                const that = this;
                                return (
                                    <ListItem
                                        key={index}
                                        update={update}
                                    />
                                );
                            })}
                        </span>
                    );
                })}
            </div>
        );
    }
}

List.propTypes = {
}

export default List;