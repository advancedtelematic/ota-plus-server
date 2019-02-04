/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Button } from 'antd';
import { action, observable, observe } from 'mobx';

import {
  CAMPAIGNS_STATUSES,
  CAMPAIGNS_STATUS_TAB_TITLE,
  CAMPAIGNS_DEFAULT_TAB,
  LIMIT_CAMPAIGNS_PER_PAGE
} from '../config';

@inject('stores')
@observer
class TabNavigation extends Component {
  @observable activeTab = CAMPAIGNS_DEFAULT_TAB;

  static propTypes = {
    stores: PropTypes.object,
    location: PropTypes.string.isRequired,
    showCreateCampaignModal: PropTypes.func,
  };

  constructor(props) {
    super(props);
    const { stores } = props;
    const { campaignsStore } = stores;
    this.cancelChange = observe(campaignsStore, change => { this.apply(change)});
  }

  componentDidMount() {
    const { stores, location } = this.props;
    const { campaignsStore } = stores;
    if (this.isCampaignsPage(location)) {
      this.setActive(campaignsStore.activeTab);
      this.fetchStatusCount();
    }
  }

  componentWillUnmount() {
    const { location } = this.props;
    if (this.isCampaignsPage(location)) {
      this.storeActive(this.activeTab);
    }
    this.cancelChange();
  }

  apply = change => {
    const { name, newValue } = change;
    if (name === 'activeTab') {
      this.switch(newValue);
    }
  };

  switch = tab => {
    const { location } = this.props;
    this.setActive(tab);
    if (this.isCampaignsPage(location)) {
      this.storeActive(tab);
      this.fetchStatusCount();
    }
  };

  isPackagesPage = location => location === 'page-packages';

  isCampaignsPage = location => location === 'page-campaigns';

  isActive = tab => (tab === this.activeTab) ? 'tab-navigation__link--active' : '';

  @action
  setActive = tab => { this.activeTab = tab; };

  @action
  fetchStatusCount = () => {
    const { stores } = this.props;
    const { campaignsStore } = stores;

    campaignsStore.fetchStatusCounts();
  };

  @action
  storeActive = tab => {
    const { stores } = this.props;
    const { campaignsStore } = stores;
    campaignsStore.activeTab = tab;
  };

  render() {
    const { stores, location, showCreateCampaignModal } = this.props;
    const { campaignsStore } = stores;
    const { count } = campaignsStore;
    const packagesTabsActive = location === 'page-packages';
    const campaignsTabsActive = location === 'page-campaigns';

    return (
      <div className='tab-navigation-wrapper'>
        {packagesTabsActive && (
          <div className='tab-navigation'>
            <ul className='tab-navigation__links'>
              <li
                onClick={() => {
                  this.switch('compact');
                }}
                className={`tab-navigation__link ${this.isActive('compact')}`}
              >
                <span>{'Compact'}</span>
              </li>
              <li
                onClick={() => {
                  this.switch('advanced');
                }}
                className={`tab-navigation__link ${this.isActive('advanced')}`}
              >
                <span>{'Advanced (BETA)'}</span>
              </li>
            </ul>
          </div>
        )}
        {campaignsTabsActive && (
          <div className='tab-navigation clearfix'>
            <ul className='tab-navigation__links'>
              {CAMPAIGNS_STATUSES.map(status => (
                <li
                  key={status}
                  onClick={() => {
                    this.switch(status);
                  }}
                  className={`tab-navigation__link ${this.isActive(status)}`}
                >
                  <span>{`${count[status]} ${CAMPAIGNS_STATUS_TAB_TITLE[status]}`}</span>
                </li>
              ))}
            </ul>
            <div className='tab-navigation__buttons'>
              <Button
                htmlType='button'
                className='ant-btn ant-btn-hero'
                id='button-create-campaign'
                onClick={e => {
                  e.preventDefault();
                  showCreateCampaignModal();
                }}
              >
                {'Create Campaign'}
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default TabNavigation;
