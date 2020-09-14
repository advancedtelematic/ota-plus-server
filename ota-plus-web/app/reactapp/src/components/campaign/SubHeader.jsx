/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable } from 'mobx';
import { withTranslation } from 'react-i18next';

import { Button, Tooltip } from 'antd';
import { EditCampaignModal, Dropdown } from '../../partials';
import { CAMPAIGNS_STATUS_LAUNCHED, CAMPAIGNS_STATUS_SCHEDULED, isFeatureEnabled, UI_FEATURES } from '../../config';

@inject('stores')
@observer
class SubHeader extends Component {
  @observable campaignName = '';

  @observable editModal = false;

  @observable showDropdown = false;

  static propTypes = {
    campaign: PropTypes.shape({}).isRequired,
    showCancelCampaignModal: PropTypes.func,
    stores: PropTypes.shape({}),
    t: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    const { campaign } = props;
    this.campaignName = campaign.name;
  }

  componentDidMount() {
    const { campaign } = this.props;
    this.campaignName = campaign.name;
  }

  showEditModal = (e) => {
    e.preventDefault();
    this.editModal = true;
  };

  hideEditModal = () => {
    this.editModal = false;
  };

  toggleDropdown = () => {
    this.showDropdown = !this.showDropdown;
  };

  render() {
    const { campaign, showCancelCampaignModal, stores, t } = this.props;
    const { userStore } = stores;
    const { uiFeatures } = userStore;
    const { name } = campaign;
    return (
      <div className="statistics__campaign-name">
        <h3>{campaign.name}</h3>
        <div className="statistics__campaign-actions">
          {(campaign.statistics.status === CAMPAIGNS_STATUS_LAUNCHED
          || campaign.statistics.status === CAMPAIGNS_STATUS_SCHEDULED)
          && isFeatureEnabled(uiFeatures, UI_FEATURES.CANCEL_CAMPAIGN) && (
            <Tooltip title={t('campaigns.details.cancel_tooltip')} placement="left">
              <div className="cancel-campaign">
                <Button
                  htmlType="button"
                  id="campaign-detail-cancel-all"
                  className="delete-button fixed-width"
                  onClick={showCancelCampaignModal}
                >
                  {t('campaigns.details.cancel')}
                </Button>
              </div>
            </Tooltip>
          )}
          <div className="dots relative" id="campaign-actions" onClick={this.toggleDropdown}>
            <span />
            <span />
            <span />
            {this.showDropdown && (
              <Dropdown hideSubmenu={this.hideEditModal} customClassName="relative">
                <li className="device-dropdown-item">
                  <a className="device-dropdown-item" id="rename-campaign" onClick={this.showEditModal}>
                    {t('campaigns.details.rename')}
                  </a>
                </li>
              </Dropdown>
            )}
          </div>
        </div>
        <EditCampaignModal
          modalTitle={(
            <div className="title">
              {t('campaigns.details.rename')}
            </div>
          )}
          shown={this.editModal}
          hide={this.hideEditModal}
          defaultValue={name}
        />
      </div>
    );
  }
}

export default withTranslation()(SubHeader);
