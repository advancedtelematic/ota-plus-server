/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observable, observe } from 'mobx';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';
import Dropzone from 'react-dropzone';
import { withTranslation } from 'react-i18next';

import ListItem from './ListItem';
import { InfiniteScroll } from '../../../../utils';

const HEADER_HEIGHT = 28;

@inject('stores')
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
    this.listRef = React.createRef();
    this.dropzoneRef = React.createRef();
    const { stores } = this.props;
    const { softwareStore } = stores;
    this.packagesChangeHandler = observe(softwareStore, (change) => {
      if (change.name === 'preparedOndevicePackages' && !_.isMatch(change.oldValue, change.object[change.name])) {
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
            newFakeHeaderLetter = Object.keys(softwareStore.preparedOndevicePackages)[index];
            return true;
          }
          if (scrollTop >= position - HEADER_HEIGHT) {
            scrollTop -= scrollTop - (position - HEADER_HEIGHT);
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

  startIntervalListScroll() {
    clearInterval(this.tmpIntervalId);
    const that = this;
    const intervalId = setInterval(() => {
      that.listScroll();
    }, 10);
    this.tmpIntervalId = intervalId;
  }

  stopIntervalListScroll() {
    clearInterval(this.tmpIntervalId);
    this.tmpIntervalId = null;
  }

  render() {
    const { device, showPackageBlacklistModal, onFileDrop, stores, t } = this.props;
    const { softwareStore } = stores;
    const {
      ondevicePackagesCurrentPage,
      ondevicePackagesTotalCount,
      ondevicePackagesLimit
    } = softwareStore;
    return (
      <span>
        <div className="ios-list" ref={this.listRef}>
          <InfiniteScroll
            className="wrapper-infinite-scroll"
            hasMore={ondevicePackagesCurrentPage < ondevicePackagesTotalCount / ondevicePackagesLimit}
            isLoading={softwareStore.packagesOndeviceFetchAsync.isFetching}
            useWindow={false}
            loadMore={() => {
              softwareStore.fetchOndevicePackages(device.uuid, softwareStore.ondeviceFilter);
            }}
          >
            {Object.keys(softwareStore.preparedOndevicePackages).length ? (
              <Dropzone
                ref={this.dropzoneRef}
                onDrop={onFileDrop}
                multiple={false}
                disableClick
                className="dnd-zone"
                activeClassName="dnd-zone-active"
              >
                <div className="fake-header" style={{ top: this.fakeHeaderTopPosition }}>
                  {this.fakeHeaderLetter}
                </div>
                {_.map(softwareStore.preparedOndevicePackages, (packages, letter) => (
                  <span key={letter}>
                    <div className="header">{letter}</div>
                    {_.map(packages, (pack, index) => (
                      <ListItem
                        pack={pack}
                        showPackageBlacklistModal={showPackageBlacklistModal}
                        key={index}
                      />
                    ))}
                  </span>
                ))}
              </Dropzone>
            ) : (
              <div className="wrapper-center" style={{ height: '100%' }}>
                {t('devices.hardware.no_packages')}
              </div>
            )}
          </InfiniteScroll>
        </div>
      </span>
    );
  }
}

InstalledList.propTypes = {
  stores: PropTypes.shape({}),
  device: PropTypes.shape({}).isRequired,
  showPackageBlacklistModal: PropTypes.func.isRequired,
  onFileDrop: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

export default withTranslation()(InstalledList);
