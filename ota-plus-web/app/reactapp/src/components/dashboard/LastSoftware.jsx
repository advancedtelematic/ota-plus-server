/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';
import { withTranslation } from 'react-i18next';
import { Loader } from '../../partials';
import LastSoftwareItem from './LastSoftwareItem';
import NoItems from './NoItems';

@inject('stores')
@observer
class LastSoftware extends Component {
  render() {
    const { showSoftwareCreateModal, stores, t } = this.props;
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
          <NoItems
            actionText={t('dashboard.no_items.action_software')}
            createItem={showSoftwareCreateModal}
            description={t('dashboard.no_items.desc_software')}
          />
        )}
      </span>
    );
  }
}

LastSoftware.propTypes = {
  stores: PropTypes.shape({}),
  showSoftwareCreateModal: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

export default withTranslation()(LastSoftware);
