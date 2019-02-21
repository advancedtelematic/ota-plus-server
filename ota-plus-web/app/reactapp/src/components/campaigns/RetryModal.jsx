/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

import { Form } from 'formsy-antd';
import { Row, Col, DatePicker, Button } from 'antd';
import { OTAModal } from '../../partials';

@observer
class RetryModal extends Component {
  static propTypes = {
    stores: PropTypes.object,
    shown: PropTypes.bool.isRequired,
    hide: PropTypes.func.isRequired,
  };

  @observable
  submitButtonDisabled = true;

  disableButton = () => {
    this.submitButtonDisabled = true;
  };

  enableButton = () => {
    this.submitButtonDisabled = false;
  };

  render() {
    const { shown, hide, failureforRetry } = this.props;
    const content = (
      <div>
        <div className='list-header'>
          For this campaign, retry all installations that failed due to the following error: <b>{failureforRetry}</b>
        </div>
        <ol>
          <li>OTA Connect retries installation on each devices once only.</li>
          <li>After this retry cycle is completed, you'll see fresh failure statistics for all installation attempts in this retry cycle.</li>
          <li>You cannot start a retry cycle for another error type before this retry cycle is finished.</li>
          <li> If a device is installing another update, this retry cycle will not apply to the device.</li>
        </ol>
        <div className='list-header'>If some installations still fail...</div>
        <ol>
          <li>You'll need to diagnose what's going wrong and possibly update your software.</li>
          <li>You can export the list of devices with failed installations to help with your analysis.</li>
          <li>Once you've figured it out, create another update and deploy it in another campaign.</li>
        </ol>
        <div className='body-actions'>
          <button disabled={this.submitButtonDisabled} className='btn-primary' id='add-new-key-confirm'>
            Confirm
          </button>
        </div>
      </div>
    );
    return (
      <OTAModal
        title='Confirm Retry'
        topActions={
          <div className='top-actions flex-end'>
            <div className='modal-close' onClick={hide}>
              <img src='/assets/img/icons/close.svg' alt='Icon' />
            </div>
          </div>
        }
        className='retry-campaign-modal'
        content={content}
        visible={shown}
      />
    );
  }
}

export default RetryModal;
