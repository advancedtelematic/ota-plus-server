/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Button } from "antd";

@inject('stores')
@observer
class TabNavigation extends Component {
  static propTypes = {
    stores: PropTypes.object,
    location: PropTypes.string.isRequired,
    switchTab: PropTypes.func.isRequired,
    activeTab: PropTypes.string.isRequired,
    showCreateCampaignModal: PropTypes.func,
  };

  componentWillMount() {
    const { stores, location } = this.props;
    const { campaignsStore } = stores;
    const isCampaignsPage = location === 'page-campaigns';
    if (isCampaignsPage) campaignsStore.fetchStatusCounts();
  }

  isActive = tab => {
    const { activeTab } = this.props;
    return tab === activeTab ? 'tab-navigation__link--active' : '';
  };

  switchTo = tab => {
    const { switchTab } = this.props;
    switchTab(tab);
  };

  render() {
    const { stores, location, showCreateCampaignModal } = this.props;
    const { campaignsStore } = stores;
    const { prepared, launched, finished, cancelled } = campaignsStore.count;
    const packagesTabsActive = location === 'page-packages';
    const campaignsTabsActive = location === 'page-campaigns';

    return (
      <div className='tab-navigation-wrapper'>
        {packagesTabsActive && (
          <div className='tab-navigation'>
            <ul className='tab-navigation__links'>
              <li
                onClick={() => {
                  this.switchTo('compact');
                }}
                className={`tab-navigation__link ${this.isActive('compact')}`}
              >
                <span>{'Compact'}</span>
              </li>
              <li
                onClick={() => {
                  this.switchTo('advanced');
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
              <li
                onClick={() => {
                  this.switchTo('prepared');
                }}
                className={`tab-navigation__link ${this.isActive('prepared')}`}
              >
                <span>{`${prepared} In Preparation`}</span>
              </li>
              <li
                onClick={() => {
                  this.switchTo('launched');
                }}
                className={`tab-navigation__link ${this.isActive('launched')}`}
              >
                <span>{`${launched} Running`}</span>
              </li>
              <li
                onClick={() => {
                  this.switchTo('finished');
                }}
                className={`tab-navigation__link ${this.isActive('finished')}`}
              >
                <span>{`${finished} Finished`}</span>
              </li>
              <li
                onClick={() => {
                  this.switchTo('cancelled');
                }}
                className={`tab-navigation__link ${this.isActive('cancelled')}`}
              >
                <span>{`${cancelled} Canceled`}</span>
              </li>
            </ul>
            <div className='tab-navigation__buttons'>
              <Button htmlType='button' className='ant-btn ant-btn-hero' id='button-create-campaign'
                onClick={ e => {
                  e.preventDefault();
                  showCreateCampaignModal();
                } }>
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
