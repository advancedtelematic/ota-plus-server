/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Dropdown, Tag } from 'antd';
import { Form } from 'formsy-antd';
import { action, observable, observe } from 'mobx';
import Button from '../Button';
import SearchBar from '../SearchBar';
import { ButtonStyled, ButtonText, IconStyled, MenuItemStyled, MenuStyled } from './styled';
import {
  ALPHA_TAG,
  CAMPAIGNS_STATUSES,
  CAMPAIGNS_STATUS_TAB_TITLE,
  CAMPAIGNS_DEFAULT_TAB,
  CAMPAIGNS_STATUS_ALL,
  CAMPAIGNS_STATUS_PREPARED,
  CAMPAIGNS_STATUS_LAUNCHED,
  CAMPAIGNS_STATUS_FINISHED,
  CAMPAIGNS_STATUS_CANCELLED,
  isFeatureEnabled,
  UI_FEATURES,
} from '../../config';
import { sendAction } from '../../helpers/analyticsHelper';
import {
  OTA_CAMPAIGNS_SEE_ALL,
  OTA_CAMPAIGNS_FILTER_PREPARATION,
  OTA_CAMPAIGNS_FILTER_RUNNING,
  OTA_CAMPAIGNS_FILTER_FINISHED,
  OTA_CAMPAIGNS_FILTER_CANCELED,
  OTA_CAMPAIGNS_CREATE_CAMPAIGN,
  OTA_CAMPAIGNS_SEARCH_CAMPAIGN
} from '../../constants/analyticsActions';

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
    const { campaignsStore } = props.stores;
    this.filterChangeCallback = this.filterChangeCallback.bind(this);
    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.menu = (
      <MenuStyled onClick={this.handleMenuClick}>
        {CAMPAIGNS_STATUSES.map(status => (
          <MenuItemStyled key={status}>
            {CAMPAIGNS_STATUS_TAB_TITLE[status]}
          </MenuItemStyled>
        ))}
      </MenuStyled>
    );
    this.fetchCampaignsCancelHandler = observe(campaignsStore, (change) => {
      if (change.name === 'campaignsCancelAsync' && change.object[change.name].isFetching === false) {
        this.setActive(campaignsStore.activeTab);
      }
    });
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
    this.fetchCampaignsCancelHandler();
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
    switch (event.key) {
      case CAMPAIGNS_STATUS_ALL:
      default:
        sendAction(OTA_CAMPAIGNS_SEE_ALL);
        break;
      case CAMPAIGNS_STATUS_PREPARED:
        sendAction(OTA_CAMPAIGNS_FILTER_PREPARATION);
        break;
      case CAMPAIGNS_STATUS_LAUNCHED:
        sendAction(OTA_CAMPAIGNS_FILTER_RUNNING);
        break;
      case CAMPAIGNS_STATUS_FINISHED:
        sendAction(OTA_CAMPAIGNS_FILTER_FINISHED);
        break;
      case CAMPAIGNS_STATUS_CANCELLED:
        sendAction(OTA_CAMPAIGNS_FILTER_CANCELED);
        break;
    }
  }

  filterChangeCallback(value) {
    const { stores } = this.props;
    const { campaignsStore } = stores;
    this.setState({ filterValue: value });
    this.setFilter(value);
    campaignsStore.fetchCampaigns(this.activeTab, 'campaignsFetchAsync', 0);
    this.fetchStatusCount();
    sendAction(OTA_CAMPAIGNS_SEARCH_CAMPAIGN);
  }

  render() {
    const { location, showCreateCampaignModal, stores } = this.props;
    const { filterValue } = this.state;
    const { userStore } = stores;
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
                  <Tag color="#00B6B2" className="alpha-tag">
                    {ALPHA_TAG}
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
                  <ButtonStyled>
                    <ButtonText>
                      {CAMPAIGNS_STATUS_TAB_TITLE[this.activeTab]}
                    </ButtonText>
                    <IconStyled type="down" />
                  </ButtonStyled>
                </Dropdown>
              </div>
              <Form className="tab-navigation__form-search-campaigns-filter">
                <SearchBar value={filterValue} changeAction={this.filterChangeCallback} id="search-campaigns-filter" />
              </Form>
              {isFeatureEnabled(userStore.uiFeatures, UI_FEATURES.CREATE_CAMPAIGN) && (
                <Button
                  id="button-create-campaign"
                  onClick={(event) => {
                    event.preventDefault();
                    showCreateCampaignModal();
                    sendAction(OTA_CAMPAIGNS_CREATE_CAMPAIGN);
                  }}
                >
                  {'Create campaign'}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default TabNavigation;
