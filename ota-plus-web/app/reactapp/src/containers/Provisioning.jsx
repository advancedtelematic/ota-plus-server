/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { observable, observe } from 'mobx';
import { observer, inject } from 'mobx-react';
import { withTranslation } from 'react-i18next';

import { ExternalLink, Loader } from '../partials';
import { resetAsync } from '../utils/Common';
import {
  ProvisioningTooltip,
  ProvisioningHeader,
  ProvisioningList,
  ProvisioningCreateModal
} from '../components/profile/access-keys';
import { sendAction, setAnalyticsView } from '../helpers/analyticsHelper';
import { ANALYTICS_VIEW_CREDENTIALS_PROVISIONING } from '../constants/analyticsViews';
import { OTA_PROVISIONING_READ_MORE } from '../constants/analyticsActions';
import { URL_PROVISIONING_READ_MORE } from '../constants/urlConstants';
import { isFeatureEnabled, UI_FEATURES } from '../config';

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
    provisioningStore.openCreationPopup = false;
    resetAsync(provisioningStore.provisioningKeyCreateAsync);
  };

  changeFilter = (filter) => {
    const { stores } = this.props;
    const { provisioningStore } = stores;
    provisioningStore.filterProvisioningKeys(filter);
  };

  render() {
    const { stores, t } = this.props;
    const { provisioningStore, userStore } = stores;
    const { openCreationPopup } = provisioningStore;
    const { uiFeatures } = userStore;
    return isFeatureEnabled(uiFeatures, UI_FEATURES.ACCESS_CREDS) && (
      <span>
        {provisioningStore.provisioningStatusFetchAsync.isFetching ? (
          <div className="wrapper-center">
            <Loader />
          </div>
        ) : provisioningStore.provisioningStatus.active ? (
          <span>
            <p
              id="profile-provisioning-keys-read-more-description"
              className={`${provisioningStore.preparedProvisioningKeys.length ? '' : 'text-white'}`}
            >
              {t('profile.provisioning-keys.read-more.description')}
              {' '}
              <ExternalLink
                id={'profile-provisioning-keys-read-more-link'}
                key={'profile-provisioning-keys-read-more'}
                onClick={() => sendAction(OTA_PROVISIONING_READ_MORE)}
                url={URL_PROVISIONING_READ_MORE}
                weight="medium"
              >
                {t('profile.provisioning-keys.read-more.link')}
              </ExternalLink>
            </p>
            <ProvisioningHeader
              showCreateModal={this.showCreateModal}
              provisioningFilter={provisioningStore.provisioningFilter}
              changeFilter={this.changeFilter}
            />
            <ProvisioningList
              preparedProvisioningKeys={provisioningStore.preparedProvisioningKeys}
              provisioningKeyAreFetching={provisioningStore.provisioningKeysFetchAsync.isFetching}
              showCreateModal={this.showCreateModal}
            />
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
        <ProvisioningCreateModal shown={this.createModalShown || openCreationPopup} hide={this.hideCreateModal} />
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
