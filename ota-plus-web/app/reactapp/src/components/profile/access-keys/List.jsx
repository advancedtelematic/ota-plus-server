/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable } from 'mobx';
import _ from 'lodash';
import ListItem from './ListItem';
import NoKeys from './NoKeys';
import { Loader } from '../../../partials';

@inject('stores')
@observer
class List extends Component {
  @observable isAccountSetup = false;

  async componentDidMount() {
    const { stores } = this.props;
    const { userStore } = stores;
    this.isAccountSetup = await userStore.checkIfAccountActive();
  }

  render() {
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
            <ListItem provisioningKey={provisioningKey} key={index} isExportable={this.isAccountSetup} />
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
