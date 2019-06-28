/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable } from 'mobx';

import { Button } from 'antd';
import { EditCampaignModal, Dropdown } from '../../partials';

@inject('stores')
@observer
class SubHeader extends Component {
  @observable campaignName = '';

  @observable editModal = false;

  @observable showDropdown = false;

  static propTypes = {
    campaign: PropTypes.shape({}).isRequired,
    showCancelCampaignModal: PropTypes.func,
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
  }

  render() {
    const { campaign, showCancelCampaignModal } = this.props;
    const { name } = campaign;
    return (
      <div className="statistics__campaign-name">
        <h3>{campaign.name}</h3>
        <div className="statistics__campaign-actions">
          {(campaign.statistics.status === 'launched' || campaign.statistics.status === 'scheduled') && (
            <div className="cancel-campaign">
              <Button
                htmlType="button"
                id="campaign-detail-cancel-all"
                className="delete-button fixed-width"
                onClick={showCancelCampaignModal}
              >
                Cancel campaign
              </Button>
            </div>
          )}
          <div className="dots relative" id="campaign-actions" onClick={this.toggleDropdown}>
            <span />
            <span />
            <span />
            {this.showDropdown && (
              <Dropdown hideSubmenu={this.hideEditModal} customClassName="relative">
                <li className="device-dropdown-item">
                  <a className="device-dropdown-item" id="rename-campaign" onClick={this.showEditModal}>
                    {'Rename campaign'}
                  </a>
                </li>
              </Dropdown>
            )}
          </div>
        </div>
        <EditCampaignModal
          modalTitle={(
            <div className="title">
              {'Rename campaign'}
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

export default SubHeader;
