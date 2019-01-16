/** @format */

import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Loader } from '../partials';
import { resetAsync } from '../utils/Common';
import { ProvisioningTooltip, ProvisioningHeader, ProvisioningList, ProvisioningCreateModal } from '../components/profile/access-keys';
import { AsyncStatusCallbackHandler } from '../utils';

@inject('stores')
@observer
class Provisioning extends Component {
  @observable tooltipShown = false;
  @observable createModalShown = false;

  constructor(props) {
    super(props);
    this.showTooltip = this.showTooltip.bind(this);
    this.hideTooltip = this.hideTooltip.bind(this);
    this.showCreateModal = this.showCreateModal.bind(this);
    this.hideCreateModal = this.hideCreateModal.bind(this);
    this.changeFilter = this.changeFilter.bind(this);
  }
  showTooltip(e) {
    if (e) e.preventDefault();
    this.tooltipShown = true;
  }
  hideTooltip(e) {
    if (e) e.preventDefault();
    this.tooltipShown = false;
  }
  showCreateModal(e) {
    if (e) e.preventDefault();
    this.createModalShown = true;
  }
  hideCreateModal(e) {
    if (e) e.preventDefault();
    const { provisioningStore } = this.props.stores;
    this.createModalShown = false;
    resetAsync(provisioningStore.provisioningKeyCreateAsync);
  }
  changeFilter(filter) {
    const { provisioningStore } = this.props.stores;
    provisioningStore._filterProvisioningKeys(filter);
  }
  render() {
    const { provisioningStore } = this.props.stores;
    return (
      <span>
        {provisioningStore.provisioningStatusFetchAsync.isFetching ? (
          <div className='wrapper-center'>
            <Loader />
          </div>
        ) : provisioningStore.provisioningStatus.active ? (
          <span>
            <ProvisioningHeader showCreateModal={this.showCreateModal} provisioningFilter={provisioningStore.provisioningFilter} changeFilter={this.changeFilter} />
            <ProvisioningList showTooltip={this.showTooltip} />
          </span>
        ) : (
          <div className='wrapper-center'>
            <div className='page-intro'>
              <div>Provisioning not activated.</div>
            </div>
          </div>
        )}
        <ProvisioningTooltip shown={this.tooltipShown} hide={this.hideTooltip} />
        <ProvisioningCreateModal shown={this.createModalShown} hide={this.hideCreateModal} />
      </span>
    );
  }
}

Provisioning.propTypes = {
  stores: PropTypes.object,
};

export default Provisioning;
