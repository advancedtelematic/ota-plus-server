/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { observable, observe } from 'mobx';
import { observer, inject } from 'mobx-react';
import { withTranslation } from 'react-i18next';

import { Loader } from '../partials';
import { resetAsync } from '../utils/Common';
import {
  ProvisioningTooltip,
  ProvisioningHeader,
  ProvisioningList,
  ProvisioningCreateModal
} from '../components/profile/access-keys';
import { setAnalyticsView } from '../helpers/analyticsHelper';
import { ANALYTICS_VIEW_CREDENTIALS_PROVISIONING } from '../constants/analyticsViews';

@inject('stores')
@observer
class Provisioning extends Component {
  @observable
  tooltipShown = false;

  @observable
  createModalShown = false;

  componentDidMount() {
    const { stores } = this.props;
    const { provisioningStore } = stores;
    this.preparedProvisioningKeysChange = observe(provisioningStore, (change) => {
      if (change.name === 'preparedProvisioningKeys') {
        const { history } = this.props;
        const { state } = history.location;
        if (state && state.openWizard && provisioningStore.preparedProvisioningKeys.length === 0) {
          this.showCreateModal();
        }
      }
    });
    setAnalyticsView(ANALYTICS_VIEW_CREDENTIALS_PROVISIONING);
  }

  componentWillUnmount() {
    this.preparedProvisioningKeysChange();
  }

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
    const { stores, t } = this.props;
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
              <div className="no-access-keys">
                <div>{t('profile.provisioning_keys.provisioning_not_activated')}</div>
              </div>
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
  history: PropTypes.shape({}),
  stores: PropTypes.shape({}),
  t: PropTypes.func.isRequired
};

export default withTranslation()(withRouter(Provisioning));
