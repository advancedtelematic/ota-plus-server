/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { action, observable, observe, onBecomeObserved } from 'mobx';
import { withTranslation } from 'react-i18next';
import { Pagination } from 'antd';
import _ from 'lodash';

import ListHeader from './ListHeader';
import List from './List';
import Loader from '../../partials/Loader';
import TabNavigation from '../../partials/TabNavigation';

import {
  ACTIVE_TAB_KEY,
  CAMPAIGNS_DEFAULT_TAB,
  CAMPAIGNS_FETCH_ASYNC,
  CAMPAIGNS_FILTER,
  CAMPAIGNS_ICON_WHITE,
  CAMPAIGNS_LIMIT_PER_PAGE,
  CAMPAIGNS_PAGE_NUMBER_DEFAULT,
} from '../../config';

@inject('stores')
@observer
class ContentPanel extends Component {
  @observable activeTab = CAMPAIGNS_DEFAULT_TAB;

  static propTypes = {
    stores: PropTypes.shape({}),
    expandedCampaigns: PropTypes.arrayOf(PropTypes.shape({})),
    highlight: PropTypes.string,
    addNewWizard: PropTypes.func,
    showCancelCampaignModal: PropTypes.func,
    showDependenciesModal: PropTypes.func,
    showRetryModal: PropTypes.func,
    t: PropTypes.func.isRequired,
    toggleCampaign: PropTypes.func,
  };

  constructor(props) {
    super(props);
    const { stores } = props;
    const { campaignsStore } = stores;
    this.state = { pageNumber: CAMPAIGNS_PAGE_NUMBER_DEFAULT };

    this.cancelObserveTabChange = observe(campaignsStore, (change) => {
      this.applyTab(change);
      if (change.name === CAMPAIGNS_FILTER) {
        this.setState({ pageNumber: CAMPAIGNS_PAGE_NUMBER_DEFAULT });
      }
    });

    onBecomeObserved(this, ACTIVE_TAB_KEY, this.resumeScope);
  }

  componentWillUnmount() {
    this.cancelObserveTabChange();
  }

  @action
  setActive = (tab) => {
    this.activeTab = tab;
  };

  onPageChange = (page, pageSize) => {
    this.setState({ pageNumber: page });
    this.fetchCampaignsData(page, pageSize);
  };

  showTotalTemplate = (total, range) => (total > 0 ? `${range[0]}-${range[1]} of ${total}` : '');

  resumeScope = () => {
    const { stores, highlight, toggleCampaign } = this.props;
    const { campaignsStore } = stores;
    const { pageNumber } = this.state;

    this.setActive(campaignsStore.activeTab);
    if (pageNumber !== CAMPAIGNS_PAGE_NUMBER_DEFAULT) {
      this.setState({ pageNumber: CAMPAIGNS_PAGE_NUMBER_DEFAULT });
    }
    this.fetchCampaignsData(CAMPAIGNS_PAGE_NUMBER_DEFAULT, CAMPAIGNS_LIMIT_PER_PAGE);

    /**
     * Since data set of latest active campaigns is a subset of all campaigns in general
     * it is safe to treat prop "highlight" as given.
     *
     * A search for a campaign with "highlight" equal to campaign.id as formerly implemented
     * is not necessary. It's sufficient to push a faked campaign object with {id: highlight}
     * into array of expanded campaigns. Based on this information List component can accordingly set
     * the correct campaign as expanded.
     */
    if (!_.isUndefined(highlight) && _.isString(highlight) && !_.isEmpty(highlight)) {
      toggleCampaign({ id: highlight });
    }
  };

  applyTab = (change) => {
    const { name, newValue } = change;

    if (name === ACTIVE_TAB_KEY) {
      this.setActive(newValue);
      this.setState({ pageNumber: CAMPAIGNS_PAGE_NUMBER_DEFAULT });
      this.fetchCampaignsData(1, CAMPAIGNS_LIMIT_PER_PAGE);
    }
  };

  fetchCampaignsData = (page, pageSize) => {
    const { stores } = this.props;
    const { campaignsStore } = stores;

    campaignsStore.fetchCampaigns(this.activeTab, CAMPAIGNS_FETCH_ASYNC, (page - 1) * pageSize);
  };

  render() {
    const { pageNumber } = this.state;
    const { addNewWizard, expandedCampaigns, showCancelCampaignModal, showDependenciesModal, showRetryModal,
      stores, t, toggleCampaign } = this.props;
    const { campaignsStore } = stores;
    const { campaignsFetchAsync, campaigns, campaignsFilter } = campaignsStore;

    return (
      <span>
        <div>
          <TabNavigation showCreateCampaignModal={addNewWizard} location="page-campaigns" />
          {(campaigns.length > 0 || campaignsFilter.length > 0) && (
            <ListHeader status={this.activeTab} addNewWizard={addNewWizard} />
          )}
        </div>
        {campaignsFetchAsync[this.activeTab].isFetching ? (
          <div className="wrapper-center">
            <Loader />
          </div>
        ) : (
          (campaigns.length > 0 || campaignsFilter.length > 0) ? (
            <List
              status={this.activeTab}
              expandedCampaigns={expandedCampaigns}
              showCancelCampaignModal={showCancelCampaignModal}
              showDependenciesModal={showDependenciesModal}
              showRetryModal={showRetryModal}
              toggleCampaign={toggleCampaign}
            />
          ) : (
            <div className="wrapper-center">
              <div className="page-intro">
                <img src={CAMPAIGNS_ICON_WHITE} alt="Icon" />
                <div>{t('campaigns.no_campaigns')}</div>
                <div>
                  <a
                    href="#"
                    className="add-button light"
                    id="add-new-campaign"
                    onClick={(event) => {
                      if (event) event.preventDefault();
                      addNewWizard();
                    }}
                  >
                    <span>{t('campaigns.create')}</span>
                  </a>
                </div>
              </div>
            </div>
          )
        )}
        {campaigns.length > 0 && (
          <div className="ant-pagination__wrapper clearfix">
            <Pagination
              current={pageNumber}
              defaultPageSize={CAMPAIGNS_LIMIT_PER_PAGE}
              onChange={this.onPageChange}
              total={campaignsStore.count[this.activeTab]}
              showTotal={this.showTotalTemplate}
            />
          </div>
        )}
      </span>
    );
  }
}

export default withTranslation()(ContentPanel);
