/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Loader } from '../../partials';
import { PropertiesList } from './properties';

const title = 'Properties';

@inject('stores')
@observer
class PropertiesPanel extends Component {
  render() {
    const { stores, installPackage } = this.props;
    const { softwareStore } = stores;
    return (
      <div className="properties-panel">
        <div className="properties-panel__header darkgrey-header">{title}</div>
        <div className="properties-panel__wrapper">
          {softwareStore.packagesFetchAsync.isFetching ? (
            <div className="wrapper-center">
              <Loader />
            </div>
          ) : (
            <PropertiesList installPackage={installPackage} />
          )}
        </div>
      </div>
    );
  }
}

PropertiesPanel.propTypes = {
  stores: PropTypes.shape({}),
  installPackage: PropTypes.func.isRequired,
};

export default PropertiesPanel;
