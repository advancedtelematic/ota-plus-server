/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Tag } from 'antd';
import { action } from 'mobx';
import { withTranslation } from 'react-i18next';

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
    const { alphaPlusEnabled } = featuresStore;
    return (
      <div className="tab-navigation">
        {alphaPlusEnabled && (
          <ul className="tab-navigation__links">
            <li
              onClick={() => {
                this.setActive('compact');
              }}
              className={`tab-navigation__link ${this.isActive('compact')}`}
            >
              <span>{t('software.tabs.compact')}</span>
            </li>
            <li
              onClick={() => {
                this.setActive('advanced');
              }}
              className={`tab-navigation__link ${this.isActive('advanced')}`}
            >
              <span>
                {t('software.tabs.advanced')}
                <Tag color="#48dad0" className="alpha-tag">
                  ALPHA
                </Tag>
              </span>
            </li>
          </ul>
        )}

        {!switchToSWRepo && (
          <div className="tab-navigation__buttons">
            <Button
              htmlType="button"
              className="ant-btn ant-btn-outlined"
              id="add-new-software"
              onClick={() => {
                showCreateModal(null);
              }}
            >
              {t('software.action_buttons.add_software')}
            </Button>
          </div>
        )}
      </div>
    );
  }
}

export default withTranslation()(Header);
