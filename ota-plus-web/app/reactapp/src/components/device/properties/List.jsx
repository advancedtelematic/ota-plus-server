/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';
import moment from 'moment';

const install = 'Install';
const installed = 'Installed';
const notInstalled = 'Not Installed';
const blacklisted = 'Blacklisted';
const queued = 'Queued';

@inject('stores')
@observer
class List extends Component {
  classNameForPanelInfo = (isPackageInstalled, isPackageQueued) => {
    if (isPackageQueued) {
      return 'properties-panel__info queued';
    }
    if (!isPackageInstalled) {
      return 'properties-panel__info not-installed';
    }
    return 'properties-panel__info';
  };

  generateIdTag = (tagName, obj) => `${tagName}-${obj.id.version.substring(0, 8)}`;

  isPackageInstalled(version) {
    const { stores } = this.props;
    const { devicesStore, hardwareStore } = stores;
    let isInstalled = false;
    if (hardwareStore.activeEcu.type === 'primary' && devicesStore.getPrimaryFilepath() === version.filepath) {
      isInstalled = true;
    }
    if (hardwareStore.activeEcu.type === 'secondary') {
      const { serial } = hardwareStore.activeEcu;
      if (_.includes(devicesStore.getSecondaryFilepathsBySerial(serial), version.filepath)) {
        isInstalled = true;
      }
    }
    return isInstalled;
  }

  isPackageQueued(version) {
    const { stores } = this.props;
    const { devicesStore, hardwareStore } = stores;
    let isPackageQueued = false;
    const { serial } = hardwareStore.activeEcu;
    _.each(devicesStore.multiTargetUpdates, (update) => {
      if (!_.isEmpty(update.targets[serial])) {
        if (version.filepath === update.targets[serial].image.filepath) {
          isPackageQueued = true;
        }
      }
    });
    return isPackageQueued;
  }

