/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import _ from 'lodash';
import { Dropdown, EditCampaignModal } from '../../partials';
import { AsyncStatusCallbackHandler } from '../../utils';

@observer
class SubHeader extends Component {
  @observable renameDisabled = true;
  @observable newCampaignNameLength = 0;
  @observable submenuIsShown = false;
  @observable editModal = false;

  componentWillMount() {
    this.oldCampaignName = this.props.campaign.name;
    this.newCampaignName = this.props.campaign.name;
    this.newCampaignNameLength = this.props.campaign.name.length;
  }
  componentWillReceiveProps(nextProps) {
    if (!_.isEmpty(nextProps.campaign.name)) {
      this.oldCampaignName = nextProps.campaign.name;
      this.newCampaignName = nextProps.campaign.name;
      this.newCampaignNameLength = nextProps.campaign.name.length;
    }
  }

  showEditModal = e => {
    e.preventDefault();
    this.editModal = true;
  };

  hideEditModal = () => {
    this.editModal = false;
  };

  hideSubmenu = () => {
    this.submenuIsShown = false;
  };

  showSubmenu = () => {
    this.submenuIsShown = true;
  };

  render() {
    const { campaign, showCancelCampaignModal, hideCancel = true } = this.props;
    return (
      <div className='statistics__campaign-name'>
        {this.newCampaignName}
        <div className='statistics__campaign-actions'>
          {campaign.statistics.status === 'launched' || campaign.statistics.status === 'scheduled' ? (
            <div className='cancel-campaign'>
              <button id='campaign-detail-cancel-all' className='delete-button fixed-width' onClick={showCancelCampaignModal}>
                Cancel campaign
              </button>
            </div>
          ) : null}
          <div className='dots' id='campaign-menu' onClick={this.showSubmenu}>
            <span />
            <span />
            <span />

            {this.submenuIsShown ? (
              <Dropdown hideSubmenu={this.hideSubmenu}>
                <li className='package-dropdown-item'>
                  <a className='package-dropdown-item' href='#' id='edit-comment' onClick={this.showEditModal}>
                    <img src='/assets/img/icons/edit_icon.svg' alt='Icon' />
                    Edit
                  </a>
                </li>
              </Dropdown>
            ) : null}
          </div>
        </div>
        <EditCampaignModal modalTitle={<div className='title'>Edit name</div>} shown={this.editModal} hide={this.hideEditModal} defaultValue={this.newCampaignName} />
      </div>
    );
  }
}

SubHeader.propTypes = {};

export default SubHeader;
