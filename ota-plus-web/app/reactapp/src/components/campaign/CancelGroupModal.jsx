/** @format */

import React, { Component, PropTypes } from 'react';
import { observer, inject } from 'mobx-react';
import { Modal, AsyncResponse } from '../../partials';
import { AsyncStatusCallbackHandler } from '../../utils';
import { FlatButton } from 'material-ui';
import { translate } from 'react-i18next';
import _ from 'underscore';

@inject('stores')
@observer
class CancelGroupModal extends Component {
  constructor(props) {
    super(props);
    const { campaignsStore } = props.stores;
    this.cancelHandler = new AsyncStatusCallbackHandler(campaignsStore, 'campaignsCancelRequestAsync', this.handleResponse.bind(this));
  }
  componentWillUnmount() {
    this.cancelHandler();
  }
  cancelCampaignRequest() {
    const { campaignsStore } = this.props.stores;
    campaignsStore.cancelCampaignRequest(this.props.updateRequest.updateRequest);
  }
  handleResponse() {
    const { campaignsStore } = this.props.stores;
    const { campaign } = campaignsStore;
    campaignsStore.fetchCampaign(campaign.meta.id);
    this.props.hide();
  }
  render() {
    const { t, shown, hide, updateRequest } = this.props;
    const { campaignsStore } = this.props.stores;
    const { campaign } = campaignsStore;
    const content = !_.isEmpty(updateRequest) ? (
      <span>
        <AsyncResponse
          handledStatus='error'
          action={campaignsStore.campaignsCancelRequestAsync}
          errorMsg={campaignsStore.campaignsCancelRequestAsync.data ? campaignsStore.campaignsCancelRequestAsync.data.description : null}
        />
        <div className='element-box group'>
          <div className='icon' />
          <div className='desc'>
            <div className='title'>{updateRequest.groupName}</div>
            <div className='subtitle'>{t('common.deviceWithCount', { count: updateRequest.deviceCount })}</div>
          </div>
        </div>
        <div>
          This campaign will not be installable anymore for devices in group {updateRequest.groupName}, <br />
          and all devices in the group will be moved to <strong>Finished</strong>.
        </div>
        <div className='body-actions'>
          <a href='#' onClick={hide} className='link-cancel'>
            Close
          </a>
          <FlatButton label='Confirm' type='submit' className='btn-main' onClick={this.cancelCampaignRequest.bind(this)} />
        </div>
      </span>
    ) : (
      <span />
    );

    return <Modal title="You're about to cancel a campaign for group" content={content} shown={shown} className='cancel-campaign-group-modal' />;
  }
}

CancelGroupModal.propTypes = {
  shown: PropTypes.bool.isRequired,
  hide: PropTypes.func.isRequired,
  stores: PropTypes.object,
  updateRequest: PropTypes.object.isRequired,
};

export default translate()(CancelGroupModal);
