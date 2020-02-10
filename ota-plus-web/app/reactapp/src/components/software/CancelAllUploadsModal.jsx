/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import _ from 'lodash';
import { inject } from 'mobx-react';
import { withTranslation } from 'react-i18next';
import OTAModal from '../../partials/OTAModal';
import { assets } from '../../config';

@inject('stores')
class CancelAllUploadsModal extends Component {
  static propTypes = {
    stores: PropTypes.shape({}),
    shown: PropTypes.bool.isRequired,
    hide: PropTypes.func.isRequired,
    ifClearUploads: PropTypes.bool.isRequired,
    t: PropTypes.func.isRequired
  };

  cancelAllUploads = () => {
    const { stores, ifClearUploads, hide } = this.props;
    const { softwareStore } = stores;
    _.each(
      softwareStore.packagesUploading,
      (upload) => {
        upload.source.cancel();
      },
      this,
    );
    if (ifClearUploads) softwareStore.packagesUploading = [];
    hide();
  };

  render() {
    const { shown, hide, t } = this.props;
    const content = (
      <span>
        {t('software.cancel_upload.multiple.warning')}
        <div className="body-actions">
          <a onClick={hide} className="link-cancel">
            {t('software.cancel_upload.multiple.continue')}
          </a>
          <a className="btn-primary" id="cancel-all-uploads" onClick={this.cancelAllUploads}>
            {t('software.cancel_upload.multiple.cancel')}
          </a>
        </div>
      </span>
    );
    return (
      <OTAModal
        title={t('software.cancel_upload.multiple.title')}
        topActions={(
          <div className="top-actions flex-end">
            <div className="modal-close" onClick={hide}>
              <img src={assets.DEFAULT_CLOSE_ICON} alt="Icon" />
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

export default withTranslation()(CancelAllUploadsModal);