  render() {
    const { installPackage, stores } = this.props;
    const { softwareStore, devicesStore } = stores;

    const isPackageBlacklisted = false;
    let isPackageQueued = false;
    let isPackageInstalled = false;
    let unmanaged = false;

    const { expandedPackage } = softwareStore;
    if (!expandedPackage.unmanaged) {
      isPackageQueued = this.isPackageQueued(expandedPackage);
      isPackageInstalled = this.isPackageInstalled(expandedPackage);
    } else {
      unmanaged = true;
      isPackageInstalled = true;
    }
    const unmanagedPackage = (
      <div className="wrapper-center">
        {'This software was installed outside of OTA Connect so there are no details to display.'}
      </div>
    );
    const noPackage = (
      <div className="wrapper-center absolute-position">
        Select the package version to see its details.
      </div>
    );
    return (
      <span>
        {!unmanaged ? (
          <div className={this.classNameForPanelInfo(isPackageInstalled, isPackageQueued)}>
            <div className="properties-panel__info-heading">
              <div className="properties-panel__info-title" id={`image-title-${expandedPackage.id.name}`}>
                {expandedPackage.id.name}
              </div>
              <div className="properties-panel__info-status">
                {isPackageBlacklisted && isPackageInstalled ? (
                  <div>
                    <span id={this.generateIdTag('blacklisted-and-installed', expandedPackage)}>{installed}</span>
                    <img
                      className="properties-panel__info-status-icon"
                      src="/assets/img/icons/red_cross.svg"
                      alt=""
                      id={this.generateIdTag('blacklisted-and-installed-icon', expandedPackage)}
                    />
                  </div>
                ) : isPackageBlacklisted ? (
                  <div>
                    <span id={this.generateIdTag('blacklisted', expandedPackage)}>{blacklisted}</span>
                    <img
                      className="properties-panel__info-status-icon"
                      src="/assets/img/icons/ban_red.png"
                      alt=""
                      id={this.generateIdTag('blacklisted-icon', expandedPackage)}
                    />
                  </div>
                ) : isPackageQueued ? (
                  <div>
                    <span id={this.generateIdTag('queued', expandedPackage)}>{queued}</span>
                    <span className="fa-stack queued">
                      <i
                        className="properties-panel__info-status-icon
                                  properties-panel__info-status-icon--queued
                                  fa fa-dot-circle-o fa-stack-1x"
                        aria-hidden="true"
                        id={this.generateIdTag('queued-icon', expandedPackage)}
                      />
                    </span>
                  </div>
                ) : isPackageInstalled ? (
                  <div>
                    <span id="image-installed-checkmark">{installed}</span>
                    <img
                      className="properties-panel__info-status-icon"
                      src="/assets/img/icons/green_tick.svg"
                      alt=""
                      id={this.generateIdTag('installed-icon', expandedPackage)}
                    />
                  </div>
                ) : (
                  <div id={this.generateIdTag('not-installed', expandedPackage)}>{notInstalled}</div>
                )}
              </div>
            </div>
            <div className="properties-panel__info-data">
              <span>
                <div className="properties-panel__info-data-block">
                  <span className="properties-panel__info-data-subtitle">Name:</span>
                  <span
                    className="properties-panel__info-data-value"
                    id={this.generateIdTag('version-name-value', expandedPackage)}
                  >
                    {expandedPackage.customExists ? expandedPackage.id.name : 'Not reported'}
                  </span>
                </div>
                <div className="properties-panel__info-data-block">
                  <span className="properties-panel__info-data-subtitle">Created at:</span>
                  <span
                    className="properties-panel__info-data-value"
                    id={this.generateIdTag('version-created-at-value', expandedPackage)}
                  >
                    {moment(expandedPackage.createdAt).format('ddd MMM DD YYYY, h:mm:ss A')}
                  </span>
                </div>
                <div className="properties-panel__info-data-block">
                  <span className="properties-panel__info-data-subtitle">Updated at:</span>
                  <span
                    className="properties-panel__info-data-value"
                    id={this.generateIdTag('version-updated-at-value', expandedPackage)}
                  >
                    {moment(expandedPackage.updatedAt).format('ddd MMM DD YYYY, h:mm:ss A')}
                  </span>
                </div>
                <div className="properties-panel__info-data-block">
                  <span className="properties-panel__info-data-subtitle">Version:</span>
                  <span
                    className="properties-panel__info-data-value"
                    id={this.generateIdTag('version-value', expandedPackage)}
                  >
                    {expandedPackage.customExists ? expandedPackage.id.version : 'Not reported'}
                  </span>
                </div>
                <div className="properties-panel__info-data-block">
                  <span className="properties-panel__info-data-subtitle">Hash:</span>
                  <span
                    className="properties-panel__info-data-value"
                    id={this.generateIdTag('version-hash-value', expandedPackage)}
                  >
                    {expandedPackage.packageHash}
                  </span>
                </div>
                <div className="properties-panel__info-data-block">
                  <span className="properties-panel__info-data-subtitle">Length:</span>
                  <span
                    className="properties-panel__info-data-value"
                    id={this.generateIdTag('version-hash-length-value', expandedPackage)}
                  >
                    {expandedPackage.targetLength}
                  </span>
                </div>
                <div className="properties-panel__info-data-block">
                  <span className="properties-panel__info-data-subtitle">ECU types:</span>
                  <span id={this.generateIdTag('version-hardware-types-value', expandedPackage)}>
                    {_.map(expandedPackage.hardwareIds, (hardwareId, index) => (
                      <span className="app-label" key={index}>
                        {hardwareId}
                      </span>
                    ))}
                  </span>
                </div>
                {expandedPackage.targetFormat ? (
                  <div className="properties-panel__info-data-block">
                    <span className="properties-panel__info-data-subtitle">Format:</span>
                    <span id={this.generateIdTag('version-target-format-value', expandedPackage)}>
                      <span className="app-label">{expandedPackage.targetFormat}</span>
                    </span>
                  </div>
                ) : null}
              </span>
            </div>
            <div className="properties-panel__info-comment">
              <div className="properties-panel__info-comment-title">Comment</div>
              <textarea
                className="properties-panel__info-comment-value"
                name="comment-stick"
                rows="8"
                value={expandedPackage.comment}
                disabled
                id={`package-${expandedPackage.id.name}-comment-${expandedPackage.id.version.substring(0, 8)}`}
              />
            </div>
          </div>
        ) : unmanaged ? (
          unmanagedPackage
        ) : (
          noPackage
        )}
        {!isPackageInstalled && (
          <div className={isPackageQueued ? 'properties-panel__install' : 'properties-panel__install not-installed'}>
            <button
              type="button"
              className="properties-panel__install-button btn-primary"
              label="Install"
              title="Install"
              id={`button-install-package-${expandedPackage.id.name}-${expandedPackage.id.version}`}
              onClick={installPackage.bind(this, {
                target: expandedPackage.filepath,
                hash: expandedPackage.packageHash,
                targetLength: expandedPackage.targetLength,
                targetFormat: expandedPackage.targetFormat,
                generateDiff: false,
              })}
              disabled={isPackageQueued || isPackageInstalled || devicesStore.multiTargetUpdates.length}
            >
              {install}
            </button>
          </div>
        )}
        {isPackageBlacklisted && isPackageInstalled ? (
          <div className="properties-panel__bottom-status properties-panel__bottom-status--red">{installed}</div>
        ) : isPackageBlacklisted ? (
          <div className="properties-panel__bottom-status properties-panel__bottom-status--red">{blacklisted}</div>
        ) : isPackageQueued ? (
          <div className="properties-panel__bottom-status properties-panel__bottom-status--orange">{queued}</div>
        ) : isPackageInstalled && (
          <div className="properties-panel__bottom-status properties-panel__bottom-status--green">{installed}</div>
        )}
      </span>
    );
  }
}

List.propTypes = {
  stores: PropTypes.shape({}),
  installPackage: PropTypes.func.isRequired,
};

export default List;
