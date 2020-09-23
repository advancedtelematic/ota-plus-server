/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Tag, Tooltip } from 'antd';
import { action } from 'mobx';
import { withTranslation } from 'react-i18next';
import {
  ALPHA_TAG,
  FEATURES,
  PACKAGES_ADVANCED_TAB,
  PACKAGES_DEFAULT_TAB,
  PACKAGES_BLOCKLISTED_TAB,
  isFeatureEnabled,
  UI_FEATURES
} from '../../config';
import { sendAction, setAnalyticsView } from '../../helpers/analyticsHelper';
import {
  OTA_SOFTWARE_ADD_SOFTWARE,
  OTA_SOFTWARE_FAIL_ROTATION,
  OTA_SOFTWARE_SEE_ADVANCED,
  OTA_SOFTWARE_SEE_ALL,
} from '../../constants/analyticsActions';
import { Button, ExternalLink, SubHeader, WarningModal } from '../../partials';
import { WARNING_MODAL_COLOR } from '../../constants';
import { URL_ROTATING_KEYS } from '../../constants/urlConstants';
import { ANALYTICS_VIEW_IMPACT_ANALYSIS } from '../../constants/analyticsViews';

@inject('stores')
@observer
class Header extends Component {
  static propTypes = {
    stores: PropTypes.shape({}),
    showCreateModal: PropTypes.func.isRequired,
    switchToTab: PropTypes.oneOf([PACKAGES_DEFAULT_TAB, PACKAGES_ADVANCED_TAB, PACKAGES_BLOCKLISTED_TAB]),
    t: PropTypes.func.isRequired
  };

  static defaultProps = {
    stores: {}
  };

  state = {
    showKeysOfflineModal: false
  };

  componentWillMount() {
    const { stores } = this.props;
    const { softwareStore } = stores;
    this.setActive(softwareStore.activeTab);
  }

  componentDidMount() {
    const { stores } = this.props;
    const { softwareStore } = stores;
    softwareStore.getKeysStatus();
    sendAction(OTA_SOFTWARE_SEE_ALL);
  }

  componentWillUnmount() {
    this.storeActive(PACKAGES_DEFAULT_TAB);
  }

  toggleKeysOfflineModal = () => {
    this.setState(state => ({
      showKeysOfflineModal: !state.showKeysOfflineModal
    }));
  };

  handleAddSoftwareBtnClick = () => {
    const { showCreateModal, stores } = this.props;
    const { softwareStore } = stores;
    const { keysStatus } = softwareStore;
    if (keysStatus['keys-online']) {
      showCreateModal(null);
    } else {
      this.toggleKeysOfflineModal();
      sendAction(OTA_SOFTWARE_FAIL_ROTATION);
    }
    sendAction(OTA_SOFTWARE_ADD_SOFTWARE);
  }

  @action
  setActive = (tab) => {
    this.activeTab = tab;
    this.storeActive(tab);
  };

  @action
  storeActive = (tab) => {
    const { stores } = this.props;
    const { softwareStore } = stores;
    softwareStore.activeTab = tab;
  };

  isActive = tab => (tab === this.activeTab ? 'tab-navigation__link--active' : '');

  render() {
    const { stores, switchToTab, t } = this.props;
    const { showKeysOfflineModal } = this.state;
    const { featuresStore, userStore } = stores;
    const { features } = featuresStore;
    const { uiFeatures } = userStore;
    return (
      <div>
        <div className="tab-navigation">
          {(features.includes(FEATURES.ADVANCED_SOFTWARE) || features.includes(FEATURES.IMPACT_ANALYSIS)) && (
            <ul className="tab-navigation__links">
              <li
                id="tab-software-page"
                onClick={() => {
                  this.setActive(PACKAGES_DEFAULT_TAB);
                  sendAction(OTA_SOFTWARE_SEE_ALL);
                }}
                className={`tab-navigation__link ${this.isActive(PACKAGES_DEFAULT_TAB)}`}
              >
                <span>{t('software.tabs.compact')}</span>
              </li>
              {features.includes(FEATURES.ADVANCED_SOFTWARE) && (
                <li
                  id="tab-ext-contributors-page"
                  onClick={() => {
                    this.setActive(PACKAGES_ADVANCED_TAB);
                    sendAction(OTA_SOFTWARE_SEE_ADVANCED);
                  }}
                  className={`tab-navigation__link ${this.isActive(PACKAGES_ADVANCED_TAB)}`}
                >
                  <Tooltip placement="bottom" title={t('software.tabs.tooltip.external')}>
                    <span>
                      {t('software.tabs.advanced')}
                      <Tag color="#00B6B2" className="alpha-tag">
                        {ALPHA_TAG}
                      </Tag>
                    </span>
                  </Tooltip>
                </li>
              )}
              {features.includes(FEATURES.IMPACT_ANALYSIS) && (
                <li
                  id="tab-impact-page"
                  onClick={() => {
                    this.setActive(PACKAGES_BLOCKLISTED_TAB);
                    setAnalyticsView(ANALYTICS_VIEW_IMPACT_ANALYSIS);
                  }}
                  className={`tab-navigation__link ${this.isActive(PACKAGES_BLOCKLISTED_TAB)}`}
                >
                  <Tooltip placement="bottom" title={t('software.tabs.tooltip.blocklisted')}>
                    <span>
                      {t('software.tabs.blocklisted')}
                      <Tag color="#00B6B2" className="alpha-tag">
                        {ALPHA_TAG}
                      </Tag>
                    </span>
                  </Tooltip>
                </li>
              )}
            </ul>
          )}
          {switchToTab === PACKAGES_DEFAULT_TAB && isFeatureEnabled(uiFeatures, UI_FEATURES.UPLOAD_SOFTWARE) && (
            <div className="tab-navigation__buttons">
              <Button
                id="add-new-software"
                onClick={this.handleAddSoftwareBtnClick}
              >
                {t('software.action_buttons.add_software')}
              </Button>
            </div>
          )}
        </div>
        {switchToTab !== PACKAGES_BLOCKLISTED_TAB && (
          <SubHeader className="software-repository-subheader">
            <div className="software-repository-subheader__item">{t('software.header.name')}</div>
            <div className="software-repository-subheader__item versions">{t('software.header.versions')}</div>
            <div className="software-repository-subheader__item installed-on">{t('software.header.coverage')}</div>
          </SubHeader>
        )}
        {showKeysOfflineModal && (
          <WarningModal
            id="keys-offline-modal"
            type={WARNING_MODAL_COLOR.INFO}
            title={t('software.keys-offline-modal.title')}
            desc={(
              <span>
                {t('software.keys-offline-modal.desc')}
                {' '}
                <ExternalLink id="rotating-keys-link" url={URL_ROTATING_KEYS} weight="regular">
                  {t('software.keys-offline-modal.desc-url')}
                </ExternalLink>
              </span>
            )}
            cancelButtonProps={{
              title: t('software.keys-offline-modal.close'),
            }}
            onClose={this.toggleKeysOfflineModal}
          />
        )}
      </div>
    );
  }
}

export default withTranslation()(Header);
