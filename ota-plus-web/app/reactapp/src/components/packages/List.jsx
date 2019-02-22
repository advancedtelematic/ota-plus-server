/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observable, observe } from 'mobx';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';
import { VelocityTransitionGroup } from 'velocity-react';
import Dropzone from 'react-dropzone';
import ListItem from './ListItem';
import ListItemVersion from './ListItemVersion';
import { PackagesVersionsStats } from './stats';
import { Loader, Dropdown, EditPackageModal, ConfirmationModal } from '../../partials';
import withAnimatedScroll from '../../partials/hoc/withAnimatedScroll';

const headerHeight = 28;

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
  hideEditModal = () => {
    this.editModal = false;
  };
  showEditModal = () => {
    this.editModal = true;
  };
  generateHeadersPositions = () => {
    const headers = this.refs.list.getElementsByClassName('header');
    const wrapperPosition = this.refs.list.getBoundingClientRect();
    let positions = [];
    _.each(
      headers,
      header => {
        let position = header.getBoundingClientRect().top - wrapperPosition.top + this.refs.list.scrollTop;
        positions.push(position);
      },
      this,
    );
    return positions;
  };
  generateItemsPositions = () => {
    const items = this.refs.list.getElementsByClassName('item');
    const wrapperPosition = this.refs.list.getBoundingClientRect();
    let positions = [];
    _.each(
      items,
      item => {
        let position = item.getBoundingClientRect().top - wrapperPosition.top + this.refs.list.scrollTop;
        positions.push(position);
      },
      this,
    );
    return positions;
  };
  listScroll = () => {
    const { packagesStore } = this.props.stores;
    if (this.refs.list) {
      const headersPositions = this.generateHeadersPositions();
      const itemsPositions = this.generateItemsPositions();
      let scrollTop = this.refs.list.scrollTop;
      let listHeight = this.refs.list.getBoundingClientRect().height;
      let newFakeHeaderLetter = this.fakeHeaderLetter;
      let firstShownIndex = null;
      let lastShownIndex = null;
      _.each(
        headersPositions,
        (position, index) => {
          if (scrollTop >= position) {
            newFakeHeaderLetter = Object.keys(packagesStore.preparedPackages)[index];
            return true;
          } else if (scrollTop >= position - headerHeight) {
            scrollTop -= scrollTop - (position - headerHeight);
            return true;
          }
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
  highlightPackage = pack => {
    const { animatedScroll, setExpandedPackageName } = this.props;
    if (this.refs.list && pack) {
      setExpandedPackageName(pack);
      const currentScrollTop = this.refs.list.scrollTop;
      const elementCoords = document.getElementById('button-package-' + pack).getBoundingClientRect();
      let scrollTo = currentScrollTop + elementCoords.top - 150;
      setTimeout(() => {
        animatedScroll(document.querySelector('.ios-list'), scrollTo, 500);
      }, 400);
    }
  };
  togglePackage = (packageName, e) => {
    const { expandedPackageName, setExpandedPackageName } = this.props;
    const { packagesStore } = this.props.stores;
    if (e) e.preventDefault();
    packagesStore._handleCompatibles();
    setExpandedPackageName(expandedPackageName !== packageName ? packageName : null);
  };
  hideSubmenu = () => {
    this.submenuIsShown = false;
  };
  showSubmenu = versions => {
    this.submenuIsShown = true;
  };
  showDeleteModal = () => {
    this.deleteModal = true;
  };
  hideDeleteModal = () => {
    this.deleteModal = false;
  };

  constructor(props) {
    super(props);
    const { packagesStore } = props.stores;
    this.packagesChangeHandler = observe(packagesStore, change => {
      if (change.name === 'preparedPackages' && !_.isMatch(change.oldValue, change.object[change.name])) {
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.highlightedPackage !== this.props.highlightedPackage) {
      this.highlightPackage(nextProps.highlightedPackage);
    }
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
    const { stores, onFileDrop, highlightedPackage, showDependenciesModal, showDependenciesManager, showDeleteConfirmation, expandedPackageName, showEditComment } = this.props;
    const { packagesStore, featuresStore } = stores;
    const { alphaPlusEnabled } = featuresStore;

    return (
      <div className='ios-list' ref='list' style={{height: `calc(100vh - ${alphaPlusEnabled ? '100px' : '50px'})`}}>
        <Dropzone ref='dropzone' onDrop={onFileDrop} multiple={false} disableClick={true} className='dnd-zone' activeClassName={'dnd-zone-active'}>
          {/*
           * ToDo: drop quick & dirty solution
           */}
          <div className='packages-list__header'>
            <div className='packages-list__column-title'>Title</div>
            <div className='packages-list__column-versions'>Versions</div>
            <div className='packages-list__column-ecu-installed'>#ECU</div>
            <div className='packages-list__column-last'>{' '}</div>
          </div>
          {_.map(packagesStore.preparedPackages, (packages, letter) => {
            return (
              <div className='packages-list' key={letter}>
                {_.map(packages, (pack, index) => {
                  const that = this;
                  return (
                    <span key={index} className='c-package'>
                      <ListItem pack={pack} expandedPackageName={expandedPackageName} togglePackage={this.togglePackage} highlightedPackage={highlightedPackage} highlightPackage={this.highlightPackage}/>
                      <VelocityTransitionGroup
                        enter={{
                          animation: 'slideDown',
                          begin: () => {
                            that.startIntervalListScroll();
                          },
                          complete: () => {
                            that.stopIntervalListScroll();
                          },
                        }}
                        leave={{
                          animation: 'slideUp',
                          begin: () => {
                            that.startIntervalListScroll();
                          },
                          complete: () => {
                            that.stopIntervalListScroll();
                          },
                        }}
                      >
                        {expandedPackageName === pack.packageName ? (
                          <div className='c-package__details'>
                            <div className='c-package__main-name'>
                              <span>{pack.packageName}</span>
                              <div className='dots' id='package-menu' onClick={() => this.showSubmenu()}>
                                <span />
                                <span />
                                <span />

                                {this.submenuIsShown ? (
                                  <Dropdown hideSubmenu={this.hideSubmenu}>
                                    <li className='package-dropdown-item'>
                                      <a
                                        className='package-dropdown-item'
                                        href='#'
                                        id='edit-comment'
                                        onClick={e => {
                                          e.preventDefault();
                                          this.packVersions = pack.versions;
                                          this.showDeleteModal();
                                        }}
                                      >
                                        <img src='/assets/img/icons/trash_icon.svg' alt='Icon' />
                                        Delete
                                      </a>
                                    </li>
                                  </Dropdown>
                                ) : null}
                              </div>
                            </div>
                            <div className='c-package__versions-wrapper'>
                              <div className='c-package__chart'>
                                <div className='c-package__heading'>Distribution by devices</div>
                                <PackagesVersionsStats pack={pack} />
                              </div>
                              <ul className='c-package__versions' id='versions'>
                                {_.map(pack.versions, (version, i) => {
                                  return (
                                    <ListItemVersion
                                      pack={pack}
                                      version={version}
                                      showDependenciesModal={showDependenciesModal}
                                      showDependenciesManager={showDependenciesManager}
                                      showDeleteConfirmation={showDeleteConfirmation}
                                      showEditComment={showEditComment}
                                      key={i}
                                    />
                                  );
                                })}
                              </ul>
                            </div>
                          </div>
                        ) : null}
                      </VelocityTransitionGroup>
                    </span>
                  );
                })}
              </div>
            );
          })}
        </Dropzone>
        {this.deleteModal ? (
          <ConfirmationModal
            modalTitle={
              <div className='text-red' id='delete-all-versions-title'>
                Delete all versions
              </div>
            }
            hide={this.hideDeleteModal}
            shown={this.deleteModal}
            deleteItem={() => {
              packagesStore.deleteAllVersions(this.packVersions);
              this.hideDeleteModal();
            }}
            topText={
              <div className='delete-modal-top-text' id='delete-all-versions-top-text'>
                All package versions will be removed.
              </div>
            }
            bottomText={
              <div className='delete-modal-bottom-text' id='delete-all-versions-bottom-text'>
                If the package is part of any active campaigns, any devices that haven't installed it will fail the campaign.
              </div>
            }
            showDetailedInfo={true}
          />
        ) : null}
      </div>
    );
  }
}

List.propTypes = {
  stores: PropTypes.object,
  onFileDrop: PropTypes.func.isRequired,
  highlightedPackage: PropTypes.string,
};

export default withAnimatedScroll(List);
