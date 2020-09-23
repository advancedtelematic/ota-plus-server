/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observable, observe } from 'mobx';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';
import { VelocityTransitionGroup } from 'velocity-react';
import Dropzone from 'react-dropzone';
import { withTranslation } from 'react-i18next';

import ListItem from './ListItem';
import ListItemVersion from './ListItemVersion';
import withAnimatedScroll from '../../../partials/hoc/withAnimatedScroll';
import { ECU_TYPE_PRIMARY, ECU_TYPE_SECONDARY } from '../../../constants/deviceConstants';
import { EVENTS, SLIDE_ANIMATION_TYPE } from '../../../constants';
import { isFeatureEnabled, UI_FEATURES } from '../../../config';

const HEADER_HEIGHT = 28;
const HEADERS_CUMULATIVE_HEIGHT = 225;
const START_INTERVAL_SCROLL_TIMEOUT_MS = 10;
const ON_PACKAGE_CHANGE_TIMEOUT_MS = 50;
const SCROLL_DURATION = 800;

@inject('stores')
@observer
class List extends Component {
  @observable firstShownIndex = 0;

  @observable lastShownIndex = 50;

  @observable fakeHeaderLetter = null;

  @observable fakeHeaderTopPosition = 0;

  @observable tmpIntervalId = null;

  @observable preparedPackages = {};

  constructor(props) {
    super(props);
    this.listRef = React.createRef();
    this.dropzoneRef = React.createRef();
    const { softwareStore } = props.stores;
    this.packagesChangeHandler = observe(softwareStore, (change) => {
      if (change.name === 'preparedPackages' && !_.isMatch(change.oldValue, change.object[change.name])) {
        const that = this;
        setTimeout(() => {
          that.listScroll();
          that.highlightInstalledPackage(softwareStore.expandedPackage);
        }, ON_PACKAGE_CHANGE_TIMEOUT_MS);
      }
    });
  }

