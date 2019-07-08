/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { MetaData } from '../../utils';
import ProvisioningContainer from '../../containers/Provisioning';

const title = 'Access keys';

@inject('stores')
@observer
class AccessKeys extends Component {
  componentWillMount() {
    const { stores } = this.props;
    const { provisioningStore } = stores;
    provisioningStore.fetchProvisioningStatus();
  }

  componentWillUnmount() {
    const { stores } = this.props;
    const { provisioningStore } = stores;
    provisioningStore.reset();
  }

  render() {
    return (
      <div className="profile-container" id="provisioning">
        <MetaData title={title}>
          <ProvisioningContainer />
        </MetaData>
      </div>
    );
  }
}

AccessKeys.propTypes = {
  stores: PropTypes.shape({})
};

export default AccessKeys;
