/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';
import { Loader } from '../../partials';
import LastSoftwareItem from './LastSoftwareItem';
import NoItems from './NoItems';

@inject('stores')
@observer
class LastSoftware extends Component {
  render() {
    const { showSoftwareCreateModal, stores } = this.props;
    const { softwareStore } = stores;

    const { lastPackages } = softwareStore;
    return (
      <span style={{ height: '100%' }}>
        {softwareStore.packagesFetchAsync.isFetching ? (
          <div className="wrapper-center">
            <Loader className="dark" />
          </div>
        ) : Object.keys(lastPackages).length ? (
          _.map(lastPackages, (pack, index) => <LastSoftwareItem key={index} pack={pack} />)
        ) : (
          <NoItems itemType="package" createItem={showSoftwareCreateModal} />
        )}
      </span>
    );
  }
}

LastSoftware.propTypes = {
  stores: PropTypes.shape({}),
  showSoftwareCreateModal: PropTypes.func.isRequired,
};

export default LastSoftware;
