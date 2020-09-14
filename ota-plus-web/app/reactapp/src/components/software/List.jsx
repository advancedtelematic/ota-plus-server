/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observable, observe } from 'mobx';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';
import { withTranslation } from 'react-i18next';
import { VelocityTransitionGroup } from 'velocity-react';
import Dropzone from 'react-dropzone';
import ListItem from './ListItem';
import ListItemVersion from './ListItemVersion';
import { SoftwareVersionsStats } from './stats';
import { Dropdown, ConfirmationModal } from '../../partials';
import withAnimatedScroll from '../../partials/hoc/withAnimatedScroll';
import { sendAction } from '../../helpers/analyticsHelper';
import { OTA_SOFTWARE_SEE_DETAILS, OTA_SOFTWARE_DELETE_SOFTWARE } from '../../constants/analyticsActions';
import { EVENTS, SLIDE_ANIMATION_TYPE } from '../../constants';
import { UI_FEATURES, isFeatureEnabled } from '../../config';

const headerHeight = 28;
const HEADERS_CUMULATIVE_HEIGHT = 150;
const ON_HIGHLIGHT_PACKAGE_TRANSITION_DURATION_MS = 500;
const ON_HIGHLIGHT_PACKAGE_TRANSITION_TIMEOUT_MS = 400;
const ON_PACKAGE_CHANGE_TIMEOUT_MS = 50;
const START_INTERVAL_SCROLL_TIMEOUT_MS = 10;

@inject('stores')
@observer
class List extends Component {
  @observable firstShownIndex = 0;

  @observable lastShownIndex = 50;

  @observable fakeHeaderLetter = null;

  @observable fakeHeaderTopPosition = 0;

  @observable tmpIntervalId = null;

  @observable submenuIsShown = false;

  @observable editModal = false;

  @observable deleteModal = false;

