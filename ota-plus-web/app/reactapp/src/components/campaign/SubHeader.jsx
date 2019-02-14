/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable } from 'mobx';

import { Button, Menu } from 'antd';
import { DropdownMenu, EditCampaignModal } from '../../partials';

import { assets } from '../../config';

@inject('stores')
@observer
class SubHeader extends Component {
  @observable campaignName = '';
  @observable editModal = false;

  static propTypes = {
    campaign: PropTypes.object.isRequired,
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

  showEditModal = e => {
    e.preventDefault();
    this.editModal = true;
  };

  hideEditModal = () => {
    this.editModal = false;
  };

  render() {
    const { campaign, showCancelCampaignModal } = this.props;

    return (
      <div className='statistics__campaign-name'>
        <h3>{campaign.name}</h3>
        <div className='statistics__campaign-actions'>
          {(campaign.statistics.status === 'launched' || campaign.statistics.status === 'scheduled') && (
            <div className='cancel-campaign'>
              <Button htmlType='button' id='campaign-detail-cancel-all' className='delete-button fixed-width' onClick={showCancelCampaignModal}>
                Cancel campaign
              </Button>
            </div>
          )}
          <DropdownMenu placement='bottomRight'>
            <Menu.Item>
              <Button htmlType='button' className='campaign__dropdown--item' id='edit-comment' onClick={this.showEditModal}>
                <img src={assets.DEFAULT_EDIT_ICON} alt='Icon' />
                Edit
              </Button>
            </Menu.Item>
          </DropdownMenu>
        </div>
        <EditCampaignModal modalTitle={<div className='title'>Edit name</div>} shown={this.editModal} hide={this.hideEditModal} defaultValue={campaign.name} />
      </div>
    );
  }
}

SubHeader.propTypes = {};

export default SubHeader;