  componentDidMount() {
    this.listRef.current.addEventListener(EVENTS.SCROLL, this.listScroll);
    this.listScroll();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.triggerPackages) {
      this.selectPackagesToDisplay();
      this.addUnmanagedPackage();
    }
  }

  componentWillUnmount() {
    this.packagesChangeHandler();
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
            newFakeHeaderLetter = Object.keys(this.preparedPackages)[index];
            return true;
          } if (scrollTop >= position - HEADER_HEIGHT) {
            scrollTop -= scrollTop - (position - HEADER_HEIGHT);
            return true;
          }
          return null;
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

  /* eslint-disable no-param-reassign */
  clearArray = (array) => {
    _.map(array, (item, index) => {
      if (!array[index].length) {
        delete array[index];
      }
    });
  }

  highlightInstalledPackage(pack) {
    const { animatedScroll } = this.props;
    if (this.listRef.current) {
      let top = null;
      const { scrollTop } = this.listRef.current;
      if (pack.unmanaged) {
        const { top: newTop } = document.querySelector('.software-panel__item-unmanaged').getBoundingClientRect();
        top = newTop;
      } else {
        const { top: newTop } = document.getElementById(`button-package-${pack.id.name}`).getBoundingClientRect();
        top = newTop;
      }
      const scrollTo = scrollTop + top - HEADERS_CUMULATIVE_HEIGHT;
      animatedScroll(this.listRef.current, scrollTo, SCROLL_DURATION);
    }
  }

  startIntervalListScroll() {
    clearInterval(this.tmpIntervalId);
    const that = this;
    const intervalId = setInterval(() => {
      that.listScroll();
    }, START_INTERVAL_SCROLL_TIMEOUT_MS);
    this.tmpIntervalId = intervalId;
  }

  stopIntervalListScroll() {
    clearInterval(this.tmpIntervalId);
    this.tmpIntervalId = null;
  }

  selectPackagesToDisplay() {
    const { stores } = this.props;
    const { devicesStore, softwareStore, hardwareStore } = stores;
    const dirPacks = {};
    _.map(softwareStore.preparedPackages, (packages, letter) => {
      dirPacks[letter] = [];
      _.map(packages, (pack) => {
        const filteredVersions = [];
        _.each(pack.versions, (version) => {
          if (_.includes(version.hardwareIds, hardwareStore.activeEcu.hardwareId)) {
            filteredVersions.push(version);
          }
        });
        if (!_.isEmpty(filteredVersions)) {
          pack.versions = filteredVersions;
          dirPacks[letter].push(pack);
        }
        _.map(pack.versions, (version) => {
          if (hardwareStore.activeEcu.type === ECU_TYPE_PRIMARY) {
            if (version.filepath === devicesStore.getPrimaryFilepath()) {
              const packAdded = _.some(dirPacks[letter], item => item.packageName === version.id.name);
              if (!packAdded) {
                dirPacks[letter].push(pack);
              }
            }
          } else {
            _.map(devicesStore.device.directorAttributes.secondary, (secondaryObj) => {
              if (version.filepath === secondaryObj.image.filepath
                && hardwareStore.activeEcu.serial === secondaryObj.id) {
                const packAdded = _.some(dirPacks[letter], item => item.packageName === version.id.name);
                if (!packAdded) {
                  dirPacks[letter].push(pack);
                }
              }
            });
          }
        });
      });
    });
    this.clearArray(dirPacks);
    this.preparedPackages = dirPacks;
  }

  addUnmanagedPackage() {
    const { stores } = this.props;
    const { devicesStore, softwareStore, hardwareStore } = stores;
    const { preparedPackages } = this;
    let ecuObject = null;
    switch (hardwareStore.activeEcu.type) {
      case ECU_TYPE_SECONDARY:
        ecuObject = devicesStore.getSecondaryBySerial(hardwareStore.activeEcu.serial);
        break;
      case ECU_TYPE_PRIMARY:
        ecuObject = devicesStore.getPrimaryByHardwareId(hardwareStore.activeEcu.hardwareId);
        break;
      default:
        break;
    }
    const { filepath } = ecuObject.image;
    const hash = ecuObject.image.hash.sha256;
    const { size } = ecuObject.image;
    const pack = softwareStore.getInstalledPackage(filepath, hardwareStore.activeEcu.hardwareId);
    if (!pack) {
      const unmanagedPack = {
        filepath,
        size,
        hash,
        unmanaged: true,
      };
      if (_.isUndefined(preparedPackages['#'])) {
        preparedPackages['#'] = [];
      }
      preparedPackages['#'].push(unmanagedPack);
    }
  }

  checkQueued(version) {
    const { stores } = this.props;
    const { devicesStore, hardwareStore } = stores;
    let queuedPackage = null;
    const { serial } = hardwareStore.activeEcu;
    _.each(devicesStore.multiTargetUpdates, (update) => {
      if (!_.isEmpty(update.targets[serial])) {
        if (update.targets[serial].image.filepath === version.filepath) {
          queuedPackage = version.filepath;
        }
      }
    });
    return queuedPackage;
  }

  checkInstalled(version) {
    const { stores } = this.props;
    const { devicesStore, hardwareStore } = stores;
    const { device } = devicesStore;
    let installedPackage = null;
    if (hardwareStore.activeEcu.type === ECU_TYPE_PRIMARY) {
      if (version.filepath === devicesStore.getPrimaryFilepath()) {
        installedPackage = version.id.version;
      }
    } else {
      _.each(device.directorAttributes.secondary, (secondaryObj) => {
        if (secondaryObj.id === hardwareStore.activeEcu.serial && version.filepath === secondaryObj.image.filepath) {
          installedPackage = version.id.version;
        }
      });
    }
    return installedPackage;
  }
  /* eslint-enable no-param-reassign */

  render() {
    const {
      onFileDrop,
      togglePackageAutoUpdate,
      showPackageDetails,
      expandedPackageName,
      togglePackage,
      stores,
      t
    } = this.props;
    const { devicesStore, userStore } = stores;
    const { uiFeatures } = userStore;
    const { device } = devicesStore;
    const { preparedPackages } = this;
    return (
      <div className="ios-list" ref={this.listRef}>
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
          {_.map(preparedPackages, (packages, letter) => (
            <span key={letter}>
              <div className="header">{letter}</div>
              {_.map(packages, (pack, index) => {
                const that = this;
                let queuedPackage = null;
                let installedPackage = null;
                _.each(pack.versions, (version) => {
                  if (!installedPackage) {
                    installedPackage = this.checkInstalled(version);
                  }
                  if (!queuedPackage) {
                    queuedPackage = this.checkQueued(version);
                  }
                });
                return (
                  <span key={index}>
                    <ListItem
                      pack={pack}
                      device={device}
                      queuedPackage={queuedPackage}
                      installedPackage={installedPackage}
                      isSelected={expandedPackageName === pack.packageName}
                      togglePackage={togglePackage}
                      toggleAutoInstall={togglePackageAutoUpdate}
                      showPackageDetails={showPackageDetails}
                      isAutoUpdateEnabled={isFeatureEnabled(uiFeatures, UI_FEATURES.SET_AUTO_UPDATE)}
                    />
                    <VelocityTransitionGroup
                      enter={{
                        animation: SLIDE_ANIMATION_TYPE.DOWN,
                        begin: () => {
                          that.startIntervalListScroll();
                        },
                        complete: () => {
                          that.stopIntervalListScroll();
                        },
                      }}
                      leave={{
                        animation: SLIDE_ANIMATION_TYPE.UP,
                        begin: () => {
                          that.startIntervalListScroll();
                        },
                        complete: () => {
                          that.stopIntervalListScroll();
                        },
                      }}
                    >
                      {expandedPackageName === pack.packageName ? (
                        <ul className="software-panel__details">
                          <li>
                            <VelocityTransitionGroup
                              enter={{
                                animation: SLIDE_ANIMATION_TYPE.DOWN,
                                begin: () => {
                                  that.startIntervalListScroll();
                                },
                                complete: () => {
                                  that.stopIntervalListScroll();
                                },
                              }}
                              leave={{
                                animation: SLIDE_ANIMATION_TYPE.UP,
                                begin: () => {
                                  that.startIntervalListScroll();
                                },
                                complete: () => {
                                  that.stopIntervalListScroll();
                                },
                              }}
                            >
                              {pack.isAutoInstallEnabled ? (
                                <div className="software-panel__auto-update-tip">
                                  {t('devices.software.auto_update_info')}
                                </div>
                              ) : null}
                            </VelocityTransitionGroup>
                          </li>
                          <li>
                            <ul className="software-panel__versions">
                              {_.map(pack.versions, (version, i) => (
                                <ListItemVersion
                                  version={version}
                                  queuedPackage={queuedPackage}
                                  installedPackage={installedPackage}
                                  showPackageDetails={showPackageDetails}
                                  key={i}
                                />
                              ))}
                            </ul>
                          </li>
                        </ul>
                      ) : null}
                    </VelocityTransitionGroup>
                  </span>
                );
              })}
            </span>
          ))}
        </Dropzone>
      </div>
    );
  }
}

List.propTypes = {
  stores: PropTypes.shape({}),
  onFileDrop: PropTypes.func.isRequired,
  togglePackageAutoUpdate: PropTypes.func.isRequired,
  showPackageDetails: PropTypes.func.isRequired,
  triggerPackages: PropTypes.bool,
  animatedScroll: PropTypes.func,
  expandedPackageName: PropTypes.string,
  t: PropTypes.func.isRequired,
  togglePackage: PropTypes.func
};

export default withAnimatedScroll(withTranslation()(List));
