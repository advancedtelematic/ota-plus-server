/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import OTAModal from './OTAModal';

class ConfirmationModal extends Component {
  continue = () => {
    this.props.deleteItem();
  };

  render() {
    const { shown, hide, topText, bottomText, modalTitle, showDetailedInfo } = this.props;
    const content = (
      <span>
        <div className='text-left'>
          {topText}
          {showDetailedInfo ? (
            <span>
              <div className='important-info' id='confirmation-modal-important-info'>
                This action cannot be undone.
              </div>
              {bottomText}
            </span>
          ) : null}
        </div>
        <div className='body-actions'>
          <button className='btn-primary' onClick={this.continue} id='confirmation-modal-continue'>
            Continue
          </button>
        </div>
      </span>
    );

    return (
      <OTAModal
        title={modalTitle}
        topActions={
          <div className='top-actions flex-end' id='confirmation-modal-top-actions'>
            <div className='modal-close' onClick={hide} id='confirmation-modal-close'>
              <img src='/assets/img/icons/close.svg' alt='Icon' />
            </div>
          </div>
        }
        content={content}
        visible={shown}
        className='secondary-ecu-details-modal'
        hideOnClickOutside={true}
        onRequestClose={hide}
      />
    );
  }
}

export default ConfirmationModal;
