/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable, observe } from 'mobx';
import _ from 'lodash';

import ListItem from './ListItem';
import { EVENTS } from '../../constants';

const headerHeight = 30;
const ON_UPDATE_CHANGE_TIMEOUT_MS = 50;

@inject('stores')
@observer
class List extends Component {
  @observable firstShownIndex = 0;

  @observable lastShownIndex = 50;

  @observable fakeHeaderLetter = null;

  @observable fakeHeaderTopPosition = 0;

  constructor(props) {
    super(props);
    this.listRef = React.createRef();
    const { updatesStore } = props.stores;
    this.updatesChangeHandler = observe(updatesStore, (change) => {
      if (change.name === 'preparedUpdates' && !_.isMatch(change.oldValue, change.object[change.name])) {
        const that = this;
        setTimeout(() => {
          that.listScroll();
        }, ON_UPDATE_CHANGE_TIMEOUT_MS);
      }
    });
  }

  componentDidMount() {
    this.listRef.current.addEventListener(EVENTS.SCROLL, this.listScroll);
    this.listScroll();
  }

  componentWillUnmount() {
    this.updatesChangeHandler();
    this.listRef.current.removeEventListener(EVENTS.SCROLL, this.listScroll);
  }

  generateHeadersPositions = () => {
    const headers = this.listRef.current.getElementsByClassName('header');
    const wrapperPosition = this.listRef.current.getBoundingClientRect();
    const positions = [];
    _.each(
      headers,
      (header) => {
        const position = header.getBoundingClientRect().top - wrapperPosition.top + this.listRef.current.scrollTop;
        positions.push(position);
      },
      this,
    );
    return positions;
  };

  generateItemsPositions = () => {
    const items = this.listRef.current.getElementsByClassName('item');
    const wrapperPosition = this.listRef.current.getBoundingClientRect();
    const positions = [];
    _.each(
      items,
      (item) => {
        const position = item.getBoundingClientRect().top - wrapperPosition.top + this.listRef.current.scrollTop;
        positions.push(position);
      },
      this,
    );
    return positions;
  };

  listScroll = () => {
    const { stores } = this.props;
    const { updatesStore } = stores;
    if (this.listRef.current) {
      const headersPositions = this.generateHeadersPositions();
      const itemsPositions = this.generateItemsPositions();
      let { scrollTop } = this.listRef.current;
      const listHeight = this.listRef.current.getBoundingClientRect().height;
      let newFakeHeaderLetter = this.fakeHeaderLetter;
      let firstShownIndex = null;
      let lastShownIndex = null;
      _.each(
        headersPositions,
        (position, index) => {
          if (scrollTop >= position) {
            newFakeHeaderLetter = Object.keys(updatesStore.preparedUpdates)[index];
            return true;
          }
          if (scrollTop >= position - headerHeight) {
            scrollTop -= scrollTop - (position - headerHeight);
            return true;
          }
          return false;
        },
        this,
      );
      _.each(
        itemsPositions,
        (position, index) => {
          if (firstShownIndex === null && scrollTop <= position) {
            firstShownIndex = index;
          } else if (lastShownIndex === null && scrollTop + listHeight <= position) {
            lastShownIndex = index;
          }
        },
        this,
      );
      this.firstShownIndex = firstShownIndex;
      this.lastShownIndex = lastShownIndex !== null ? lastShownIndex : itemsPositions.length - 1;
      this.fakeHeaderLetter = newFakeHeaderLetter;
      this.fakeHeaderTopPosition = scrollTop;
    }
  };

  render() {
    const { showUpdateDetails, stores } = this.props;
    const { updatesStore } = stores;
    return (
      <div className="ios-list" id="list-updates" ref={this.listRef}>
        {!_.isEmpty(updatesStore.preparedUpdates) ? (
          _.map(updatesStore.preparedUpdates, (updates, letter) => (
            <span key={letter}>
              {_.map(updates, (update, index) => (
                <ListItem
                  key={index}
                  update={update}
                  showUpdateDetails={showUpdateDetails}
                />
              ))}
            </span>
          ))
        ) : (
          <div className="wrapper-center">{'No updates found.'}</div>
        )}
      </div>
    );
  }
}

List.propTypes = {
  stores: PropTypes.shape({}),
  showUpdateDetails: PropTypes.func
};

export default List;
