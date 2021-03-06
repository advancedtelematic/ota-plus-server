/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withTranslation } from 'react-i18next';

import { Loader } from '../../partials';
import { SoftwareList } from './software';


@inject('stores')
@observer
class SoftwarePanel extends Component {
  render() {
    const {
      togglePackageAutoUpdate,
      onFileDrop,
      showPackageDetails,
      triggerPackages,
      expandedPackageName,
      togglePackage,
      stores,
      t
    } = this.props;
    const { softwareStore } = stores;
    return (
      <div className="software-panel">
        <div className="software-panel__header darkgrey-header">{t('devices.software.title')}</div>
        <div className="software-panel__wrapper">
          <span>
            {softwareStore.packagesFetchAsync.isFetching ? (
              <div className="wrapper-center">
                <Loader />
              </div>
            ) : Object.keys(softwareStore.preparedPackages).length ? (
              <SoftwareList
                onFileDrop={onFileDrop}
                togglePackageAutoUpdate={togglePackageAutoUpdate}
                showPackageDetails={showPackageDetails}
                triggerPackages={triggerPackages}
                expandedPackageName={expandedPackageName}
                togglePackage={togglePackage}
              />
            ) : (
              <div className="wrapper-center">{t('devices.software.no_results')}</div>
            )}
          </span>
        </div>
      </div>
    );
  }
}

SoftwarePanel.propTypes = {
  stores: PropTypes.shape({}),
  togglePackageAutoUpdate: PropTypes.func.isRequired,
  onFileDrop: PropTypes.func.isRequired,
  showPackageDetails: PropTypes.func.isRequired,
  triggerPackages: PropTypes.bool,
  expandedPackageName: PropTypes.string,
  togglePackage: PropTypes.func,
  t: PropTypes.func.isRequired
};

export default withTranslation()(SoftwarePanel);
