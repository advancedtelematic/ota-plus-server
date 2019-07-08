/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

import { OTAModal } from '../../partials';

@inject('stores')
@observer
class RetryModal extends Component {
  static propTypes = {
    stores: PropTypes.shape({}),
    shown: PropTypes.bool.isRequired,
    hide: PropTypes.func.isRequired,
    failureforRetry: PropTypes.string.isRequired
  };

  launch = () => {
    const { stores, hide, failureforRetry } = this.props;
    const { campaignsStore } = stores;
    campaignsStore.launchRetryCampaign(campaignsStore.campaign.id, failureforRetry);
    hide();
  }

  render() {
    const { shown, hide, failureforRetry } = this.props;
    const content = (
      <div>
        <div className="list-header">
          {'For this campaign, retry all installations that failed due to the following error: '}
          <b>{failureforRetry}</b>
        </div>
        <ol>
          <li>OTA Connect retries installation on each devices once only.</li>
          <li>
            {'After this retry cycle is completed, you\'ll see fresh failure statistics'}
            {'for all installation attempts in this retry cycle.'}
          </li>
          <li>You cannot start a retry cycle for another error type before this retry cycle is finished.</li>
          <li>If a device is installing another update, this retry cycle will not apply to the device.</li>
        </ol>
        <div className="list-header">If some installations still fail...</div>
        <ol>
          <li>You&apos;ll need to diagnose what&apos;s going wrong and possibly update your software.</li>
          <li>You can export the list of devices with failed installations to help with your analysis.</li>
          <li>Once you&apos;ve figured it out, create another update and deploy it in another campaign.</li>
        </ol>
        <div className="body-actions">
          <button type="submit" className="btn-primary" id="add-new-key-confirm" onClick={this.launch}>
            Confirm
          </button>
        </div>
      </div>
    );
    return (
      <OTAModal
        title="Confirm Retry"
        topActions={(
          <div className="top-actions flex-end">
            <div className="modal-close" onClick={hide}>
              <img src="/assets/img/icons/close.svg" alt="Icon" />
            </div>
          </div>
        )}
        className="retry-campaign-modal"
        content={content}
        visible={shown}
      />
    );
  }
}

export default RetryModal;
