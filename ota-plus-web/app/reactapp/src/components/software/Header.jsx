/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Tag } from 'antd';
import { action } from 'mobx';
import { withTranslation } from 'react-i18next';
import { FEATURES, PACKAGES_ADVANCED_TAB, PACKAGES_DEFAULT_TAB } from '../../config';
import { sendAction } from '../../helpers/analyticsHelper';
import {
  OTA_SOFTWARE_ADD_SOFTWARE,
  OTA_SOFTWARE_FAIL_ROTATION,
  OTA_SOFTWARE_SEE_ADVANCED,
  OTA_SOFTWARE_SEE_ALL,
} from '../../constants/analyticsActions';
import { Button, ExternalLink, SubHeader, WarningModal } from '../../partials';
import { WARNING_MODAL_COLOR } from '../../constants';
import { URL_ROTATING_KEYS } from '../../constants/urlConstants';

@inject('stores')
@observer
class Header extends Component {
  static propTypes = {
    stores: PropTypes.shape({}),
    showCreateModal: PropTypes.func.isRequired,
    switchToSWRepo: PropTypes.bool.isRequired,
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
    this.storeActive(this.activeTab);
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
    const { stores, switchToSWRepo, t } = this.props;
    const { showKeysOfflineModal } = this.state;
    const { featuresStore } = stores;
    const { features } = featuresStore;
    return (
      <div>
        <div className="tab-navigation">
          {features.includes(FEATURES.ADVANCED_SOFTWARE) && (
            <ul className="tab-navigation__links">
              <li
                onClick={() => {
                  this.setActive(PACKAGES_DEFAULT_TAB);
                  sendAction(OTA_SOFTWARE_SEE_ALL);
                }}
                className={`tab-navigation__link ${this.isActive(PACKAGES_DEFAULT_TAB)}`}
              >
                <span>{t('software.tabs.compact')}</span>
              </li>
              <li
                onClick={() => {
                  this.setActive(PACKAGES_ADVANCED_TAB);
                  sendAction(OTA_SOFTWARE_SEE_ADVANCED);
                }}
                className={`tab-navigation__link ${this.isActive(PACKAGES_ADVANCED_TAB)}`}
              >
                <span>
                  {t('software.tabs.advanced')}
                  <Tag color="#48dad0" className="alpha-tag">
                    BETA
                  </Tag>
                </span>
              </li>
            </ul>
          )}
          {!switchToSWRepo && (
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
        <SubHeader className="software-repository-subheader">
          <div className="software-repository-subheader__item">{t('software.header.name')}</div>
          <div className="software-repository-subheader__item versions">{t('software.header.versions')}</div>
          <div className="software-repository-subheader__item installed-on">{t('software.header.coverage')}</div>
        </SubHeader>
        {showKeysOfflineModal && (
          <WarningModal
            id="keys-offline-modal"
            type={WARNING_MODAL_COLOR.INFO}
            title={t('software.keys-offline-modal.title')}
            desc={(
              <span>
                {t('software.keys-offline-modal.desc')}
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
