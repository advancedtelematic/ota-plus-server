/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { inject } from 'mobx-react';

import { Button } from 'antd';
import { OTAModal } from '../../partials';

@inject('stores')
class CancelUploadModal extends Component {
  static propTypes = {
    stores: PropTypes.object,
    shown: PropTypes.bool.isRequired,
    hide: PropTypes.func.isRequired,
    uploadIndex: PropTypes.number,
  };

  cancelUpload = () => {
    const { stores, uploadIndex, hide } = this.props;
    const { packagesStore } = stores;
    packagesStore.packagesUploading[uploadIndex].source.cancel();
    hide();
  };

  render() {
    const { shown, hide } = this.props;
    const content = (
      <span>
        Your upload is not complete. Would you like to cancel the upload?
        <div className='body-actions'>
          <a onClick={hide} className='link-cancel'>
            Continue upload
          </a>
          <a className='btn-primary' id='cancel-upload' onClick={this.cancelUpload}>
            Cancel upload
          </a>
        </div>
      </span>
    );
    return (
      <OTAModal
        title='Cancel upload?'
        topActions={
          <div className='top-actions flex-end'>
            <div className='modal-close' onClick={hide}>
              <img src='/assets/img/icons/close.svg' alt='Icon' />
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

export default CancelUploadModal;
