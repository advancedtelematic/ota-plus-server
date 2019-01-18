/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';

import { Button } from 'antd';
import { OTAModal } from '../../../partials';

const staticTextContent = (
  <div className='text-left'>
    <p>
      In many connected mobility domains, most notably in automotive, it is common to have a device, vehicle, or platform that has multiple independent micro-controllers or other devices networked
      together. HERE OTA Connect is built to handle updates to those other micro-controllers even if they don't have an internet connection, or are too resource-constrained to run a full updater
      client themselves. The device that has a direct internet connection – the one running the HERE OTA Connect client – is called the "Primary ECU", and is able to distribute firmware updates to
      secondary ECUs.{' '}
    </p>
    <p>
      The term <strong>ECU</strong> comes from automotive, and stands for <strong>Electronic Control Unit.</strong>
    </p>
    <p>If you don't have multiple devices to update from one primary/master device, you don't need to worry about this functionality.</p>
  </div>
);
@observer
class SecondaryEcuDetails extends Component {
  static propTypes = {
    hideDetails: PropTypes.func.isRequired,
    shown: PropTypes.bool,
  };

  render() {
    const { hideDetails, shown } = this.props;
    const content = (
      <span>
        {staticTextContent}
        <div className='body-actions'>
          <Button htmlType='button' className='btn-primary' onClick={hideDetails}>
            Got it
          </Button>
        </div>
      </span>
    );

    return (
      <OTAModal
        title='Secondary ECUs'
        topActions={
          <div className='top-actions flex-end'>
            <div className='modal-close' onClick={hideDetails}>
              <img src='/assets/img/icons/close.svg' alt='Icon' />
            </div>
          </div>
        }
        content={content}
        visible={shown}
        className='secondary-ecu-details-modal'
        hideOnClickOutside
        onRequestClose={hideDetails}
      />
    );
  }
}

export default SecondaryEcuDetails;