  @observable packVersions = [];

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
        }, ON_PACKAGE_CHANGE_TIMEOUT_MS);
      }
    });
  }

  componentDidMount() {
    this.listRef.current.addEventListener(EVENTS.SCROLL, this.listScroll);
    this.listScroll();
  }

  componentWillReceiveProps(nextProps) {
    const { highlightedPackage } = this.props;
    if (nextProps.highlightedPackage !== highlightedPackage) {
      this.highlightPackage(nextProps.highlightedPackage);
    }
  }

  componentWillUnmount() {
    this.packagesChangeHandler();
    this.listRef.current.removeEventListener(EVENTS.SCROLL, this.listScroll);
  }

  hideEditModal = () => {
    this.editModal = false;
  };

  showEditModal = () => {
    this.editModal = true;
  };

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
            newFakeHeaderLetter = Object.keys(softwareStore.preparedPackages)[index];
            return true;
          } if (scrollTop >= position - headerHeight) {
            scrollTop -= scrollTop - (position - headerHeight);
            return true;
          }
          return true;
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

  highlightPackage = (pack) => {
    const { animatedScroll, setExpandedPackageName } = this.props;
    if (this.listRef.current && pack) {
      setExpandedPackageName(pack);
      const currentScrollTop = this.listRef.current.scrollTop;
      const elementCoords = document.getElementById(`button-package-${pack}`).getBoundingClientRect();
      const scrollTo = currentScrollTop + elementCoords.top - HEADERS_CUMULATIVE_HEIGHT;
      setTimeout(() => {
        animatedScroll(document.querySelector('.ios-list'), scrollTo, ON_HIGHLIGHT_PACKAGE_TRANSITION_DURATION_MS);
      }, ON_HIGHLIGHT_PACKAGE_TRANSITION_TIMEOUT_MS);
    }
  };

  togglePackage = (packageName, e) => {
    const { expandedPackageName, setExpandedPackageName, stores } = this.props;
    const { softwareStore } = stores;
    if (e) e.preventDefault();
    softwareStore.handleCompatibles();
    setExpandedPackageName(expandedPackageName !== packageName ? packageName : null);
    if (!expandedPackageName) {
      sendAction(OTA_SOFTWARE_SEE_DETAILS);
    }
  };

  hideSubmenu = () => {
    this.submenuIsShown = false;
  };

  showSubmenu = () => {
    this.submenuIsShown = true;
  };

  showDeleteModal = () => {
    this.deleteModal = true;
  };

  hideDeleteModal = () => {
    this.deleteModal = false;
  };

  startIntervalListScroll() {
    clearInterval(this.tmpIntervalId);
    const intervalId = setInterval(() => {
      this.listScroll();
    }, START_INTERVAL_SCROLL_TIMEOUT_MS);
    this.tmpIntervalId = intervalId;
  }

  stopIntervalListScroll() {
    clearInterval(this.tmpIntervalId);
    this.tmpIntervalId = null;
  }

  render() {
    const {
      stores,
      onFileDrop,
      highlightedPackage,
      showDependenciesModal,
      showDependenciesManager,
      showDeleteConfirmation,
      expandedPackageName,
      showEditComment,
      t
    } = this.props;
    const { softwareStore, userStore } = stores;

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
          {_.map(softwareStore.preparedPackages, (packages, letter) => (
            <div key={letter}>
              {_.map(packages, (pack, index) => {
                const that = this;
                return (
                  <span key={index} className="c-package">
                    <ListItem
                      pack={pack}
                      expandedPackageName={expandedPackageName}
                      togglePackage={this.togglePackage}
                      highlightedPackage={highlightedPackage}
                      highlightPackage={this.highlightPackage}
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
                      {expandedPackageName === pack.packageName && (
                        <div className="c-package__details">
                          <div className="c-package__main-name">
                            <span>{pack.packageName}</span>
                            {isFeatureEnabled(userStore.uiFeatures, UI_FEATURES.DELETE_SOFTWARE) && (
                              <div className="dots" id="package-menu" onClick={() => this.showSubmenu()}>
                                <span />
                                <span />
                                <span />
                                {this.submenuIsShown && (
                                  <Dropdown hideSubmenu={this.hideSubmenu}>
                                    <li className="package-dropdown-item">
                                      <a
                                        className="package-dropdown-item"
                                        href="#"
                                        id="edit-comment"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          this.packVersions = pack.versions;
                                          this.showDeleteModal();
                                          sendAction(OTA_SOFTWARE_DELETE_SOFTWARE);
                                        }}
                                      >
                                        {t('software.action_buttons.delete_software')}
                                      </a>
                                    </li>
                                  </Dropdown>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="c-package__versions-wrapper">
                            <div className="c-package__chart">
                              <div className="c-package__heading">
                                {t('software.details.distribution_by_devices')}
                              </div>
                              <SoftwareVersionsStats pack={pack} />
                            </div>
                            <ul className="c-package__versions" id="versions">
                              {_.map(pack.versions, (version, i) => (
                                <ListItemVersion
                                  pack={pack}
                                  version={version}
                                  showDependenciesModal={showDependenciesModal}
                                  showDependenciesManager={showDependenciesManager}
                                  showDeleteConfirmation={showDeleteConfirmation}
                                  showEditComment={showEditComment}
                                  key={i}
                                />
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </VelocityTransitionGroup>
                  </span>
                );
              })}
            </div>
          ))}
        </Dropzone>
        {this.deleteModal ? (
          <ConfirmationModal
            modalTitle={(
              <div className="text-red" id="delete-all-versions-title">
                {t('software.delete_soft_modal.title')}
              </div>
            )}
            hide={this.hideDeleteModal}
            shown={this.deleteModal}
            deleteItem={() => {
              softwareStore.deleteAllVersions(this.packVersions);
              this.hideDeleteModal();
            }}
            topText={(
              <div className="delete-modal-top-text" id="delete-all-versions-top-text">
                {t('software.delete_soft_modal.warnings.top')}
              </div>
            )}
            bottomText={(
              <div className="delete-modal-bottom-text" id="delete-all-versions-bottom-text">
                {t('software.delete_soft_modal.warnings.bottom')}
              </div>
            )}
            showDetailedInfo
          />
        ) : null}
      </div>
    );
  }
}

List.propTypes = {
  stores: PropTypes.shape({}),
  onFileDrop: PropTypes.func.isRequired,
  highlightedPackage: PropTypes.string,
  showDependenciesModal: PropTypes.func,
  showDependenciesManager: PropTypes.func,
  showDeleteConfirmation: PropTypes.func,
  expandedPackageName: PropTypes.string,
  showEditComment: PropTypes.func,
  setExpandedPackageName: PropTypes.func,
  animatedScroll: PropTypes.func,
  t: PropTypes.func.isRequired
};

export default withTranslation()(withAnimatedScroll(List));
