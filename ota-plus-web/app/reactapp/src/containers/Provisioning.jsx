/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Loader } from '../partials';
import { resetAsync } from '../utils/Common';
import {
  ProvisioningTooltip,
  ProvisioningHeader,
  ProvisioningList,
  ProvisioningCreateModal
} from '../components/profile/access-keys';

@inject('stores')
@observer
class Provisioning extends Component {
  @observable
  tooltipShown = false;

  @observable
  createModalShown = false;

  showTooltip = (e) => {
    if (e) e.preventDefault();
    this.tooltipShown = true;
  };

  hideTooltip = (e) => {
    if (e) e.preventDefault();
    this.tooltipShown = false;
  };

  showCreateModal = (e) => {
    if (e) e.preventDefault();
    this.createModalShown = true;
  };

  hideCreateModal = (e) => {
    if (e) e.preventDefault();
    const { stores } = this.props;
    const { provisioningStore } = stores;
    this.createModalShown = false;
    resetAsync(provisioningStore.provisioningKeyCreateAsync);
  };

  changeFilter = (filter) => {
    const { stores } = this.props;
    const { provisioningStore } = stores;
    provisioningStore.filterProvisioningKeys(filter);
  };

  render() {
    const { stores } = this.props;
    const { provisioningStore } = stores;
    return (
      <span>
        {provisioningStore.provisioningStatusFetchAsync.isFetching ? (
          <div className="wrapper-center">
            <Loader />
          </div>
        ) : provisioningStore.provisioningStatus.active ? (
          <span>
            <ProvisioningHeader
              showCreateModal={this.showCreateModal}
              provisioningFilter={provisioningStore.provisioningFilter}
              changeFilter={this.changeFilter}
            />
            <ProvisioningList showTooltip={this.showTooltip} />
          </span>
        ) : (
          <div className="wrapper-center">
            <div className="page-intro">
              <div>Provisioning not activated.</div>
            </div>
          </div>
        )}
        {/* TODO: still to check after finishing modal */}
        <ProvisioningTooltip shown={this.tooltipShown} hide={this.hideTooltip} />
        <ProvisioningCreateModal shown={this.createModalShown} hide={this.hideCreateModal} />
      </span>
    );
  }
}

Provisioning.propTypes = {
  stores: PropTypes.shape({}),
};

export default Provisioning;
