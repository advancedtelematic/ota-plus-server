/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import OTAModal from './OTAModal';
import { assets } from '../config';

class ConfirmationModal extends Component {
  continue = () => {
    const { deleteItem } = this.props;
    deleteItem();
  };

  render() {
    const { shown, hide, topText, bottomText, modalTitle, showDetailedInfo } = this.props;
    const content = (
      <span>
        <div className="text-left">
          {topText}
          {showDetailedInfo ? (
            <span>
              <div className="important-info" id="confirmation-modal-important-info">
                This action cannot be undone.
              </div>
              {bottomText}
            </span>
          ) : null}
        </div>
        <div className="body-actions">
          <button
            type="button"
            className="btn-primary"
            onClick={this.continue}
            id="confirmation-modal-continue"
          >
            Continue
          </button>
        </div>
      </span>
    );

    return (
      <OTAModal
        title={modalTitle}
        topActions={(
          <div className="top-actions flex-end" id="confirmation-modal-top-actions">
            <div className="modal-close" onClick={hide} id="confirmation-modal-close">
              <img src={assets.DEFAULT_CLOSE_ICON} alt="Icon" />
            </div>
          </div>
)}
        content={content}
        visible={shown}
        className="secondary-ecu-details-modal"
        hideOnClickOutside
        onRequestClose={hide}
      />
    );
  }
}

ConfirmationModal.propTypes = {
  shown: PropTypes.bool,
  hide: PropTypes.func,
  topText: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string
  ]),
  bottomText: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string
  ]),
  modalTitle: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string
  ]),
  showDetailedInfo: PropTypes.bool,
  deleteItem: PropTypes.func
};

export default ConfirmationModal;
