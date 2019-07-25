/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withTranslation } from 'react-i18next';
import { Tooltip } from 'antd';

@observer
class ListItem extends Component {
  render() {
    const {
      device,
      installedPackage,
      isSelected,
      pack,
      queuedPackage,
      showPackageDetails,
      toggleAutoInstall,
      togglePackage,
      t
    } = this.props;
    return !pack.unmanaged ? (
      <span>
        <div
          className={`software-panel__item${isSelected ? ' software-panel__item--selected' : ''}`}
          id={`button-package-${pack.packageName}`}
          onClick={togglePackage.bind(this, pack.packageName)}
        >
          <div className="software-panel__item-left">
            <div className="software-panel__item-name">{pack.packageName}</div>
            <div className="software-panel__item-versions-nr" id="package-versions-nr">
              {pack.versions.length === 1 ? `${pack.versions.length} version` : `${pack.versions.length} versions`}
            </div>
          </div>
          <div className="software-panel__item-right">
            {!isSelected ? (
              queuedPackage ? (
                <span>
                  {pack.isAutoInstallEnabled ? (
                    <div className="software-panel__labels">
                      <div className="software-panel__label software-panel__label--auto-update">
                        {t('devices.software.auto')}
                      </div>
                      <div className="software-panel__label software-panel__label--queued">
                        {t('common.statuses.queued')}
                      </div>
                    </div>
                  ) : (
                    <div className="software-panel__labels">
                      <div className="software-panel__label software-panel__label--queued">
                        {t('common.statuses.queued')}
                      </div>
                    </div>
                  )}
                </span>
              ) : installedPackage ? (
                pack.isAutoInstallEnabled ? (
                  <div className="software-panel__labels">
                    <div className="software-panel__label software-panel__label--auto-update">
                      {t('devices.software.auto')}
                    </div>
                    <div className="software-panel__label software-panel__label--installed">
                      {t('common.statuses.installed')}
                    </div>
                  </div>
                ) : (
                  <div className="software-panel__labels">
                    <div className="software-panel__label software-panel__label--installed">
                      {t('common.statuses.installed')}
                    </div>
                  </div>
                )
              ) : pack.isAutoInstallEnabled ? (
                <div className="software-panel__labels">
                  <div className="software-panel__label software-panel__label--auto-update">
                    {t('devices.software.auto')}
                  </div>
                </div>
              ) : null
            ) : null}
            {isSelected ? (
              <div className="software-panel__auto-update">
                {t('devices.software.automatic_update')}
                <Tooltip title={t('devices.software.automatic_update_tooltip')} placement="top">
                  <div
                    className={`switch${pack.isAutoInstallEnabled ? ' switchOn' : ''}`}
                    id="auto-install-switch"
                    onClick={toggleAutoInstall.bind(this, pack.packageName, device.uuid, pack.isAutoInstallEnabled)}
                  />
                </Tooltip>
              </div>
            ) : null}
          </div>
        </div>
      </span>
    ) : (
      <span>
        <div
          className="software-panel__item-unmanaged"
          id={`button-package-${pack.hash}`}
          onClick={showPackageDetails.bind(this, 'unmanaged')}
        >
          <div className="software-panel__item-unmanaged-left">
            <div className="software-panel__item-unmanaged-block">
              <span className="software-panel__item-unmanaged-subtitle">Filepath:</span>
              <span className="software-panel__item-unmanaged-value">{pack.filepath}</span>
            </div>
            <div className="software-panel__item-unmanaged-block">
              <span className="software-panel__item-unmanaged-subtitle">Size:</span>
              <span className="software-panel__item-unmanaged-value">{pack.size}</span>
            </div>
            <div className="software-panel__item-unmanaged-block">
              <span className="software-panel__item-unmanaged-subtitle">Hash:</span>
              <span className="software-panel__item-unmanaged-value">{pack.hash}</span>
            </div>
          </div>
        </div>
      </span>
    );
  }
}

ListItem.propTypes = {
  device: PropTypes.shape({}).isRequired,
  installedPackage: PropTypes.string,
  isSelected: PropTypes.bool.isRequired,
  pack: PropTypes.shape({}).isRequired,
  queuedPackage: PropTypes.string,
  showPackageDetails: PropTypes.func.isRequired,
  toggleAutoInstall: PropTypes.func.isRequired,
  togglePackage: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

export default withTranslation()(ListItem);
