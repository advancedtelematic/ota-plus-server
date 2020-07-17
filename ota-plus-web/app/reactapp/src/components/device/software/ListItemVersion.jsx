/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';
import { withTranslation } from 'react-i18next';

import { sendAction } from '../../../helpers/analyticsHelper';
import { OTA_DEVICE_SEE_SOFTWARE } from '../../../constants/analyticsActions';
import { DEVICE_SOFTWARE_CREATED_DATE_FORMAT } from '../../../constants/datesTimesConstants';
import { getFormattedDateTime } from '../../../helpers/datesTimesHelper';
import { BAN_ICON_RED, CROSS_ICON_RED } from '../../../config';

@inject('stores')
@observer
class ListItemVersion extends Component {
  handlePackageVersionClick = () => {
    const { showPackageDetails, version } = this.props;
    showPackageDetails(version);
    sendAction(OTA_DEVICE_SEE_SOFTWARE);
  };

  isPackageBlocklisted(version) {
    const { stores } = this.props;
    const { softwareStore } = stores;
    const isPackageBlocklisted = _.find(
      softwareStore.blocklist,
      dev => dev.packageId.name === version.id.name && dev.packageId.version === version.id.version
    );
    return isPackageBlocklisted || false;
  }

  render() {
    const { version, queuedPackage, installedPackage, stores, t } = this.props;
    const { softwareStore } = stores;
    const blocklistedPackage = this.isPackageBlocklisted(version);
    const isSelected = version.filepath === softwareStore.expandedPackage.filepath;
    return (
      <li
        className={`software-panel__version${isSelected ? ' software-panel__version--selected' : ''}`}
        id={isSelected ? `image-${version.id.version.substring(0, 8)}-selected` : `image-${version.id.version.substring(0, 8)}`}
        onClick={this.handlePackageVersionClick}
      >
        <div className="software-panel__version-left">
          <div className="software-panel__version-block">
            <span className="software-panel__version-subtitle">{t('devices.software.hash_version')}</span>
            <span className="software-panel__version-value" id={`version-value-${version.id.version.substring(0, 8)}`}>
              {version.id.version}
            </span>
          </div>
          <div className="software-panel__version-block">
            <span className="software-panel__version-subtitle">{t('devices.software.created-at')}</span>
            <span className="software-panel__version-value">
              {getFormattedDateTime(version.createdAt, DEVICE_SOFTWARE_CREATED_DATE_FORMAT)}
            </span>
          </div>
        </div>
        <div className="software-panel__version-right">
          {blocklistedPackage && version.id.version === installedPackage ? (
            <img
              className="software-panel__version-icon"
              src={CROSS_ICON_RED}
              id={`image-blocklisted-and-installed-${version.id.version.substring(0, 8)}`}
              alt="Icon"
            />
          ) : blocklistedPackage ? (
            <img
              className="software-panel__version-icon"
              src={BAN_ICON_RED}
              id={`image-blocklisted-${version.id.version.substring(0, 8)}`}
              alt="Icon"
            />
          ) : version.filepath === queuedPackage ? (
            <div className="software-panel__labels">
              <div className="software-panel__label software-panel__label--queued">Queued</div>
            </div>
          ) : version.id.version === installedPackage ? (
            <div className="software-panel__label software-panel__label--installed">Installed</div>
          ) : null}
        </div>
      </li>
    );
  }
}

ListItemVersion.propTypes = {
  stores: PropTypes.shape({}),
  version: PropTypes.shape({}).isRequired,
  queuedPackage: PropTypes.string,
  installedPackage: PropTypes.string,
  showPackageDetails: PropTypes.func,
  t: PropTypes.func.isRequired
};

export default withTranslation()(ListItemVersion);
