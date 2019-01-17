/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Button } from 'antd';
import _ from 'lodash';
import { inject } from 'mobx-react';
import { OTAModal } from '../../partials';

@inject('stores')
class CancelAllUploadsModal extends Component {
  static propTypes = {
    stores: PropTypes.object,
    shown: PropTypes.bool.isRequired,
    hide: PropTypes.func.isRequired,
    ifClearUploads: PropTypes.bool.isRequired,
  };

  cancelAllUploads = () => {
    const { stores, ifClearUploads, hide } = this.props;
    const { packagesStore } = stores;
    _.each(
      packagesStore.packagesUploading,
      upload => {
        upload.source.cancel();
      },
      this,
    );
    if (ifClearUploads) packagesStore.packagesUploading = [];
    hide();
  };

  render() {
    const { shown, hide } = this.props;
    const content = (
      <span>
        Your uploads are not complete. Would you like to cancel all ongoing uploads?
        <div className='body-actions'>
          <a onClick={hide} className='link-cancel'>
            Continue uploads
          </a>
          <a className='btn-primary' id='cancel-all-uploads' onClick={this.cancelAllUploads}>
            Cancel uploads
          </a>
        </div>
      </span>
    );
    return (
      <OTAModal
        title='Cancel all uploads?'
        topActions={
          <div className='top-actions flex-end'>
            <div className='modal-close' onClick={hide}>
              <img src='/assets/img/icons/close.svg' alt='Icon'/>
            </div>
          </div>
        }
        content={content}
        visible={shown}
        className='cancel-upload-modal'
      />
    );
  }
}

export default CancelAllUploadsModal;
