/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { inject } from 'mobx-react';
import { withTranslation } from 'react-i18next';
import OTAModal from '../../partials/OTAModal';

@inject('stores')
class CancelUploadModal extends Component {
  static propTypes = {
    stores: PropTypes.shape({}),
    shown: PropTypes.bool.isRequired,
    hide: PropTypes.func.isRequired,
    uploadIndex: PropTypes.number,
    t: PropTypes.func.isRequired
  };

  cancelUpload = () => {
    const { stores, uploadIndex, hide } = this.props;
    const { softwareStore } = stores;
    softwareStore.packagesUploading[uploadIndex].source.cancel();
    hide();
  };

  render() {
    const { shown, hide, t } = this.props;
    const content = (
      <span>
        {t('software.cancel_upload.single.warning')}
        <div className="body-actions">
          <a onClick={hide} className="link-cancel">
            {t('software.cancel_upload.single.continue')}
          </a>
          <a className="btn-primary" id="cancel-upload" onClick={this.cancelUpload}>
            {t('software.cancel_upload.single.cancel')}
          </a>
        </div>
      </span>
    );
    return (
      <OTAModal
        title={t('software.cancel_upload.single.title')}
        topActions={(
          <div className="top-actions flex-end">
            <div className="modal-close" onClick={hide}>
              <img src="/assets/img/icons/close.svg" alt="Icon" />
            </div>
          </div>
        )}
        content={content}
        visible={shown}
        className="cancel-upload-modal"
      />
    );
  }
}

export default withTranslation()(CancelUploadModal);
