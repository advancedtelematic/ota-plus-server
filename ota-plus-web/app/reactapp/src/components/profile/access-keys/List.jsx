/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { inject } from 'mobx-react';
import _ from 'lodash';
import ListItem from './ListItem';
import NoKeys from './NoKeys';
import { Loader } from '../../../partials';

@inject('stores')
class List extends Component {
  constructor() {
    super();
    this.state = { isAccountSetup: false };
  }

  async componentDidMount() {
    const { stores } = this.props;
    const { userStore } = stores;
    const isAccountSetup = await userStore.checkIfAccountActive();
    this.setState({ isAccountSetup });
  }

  render() {
    const { isAccountSetup } = this.state;
    const { showTooltip, stores } = this.props;
    const { provisioningStore } = stores;
    return provisioningStore.preparedProvisioningKeys.length ? (
      <span>
        <div className="section-header">
          <div className="column">Name</div>
          <div className="column">Start date</div>
          <div className="column">End date</div>
          <div className="column">Download</div>
        </div>
        <div className="keys-info">
          {_.map(provisioningStore.preparedProvisioningKeys, (provisioningKey, index) => (
            <ListItem provisioningKey={provisioningKey} key={index} isExportable={isAccountSetup} />
          ))}
        </div>
      </span>
    ) : provisioningStore.provisioningKeysFetchAsync.isFetching ? (
      <div className="wrapper-center">
        <Loader />
      </div>
    ) : (
      <NoKeys showTooltip={showTooltip} />
    );
  }
}

List.propTypes = {
  stores: PropTypes.shape({}),
  showTooltip: PropTypes.func
};

export default List;
