/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';
import { withTranslation } from 'react-i18next';
import { Tooltip } from 'antd';

import { ECU_TYPE_PRIMARY, ECU_TYPE_SECONDARY } from '../../../constants/deviceConstants';
import { DEVICE_PROPERTIES_DATE_FORMAT } from '../../../constants/datesTimesConstants';
import { getFormattedDateTime } from '../../../helpers/datesTimesHelper';
import { BAN_ICON_RED, CROSS_ICON_RED, TICK_ICON_GREEN } from '../../../config';

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
    if (hardwareStore.activeEcu.type === ECU_TYPE_PRIMARY && devicesStore.getPrimaryFilepath() === version.filepath) {
      isInstalled = true;
    }
    if (hardwareStore.activeEcu.type === ECU_TYPE_SECONDARY) {
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
    const { installPackage, stores, t } = this.props;
    const { softwareStore, devicesStore } = stores;

    const isPackageBlocklisted = false;
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
    const installButtonDisabled = isPackageQueued || isPackageInstalled || devicesStore.multiTargetUpdates.length;
    const unmanagedPackage = (
      <div className="wrapper-center">
        {t('devices.mtu.properties.installed_outside_ota_description')}
      </div>
    );
    const noPackage = (
      <div className="wrapper-center absolute-position">
        {t('devices.mtu.properties.select_package_description')}
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
                {isPackageBlocklisted && isPackageInstalled ? (
                  <div>
                    <span id={this.generateIdTag('blocklisted-and-installed', expandedPackage)}>
                      {t('common.statuses.installed')}
                    </span>
                    <img
                      className="properties-panel__info-status-icon"
                      src={CROSS_ICON_RED}
                      alt=""
                      id={this.generateIdTag('blocklisted-and-installed-icon', expandedPackage)}
                    />
                  </div>
                ) : isPackageBlocklisted ? (
                  <div>
                    <span id={this.generateIdTag('blocklisted', expandedPackage)}>
                      {t('common.statuses.blocklisted')}
                    </span>
                    <img
                      className="properties-panel__info-status-icon"
                      src={BAN_ICON_RED}
                      alt=""
                      id={this.generateIdTag('blocklisted-icon', expandedPackage)}
                    />
                  </div>
                ) : isPackageQueued ? (
                  <div>
                    <span id={this.generateIdTag('queued', expandedPackage)}>
                      {t('common.statuses.queued')}
                    </span>
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
                    <span id="image-installed-checkmark">{t('common.statuses.installed')}</span>
                    <img
                      className="properties-panel__info-status-icon"
                      src={TICK_ICON_GREEN}
                      alt=""
                      id={this.generateIdTag('installed-icon', expandedPackage)}
                    />
                  </div>
                ) : (
                  <div id={this.generateIdTag('not-installed', expandedPackage)}>
                    {t('common.statuses.not_installed')}
                  </div>
                )}
              </div>
            </div>
            <div className="properties-panel__info-data">
              <span>
                <div className="properties-panel__info-data-block">
                  <span className="properties-panel__info-data-subtitle">
                    {t('devices.mtu.properties.name')}
                  </span>
                  <span
                    className="properties-panel__info-data-value"
                    id={this.generateIdTag('version-name-value', expandedPackage)}
                  >
                    {expandedPackage.customExists ? expandedPackage.id.name : t('devices.mtu.properties.not_reported')}
                  </span>
                </div>
                <div className="properties-panel__info-data-block">
                  <span className="properties-panel__info-data-subtitle">{t('devices.mtu.properties.created')}</span>
                  <span
                    className="properties-panel__info-data-value"
                    id={this.generateIdTag('version-created-at-value', expandedPackage)}
                  >
                    {getFormattedDateTime(expandedPackage.createdAt, DEVICE_PROPERTIES_DATE_FORMAT)}
                  </span>
                </div>
                <div className="properties-panel__info-data-block">
                  <span className="properties-panel__info-data-subtitle">{t('devices.mtu.properties.updated')}</span>
                  <span
                    className="properties-panel__info-data-value"
                    id={this.generateIdTag('version-updated-at-value', expandedPackage)}
                  >
                    {getFormattedDateTime(expandedPackage.updatedAt, DEVICE_PROPERTIES_DATE_FORMAT)}
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
                  <span className="properties-panel__info-data-subtitle">Control unit types:</span>
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
            <Tooltip title={t('devices.mtu.properties.install_tooltip')} placement="left">
              <button
                type="button"
                className={`properties-panel__install-button btn-primary ${installButtonDisabled ? 'disabled' : ''}`}
                label={t('devices.mtu.properties.install')}
                title={t('devices.mtu.properties.install')}
                id={`button-install-package-${expandedPackage.id.name}-${expandedPackage.id.version}`}
                onClick={() => installButtonDisabled
                  ? undefined
                  : installPackage({
                    target: expandedPackage.filepath,
                    hash: expandedPackage.packageHash,
                    targetLength: expandedPackage.targetLength,
                    targetFormat: expandedPackage.targetFormat,
                    generateDiff: false,
                  })
                }

              >
                {t('devices.mtu.properties.install')}
              </button>
            </Tooltip>
          </div>
        )}
        {isPackageBlocklisted && isPackageInstalled ? (
          <div className="properties-panel__bottom-status properties-panel__bottom-status--red">
            {t('common.statuses.installed')}
          </div>
        ) : isPackageBlocklisted ? (
          <div className="properties-panel__bottom-status properties-panel__bottom-status--red">
            {t('common.statuses.blocklisted')}
          </div>
        ) : isPackageQueued ? (
          <div className="properties-panel__bottom-status properties-panel__bottom-status--orange">
            {t('common.statuses.queued')}
          </div>
        ) : isPackageInstalled && (
          <div className="properties-panel__bottom-status properties-panel__bottom-status--green">
            {t('common.statuses.installed')}
          </div>
        )}
      </span>
    );
  }
}

List.propTypes = {
  installPackage: PropTypes.func.isRequired,
  stores: PropTypes.shape({}),
  t: PropTypes.func.isRequired
};

export default withTranslation()(List);
