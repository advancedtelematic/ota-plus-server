/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observable, observe } from 'mobx';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';
import { Tag } from 'antd';
import Versions from './Versions';
import { SlideAnimation } from '../../utils';

const headerHeight = 30;

@inject('stores')
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
    this.listRef = React.createRef();
    const { softwareStore } = props.stores;
    this.packagesChangeHandler = observe(softwareStore, (change) => {
      if (change.name === 'preparedPackages' && !_.isMatch(change.oldValue, change.object[change.name])) {
        const that = this;
        setTimeout(() => {
          that.listScroll();
        }, 50);
      }
    });
  }

  componentDidMount() {
    this.listRef.current.addEventListener('scroll', this.listScroll);
    this.listScroll();
  }

  componentWillUnmount() {
    this.packagesChangeHandler();
    this.listRef.current.removeEventListener('scroll', this.listScroll);
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
    const { softwareStore } = stores;
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
            newFakeHeaderLetter = Object.keys(softwareStore.preparedBlacklist)[index];
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

  togglePackage = (name) => {
    this.expandedPackage = this.expandedPackage !== name ? name : null;
  };

  render() {
    const { stores } = this.props;
    const { softwareStore } = stores;
    const blacklist = softwareStore.preparedBlacklist;
    return (
      <div className="blacklisted-packages-panel">
        <div className="section-header">
          Blacklisted packages
          <Tag color="#48dad0" className="alpha-tag">
            ALPHA
          </Tag>
        </div>
        <div className="ios-list" ref={this.listRef}>
          <div className="fake-header" style={{ top: this.fakeHeaderTopPosition }}>
            <div className="left-box">{this.fakeHeaderLetter}</div>
            <div className="right-box">Impacted devices</div>
          </div>
          {_.map(blacklist, (packs, letter) => (
            <span key={letter}>
              <div className="header">
                <div className="left-box">{letter}</div>
                <div className="right-box">Impacted devices</div>
              </div>
              {_.map(packs, (pack, index) => (
                <span key={index} className="key">
                  <button
                    type="button"
                    className={`item${this.expandedPackage === pack.packageName ? ' selected' : ''}`}
                    id={`impact-analysis-blacklisted-${pack.packageName}`}
                    onClick={this.togglePackage.bind(this, pack.packageName)}
                    key={pack.packageName}
                  >
                    <div title={pack.packageName}>{pack.packageName}</div>
                    <div>{pack.deviceCount}</div>
                  </button>
                  <SlideAnimation changeDisplay={false}>
                    {this.expandedPackage === pack.packageName ? (
                      <Versions versions={pack.versions} />
                    ) : null}
                  </SlideAnimation>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    );
  }
}

BlacklistedPackages.propTypes = {
  stores: PropTypes.shape({}),
};

export default BlacklistedPackages;
