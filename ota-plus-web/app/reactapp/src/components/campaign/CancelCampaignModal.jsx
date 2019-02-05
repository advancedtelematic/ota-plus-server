/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { translate } from 'react-i18next';
import _ from 'lodash';

import { Button } from 'antd';
import { AsyncStatusCallbackHandler } from '../../utils';
import { OTAModal, AsyncResponse } from '../../partials';

import { assets } from '../../config';

@inject('stores')
@observer
class CancelCampaignModal extends Component {
  static propTypes = {
    stores: PropTypes.object,
    shown: PropTypes.bool.isRequired,
    hide: PropTypes.func.isRequired,
    t: PropTypes.func,
  };

  constructor(props) {
    super(props);
    const { stores } = props;
    const { campaignsStore } = stores;
    this.cancelHandler = new AsyncStatusCallbackHandler(campaignsStore, 'campaignsCancelAsync', this.handleResponse);
  }

  componentWillUnmount() {
    this.cancelHandler();
  }

  cancelCampaign = () => {
    const { stores } = this.props;
    const { campaignsStore } = stores;
    const { campaign } = campaignsStore;
    campaignsStore.cancelCampaign(campaign.id);
    campaignsStore.activeTab = 'cancelled';
  };

  handleResponse = () => {
    const { hide } = this.props;
    hide();
  };

  render() {
    const { stores, t, shown, hide } = this.props;
    const { campaignsStore } = stores;
    const { campaign } = campaignsStore;
    const content = !_.isEmpty(campaign) ? (
      <span>
        <AsyncResponse
          handledStatus='error'
          action={campaignsStore.campaignsCancelAsync}
          errorMsg={campaignsStore.campaignsCancelAsync.data ? campaignsStore.campaignsCancelAsync.data.description : null}
        />
        <div className='element-box campaign'>
          <div className='icon' />
          <div className='desc'>
            <div className='title' id='cancel-all-campaign-name'>
              {campaign.name}
            </div>
            <div className='subtitle'>{t('common.deviceWithCount', { count: campaignsStore.overallCampaignStatistics.devicesCount })}</div>
          </div>
        </div>
        <span>
          This campaign will not be executed on any further devices, <br />
          and will be moved to <strong>Finished</strong>.
        </span>
        <div className='body-actions'>
          <Button htmlType='button' className='btn-primary' id='cancel-all-confirm' onClick={this.cancelCampaign}>
            Confirm
          </Button>
        </div>
      </span>
    ) : (
      <span />
    );
    return (
      <OTAModal
        title={"You're about to cancel a campaign"}
        topActions={
          <div className='top-actions flex-end'>
            <div className='modal-close' onClick={hide}>
              <img src={assets.DEFAULT_CLOSE_ICON} alt='Close' />
            </div>
          </div>
        }
        content={content}
        visible={shown}
        className='cancel-campaign-modal'
      />
    );
  }
}

export default translate()(CancelCampaignModal);
