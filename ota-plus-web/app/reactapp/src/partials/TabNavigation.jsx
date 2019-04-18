/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Button, Dropdown, Icon, Menu, Tag } from 'antd';
import { Form } from 'formsy-antd';
import { action, observable } from 'mobx';

import { CAMPAIGNS_STATUSES, CAMPAIGNS_STATUS_TAB_TITLE, CAMPAIGNS_DEFAULT_TAB } from '../config';
import { SearchBar } from './index';

@inject('stores')
@observer
class TabNavigation extends Component {
  @observable activeTab = CAMPAIGNS_DEFAULT_TAB;
  @observable campaignsFilter = '';

  static propTypes = {
    location: PropTypes.string.isRequired,
    showCreateCampaignModal: PropTypes.func,
    stores: PropTypes.shape({}),
  };

  static defaultProps = {
    showCreateCampaignModal: () => null,
    stores: {}
  };

  constructor(props) {
    super(props);
    this.state = {
      filterValue: ''
    };
    this.filterChangeCallback = this.filterChangeCallback.bind(this);
    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.menu = (
      <Menu onClick={this.handleMenuClick}>
        {CAMPAIGNS_STATUSES.map(status => (
          <Menu.Item key={status}>
            <Icon type="arrow-right" />
            {CAMPAIGNS_STATUS_TAB_TITLE[status]}
          </Menu.Item>
        ))}
      </Menu>
    );
  }

  componentDidMount() {
    const { stores, location } = this.props;
    const { campaignsStore, softwareStore } = stores;
    if (this.isCampaignsPage(location)) {
      this.setActive(campaignsStore.activeTab);
      this.fetchStatusCount();
      this.setFilter(campaignsStore.campaignsFilter);
    }
    if (this.isPackagesPage(location)) {
      this.setActive(softwareStore.activeTab);
    }
  }

  componentWillUnmount() {
    this.storeActive(this.activeTab);
  }

  isPackagesPage = location => location === 'page-software-repository';

  isCampaignsPage = location => location === 'page-campaigns';

  isActive = tab => (tab === this.activeTab ? 'tab-navigation__link--active' : '');

  @action
  fetchStatusCount = () => {
    const { stores } = this.props;
    const { campaignsStore } = stores;
    campaignsStore.fetchStatusCounts();
  };


  @action
  setActive = (tab) => {
    this.activeTab = tab;
    this.storeActive(tab);
  };

  @action
  storeActive = (tab) => {
    const { stores, location } = this.props;
    const { campaignsStore, softwareStore } = stores;
    if (this.isCampaignsPage(location)) {
      campaignsStore.activeTab = tab;
    }
    if (this.isPackagesPage(location)) {
      softwareStore.activeTab = tab;
    }
  };

  @action
  setFilter = (filter) => {
    this.campaignsFilter = filter;
    this.storeFilter(filter);
  };

  @action
  storeFilter = (filter) => {
    const { stores } = this.props;
    const { campaignsStore } = stores;
    campaignsStore.campaignsFilter = filter;
  };

  handleMenuClick(event) {
    this.setActive(event.key);
    this.fetchStatusCount();
  }

  filterChangeCallback(value) {
    const { stores } = this.props;
    const { campaignsStore } = stores;
    this.setState({ filterValue: value });
    this.setFilter(value);
    campaignsStore.fetchCampaigns(this.activeTab, 'campaignsFetchAsync', 0);
    this.fetchStatusCount();
  }

  render() {
    const { location, showCreateCampaignModal } = this.props;
    const { filterValue } = this.state;
    const packagesTabsActive = location === 'page-software-repository';
    const campaignsTabsActive = location === 'page-campaigns';

    return (
      <div className="tab-navigation-wrapper">
        {packagesTabsActive && (
          <div className="tab-navigation">
            <ul className="tab-navigation__links">
              <li
                onClick={() => {
                  this.setActive('compact');
                }}
                className={`tab-navigation__link ${this.isActive('compact')}`}
              >
                <span>{'Compact'}</span>
              </li>
              <li
                onClick={() => {
                  this.setActive('advanced');
                }}
                className={`tab-navigation__link ${this.isActive('advanced')}`}
              >
                <span>
                  {'Advanced'}
                  <Tag color="#48dad0" className="alpha-tag">
                    ALPHA
                  </Tag>
                </span>
              </li>
            </ul>
          </div>
        )}
        {campaignsTabsActive && (
          <div className="tab-navigation clearfix">
            <div className="tab-navigation__buttons">
              <div className="tab-navigation__drop-down-container">
                <Dropdown overlay={this.menu}>
                  <Button
                    htmlType="button"
                    className="ant-btn ant-btn-hero drop-down"
                  >
                    {CAMPAIGNS_STATUS_TAB_TITLE[this.activeTab]}
                    <Icon type="down" />
                  </Button>
                </Dropdown>
              </div>
              <Form className="tab-navigation__form-search-campaigns-filter">
                <SearchBar value={filterValue} changeAction={this.filterChangeCallback} id="search-campaigns-filter" />
              </Form>
              <Button
                htmlType="button"
                className="ant-btn ant-btn-hero"
                id="button-create-campaign"
                onClick={(event) => {
                  event.preventDefault();
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
