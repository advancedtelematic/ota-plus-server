/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';
import { withTranslation } from 'react-i18next';

import { DependenciesModal } from '../partials';
import { resetAsync } from '../utils/Common';
import { CampaignsContentPanel, RetryModal } from '../components/campaigns';
import { CampaignCancelCampaignModal } from '../components/campaign';
import { MetaData } from '../utils';
import { sendAction, setAnalyticsView } from '../helpers/analyticsHelper';
import {
  OTA_CAMPAIGNS_SEE_ALL,
  OTA_CAMPAIGNS_SEE_DETAILS,
  OTA_CAMPAIGNS_SEE_DEPENDENCIES,
  OTA_CAMPAIGNS_CANCEL_CAMPAIGN,
  OTA_CAMPAIGNS_RETRY_FAILED_DEVICES
} from '../constants/analyticsActions';
import { ANALYTICS_VIEW_CAMPAIGNS } from '../constants/analyticsViews';

@inject('stores')
@observer
class Campaigns extends Component {
  @observable cancelCampaignModalShown = false;

  @observable dependenciesModalShown = false;

  @observable retryModalShown = false;

  @observable activeCampaign = null;

  @observable failureforRetry = null;

  @observable expandedCampaigns = [];

  static propTypes = {
    stores: PropTypes.shape({}),
    highlight: PropTypes.string,
    history: PropTypes.shape({}),
    addNewWizard: PropTypes.func,
    t: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    const { t } = props;
    this.title = t('campaigns.title');
  }

  componentDidMount() {
    sendAction(OTA_CAMPAIGNS_SEE_ALL);
    const { history } = this.props;
    const { state } = history.location;
    if (state && state.openWizard) {
      const { addNewWizard } = this.props;
      addNewWizard();
    }
    setAnalyticsView(ANALYTICS_VIEW_CAMPAIGNS);
  }

  toggle = (campaign) => {
    if (!_.isEqual(this.expandedCampaigns.pop(), campaign)) {
      this.expandedCampaigns.push(campaign);
    }
    const { t } = this.props;
    this.title = this.expandedCampaigns.length === 0 ? t('campaigns.title') : t('campaigns.details.title');
    if (this.expandedCampaigns.length) {
      sendAction(OTA_CAMPAIGNS_SEE_DETAILS);
    }
  };

  showWizard = (campaignId) => {
    this.campaignIdToAction = campaignId;
  };

  showCancelCampaignModal = (e) => {
    if (e) e.preventDefault();
    this.cancelCampaignModalShown = true;
    sendAction(OTA_CAMPAIGNS_CANCEL_CAMPAIGN);
  };

  hideCancelCampaignModal = (e) => {
    if (e) e.preventDefault();
    const { stores } = this.props;
    const { campaignsStore } = stores;
    this.cancelCampaignModalShown = false;
    resetAsync(campaignsStore.campaignsCancelAsync);
  };

  showDependenciesModal = (activeCampaign, e) => {
    if (e) e.preventDefault();
    this.dependenciesModalShown = true;
    this.activeCampaign = activeCampaign;
    sendAction(OTA_CAMPAIGNS_SEE_DEPENDENCIES);
  };

  hideDependenciesModal = (e) => {
    if (e) e.preventDefault();
    this.dependenciesModalShown = false;
    this.activeCampaign = null;
  };

  showRetryModal = (failure, e) => {
    if (e) e.preventDefault();
    this.retryModalShown = true;
    this.failureforRetry = failure;
    sendAction(OTA_CAMPAIGNS_RETRY_FAILED_DEVICES);
  };

  hideRetryModal = (e) => {
    if (e) e.preventDefault();
    this.retryModalShown = false;
    this.activeCampaign = null;
  };

  changeSort = (sort, e) => {
    if (e) e.preventDefault();
    const { stores } = this.props;
    const { campaignsStore } = stores;
    campaignsStore.prepareCampaigns(campaignsStore.campaignsFilter, sort);
  };

  changeFilter = (filter) => {
    const { stores } = this.props;
    const { campaignsStore } = stores;
    campaignsStore.prepareCampaigns(filter, campaignsStore.campaignsSort);
  };

  render() {
    const { addNewWizard, highlight } = this.props;

    return (
      <>
        <MetaData title={this.title}>
          <CampaignsContentPanel
            highlight={highlight}
            expandedCampaigns={this.expandedCampaigns}
            toggleCampaign={this.toggle}
            addNewWizard={addNewWizard}
            showWizard={this.showWizard}
            showCancelCampaignModal={this.showCancelCampaignModal}
            showDependenciesModal={this.showDependenciesModal}
            showRetryModal={this.showRetryModal}
          />
          <CampaignCancelCampaignModal
            shown={this.cancelCampaignModalShown}
            hide={this.hideCancelCampaignModal}
          />
          {this.dependenciesModalShown && (
            <DependenciesModal
              shown={this.dependenciesModalShown}
              hide={this.hideDependenciesModal}
              activeItemName={this.activeCampaign}
            />
          )}
          {this.retryModalShown && (
            <RetryModal
              shown={this.retryModalShown}
              hide={this.hideRetryModal}
              failureforRetry={this.failureforRetry}
            />
          )}
        </MetaData>
      </>
    );
  }
}

export default withTranslation()(withRouter(Campaigns));
