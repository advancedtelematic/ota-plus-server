/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withTranslation } from 'react-i18next';
import { MetaData } from '../../utils';
import ProvisioningContainer from '../../containers/Provisioning';

@inject('stores')
@observer
class AccessKeys extends Component {
  componentWillMount() {
    const { stores, t } = this.props;
    const { provisioningStore } = stores;
    provisioningStore.fetchProvisioningStatus();
    this.title = t('profile.provisioning_keys.title');
  }

  componentWillUnmount() {
    const { stores } = this.props;
    const { provisioningStore } = stores;
    provisioningStore.reset();
  }

  render() {
    const { stores } = this.props;
    const { provisioningStore } = stores;
    return (
      <div
        className={`profile-container ${provisioningStore.preparedProvisioningKeys.length ? '' : 'background-black'}`}
        id="provisioning"
      >
        <MetaData title={this.title}>
          <ProvisioningContainer />
        </MetaData>
      </div>
    );
  }
}

AccessKeys.propTypes = {
  stores: PropTypes.shape({}),
  t: PropTypes.func.isRequired
};

export default withTranslation()(AccessKeys);
