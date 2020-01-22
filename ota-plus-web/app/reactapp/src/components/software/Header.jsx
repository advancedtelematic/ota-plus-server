/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Tag } from 'antd';
import { action } from 'mobx';
import { withTranslation } from 'react-i18next';
import Button from '../../partials/Button';
import { FEATURES } from '../../config';
import { sendAction } from '../../helpers/analyticsHelper';
import {
  OTA_SOFTWARE_SEE_ALL,
  OTA_SOFTWARE_SEE_ADVANCED,
  OTA_SOFTWARE_ADD_SOFTWARE
} from '../../constants/analyticsActions';
import { SubHeader } from '../../partials';

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

  componentWillMount() {
    const { stores } = this.props;
    const { softwareStore } = stores;
    this.setActive(softwareStore.activeTab);
  }

  componentDidMount() {
    sendAction(OTA_SOFTWARE_SEE_ALL);
  }

  componentWillUnmount() {
    this.storeActive(this.activeTab);
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
    const { showCreateModal, stores, switchToSWRepo, t } = this.props;
    const { featuresStore } = stores;
    const { features } = featuresStore;
    return (
      <div>
        <div className="tab-navigation">
          {features.includes(FEATURES.ADVANCED_SOFTWARE) && (
            <ul className="tab-navigation__links">
              <li
                onClick={() => {
                  this.setActive('compact');
                  sendAction(OTA_SOFTWARE_SEE_ALL);
                }}
                className={`tab-navigation__link ${this.isActive('compact')}`}
              >
                <span>{t('software.tabs.compact')}</span>
              </li>
              <li
                onClick={() => {
                  this.setActive('advanced');
                  sendAction(OTA_SOFTWARE_SEE_ADVANCED);
                }}
                className={`tab-navigation__link ${this.isActive('advanced')}`}
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
                onClick={() => {
                  showCreateModal(null);
                  sendAction(OTA_SOFTWARE_ADD_SOFTWARE);
                }}
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
      </div>
    );
  }
}

export default withTranslation()(Header);
