/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Loader } from '../../partials';
import _ from 'lodash';
import LastSoftwareItem from './LastSoftwareItem';
import NoItems from './NoItems';

@inject('stores')
@observer
class LastSoftware extends Component {
  render() {
    const { showSoftwareCreateModal } = this.props;
    const { softwareStore } = this.props.stores;

    const { lastPackages } = softwareStore;
    return (
      <span style={{ height: '100%' }}>
        {softwareStore.packagesFetchAsync.isFetching ? (
          <div className='wrapper-center'>
            <Loader className='dark' />
          </div>
        ) : Object.keys(lastPackages).length ? (
          _.map(lastPackages, (pack, index) => {
            return <LastSoftwareItem key={index} pack={pack} />;
          })
        ) : (
          <NoItems itemType={'package'} createItem={showSoftwareCreateModal} />
        )}
      </span>
    );
  }
}

LastSoftware.propTypes = {
  stores: PropTypes.object,
};

export default LastSoftware;
