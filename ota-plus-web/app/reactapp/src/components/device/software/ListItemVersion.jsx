/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import moment from 'moment';
import _ from 'lodash';

@inject('stores')
@observer
class ListItemVersion extends Component {
  handlePackageVersionClick = () => {
    const { showPackageDetails, version } = this.props;
    showPackageDetails(version);
  };

  isPackageBlacklisted(version) {
    const { softwareStore } = this.props.stores;
    let isPackageBlacklisted = _.find(softwareStore.blacklist, dev => {
      return dev.packageId.name === version.id.name && dev.packageId.version === version.id.version;
    });
    return isPackageBlacklisted ? isPackageBlacklisted : false;
  }
  render() {
    const { version, queuedPackage, installedPackage } = this.props;
    const { softwareStore } = this.props.stores;
    let blacklistedPackage = this.isPackageBlacklisted(version);
    let isSelected = version.filepath === softwareStore.expandedPackage.filepath;
    return (
      <li
        className={'software-panel__version' + (isSelected ? ' software-panel__version--selected' : '')}
        id={isSelected ? 'image-' + version.id.version.substring(0, 8) + '-selected' : 'image-' + version.id.version.substring(0, 8)}
        onClick={this.handlePackageVersionClick}
      >
        <div className='software-panel__version-left'>
          <div className='software-panel__version-block'>
            <span className='software-panel__version-subtitle'>Hash / version:</span>
            <span className='software-panel__version-value' id={'version-value-' + version.id.version.substring(0, 8)}>
              {version.id.version}
            </span>
          </div>
          <div className='software-panel__version-block'>
            <span className='software-panel__version-subtitle'>Created at:</span>
            <span className='software-panel__version-value'>{moment(version.createdAt).format('ddd MMM DD YYYY, h:mm:ss A')}</span>
          </div>
        </div>
        <div className='software-panel__version-right'>
          {blacklistedPackage && version.id.version === installedPackage ? (
            <img className='software-panel__version-icon' src='/assets/img/icons/red_cross.svg' id={'image-blacklisted-and-installed-' + version.id.version.substring(0, 8)} alt='Icon' />
          ) : blacklistedPackage ? (
            <img className='software-panel__version-icon' src='/assets/img/icons/ban_red.png' id={'image-blacklisted-' + version.id.version.substring(0, 8)} alt='Icon' />
          ) : version.filepath === queuedPackage ? (
            <div className='software-panel__labels'>
              <div className='software-panel__label software-panel__label--queued'>Queued</div>
            </div>
          ) : version.id.version === installedPackage ? (
            <div className='software-panel__label software-panel__label--installed'>Installed</div>
          ) : null}
        </div>
      </li>
    );
  }
}

ListItemVersion.propTypes = {
  stores: PropTypes.object,
  version: PropTypes.object.isRequired,
  queuedPackage: PropTypes.string,
  installedPackage: PropTypes.string,
};

export default ListItemVersion;
