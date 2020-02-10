/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Button, Progress } from 'antd';
import { withTranslation } from 'react-i18next';
import _ from 'lodash';
import OperationCompletedInfo from './OperationCompletedInfo';

import SoftwareCancelUploadModal from '../components/software/CancelUploadModal';
import SoftwareCancelAllUploadsModal from '../components/software/CancelAllUploadsModal';
import { ConvertBytes } from '../utils';
import OTAModal from './OTAModal';
import { assets } from '../config';

@inject('stores')
@observer
class UploadBox extends Component {
  @observable cancelUploadModalShown = false;

  @observable cancelAllUploadsModalShown = false;

  @observable actionUploadIndex = null;

  @observable ifClearUploads = false;

  toggleMode = (e) => {
    if (e) e.preventDefault();
    const { toggleUploadBoxMode } = this.props;
    toggleUploadBoxMode();
  };

  removeFromList = (index, e) => {
    if (e) e.preventDefault();
    const { stores } = this.props;
    const { softwareStore } = stores;
    softwareStore.packagesUploading.splice(index, 1);
  };

  showCancelUploadModal = (index, e) => {
    if (e) e.preventDefault();
    this.cancelUploadModalShown = true;
    this.actionUploadIndex = index;
  };

  hideCancelUploadModal = (e) => {
    if (e) e.preventDefault();
    this.cancelUploadModalShown = false;
    this.actionUploadIndex = null;
  };

  showCancelAllUploadsModal = (ifClear = false, event) => {
    if (event) event.preventDefault();
    this.cancelAllUploadsModalShown = true;
    this.ifClearUploads = ifClear;
  };

  hideCancelAllUploadsModal = (e) => {
    if (e) e.preventDefault();
    this.cancelAllUploadsModalShown = false;
  };

  close = (e) => {
    if (e) e.preventDefault();
    const { stores } = this.props;
    const { softwareStore } = stores;
    let uploadFinished = true;
    _.each(softwareStore.packagesUploading, (upload) => {
      if (upload.status === null) uploadFinished = false;
    });
    if (uploadFinished) {
      softwareStore.packagesUploading = [];
    } else {
      this.showCancelAllUploadsModal(true, null);
    }
  };

  render() {
    const { t, minimized, toggleUploadBoxMode, stores } = this.props;
    const { softwareStore } = stores;
    let uploadFinished = true;
    let secondsRemaining = 0;
    _.each(softwareStore.packagesUploading, (upload) => {
      const uploadSpeed = !Number.isNaN(upload.upSpeed) ? upload.upSpeed : 100;
      let timeLeft = (upload.size - upload.uploaded) / (1024 * uploadSpeed);
      timeLeft = Number.isFinite(timeLeft) ? timeLeft : secondsRemaining;
      secondsRemaining = timeLeft > secondsRemaining ? timeLeft : secondsRemaining;
      if (upload.status === null) uploadFinished = false;
    });
    const uploadBoxData = (
      <div id="upload-box">
        <div className="info-container">
          <OperationCompletedInfo
            info={
              uploadFinished
                ? t('software.uploading.file_uploaded')
                : t(
                  'software.uploading.file_uploading',
                  { time_left: t('time.time_left', { time: secondsRemaining }) }
                )}
            initialHeight="auto"
            preserve
          />
        </div>
        <div className="button-container">
          <Button
            disabled={uploadFinished}
            htmlType="button"
            id="cancel-all-uploads"
            className="delete-button fixed-width right"
            onClick={(event) => { this.showCancelAllUploadsModal(false, event); }}
          >
            {t('software.create_modal.cancel_all')}
          </Button>
        </div>
        <div className="content">
          <ul className="list">
            {_.map(
              softwareStore.packagesUploading,
              (upload, index) => (
                <li key={index}>
                  <div className="col name" id="package-name">
                    {upload.package.name}
                  </div>
                  <div className="col version" id="package-version">
                    {upload.package.version}
                  </div>
                  <div className="col uploaded" id="uploaded-bytes">
                    <ConvertBytes bytes={upload.uploaded} />
                      &nbsp;of&nbsp;
                    <ConvertBytes bytes={upload.size} />
                  </div>

                  <div className="col status" id="upload-status">
                    {upload.progress !== 100 && upload.status === null ? (
                      <Progress
                        type="circle"
                        percent={upload.progress / 100}
                        showInfo={false}
                        width={24}
                        strokeWidth={20}
                        strokeColor="#A7DCD4"
                      />
                    ) : upload.status === 'success' ? (
                      <span id="success">
                        <img src="/assets/img/icons/green_tick.svg" alt="Icon" />
                        { t('software.uploading.success')}
                      </span>
                    ) : upload.status === 'error' ? (
                      <span id="error">
                        <i className="fa fa-exclamation-triangle" aria-hidden="true" />
                        {t('software.uploading.error')}
                      </span>
                    ) : (
                      <span id="processing">
                        <i className="fa fa-square-o fa-spin" />
                        {' '}
                        &nbsp;
                        <span className="counting black">Processing</span>
                      </span>
                    )}
                  </div>
                  <div className="col action">
                    {upload.status === null ? (
                      <a href="#" onClick={this.showCancelUploadModal.bind(this, index)} id="cancel-upload">
                        {t('software.uploading.cancel')}
                      </a>
                    ) : (
                      <a href="#" onClick={this.removeFromList.bind(this, index)} id="remove-from-list">
                        {t('software.uploading.remove_from_list')}
                      </a>
                    )}
                  </div>
                </li>
              ),
              this,
            )}
          </ul>
        </div>
        <SoftwareCancelUploadModal
          shown={this.cancelUploadModalShown}
          hide={this.hideCancelUploadModal}
          uploadIndex={this.actionUploadIndex}
          softwareStore={softwareStore}
        />
        <SoftwareCancelAllUploadsModal
          shown={this.cancelAllUploadsModalShown}
          hide={this.hideCancelAllUploadsModal}
          ifClearUploads={this.ifClearUploads}
          softwareStore={softwareStore}
        />
      </div>
    );
    const title = t('software.uploading.uploading_software', { count: softwareStore.packagesUploading.length });
    return (
      <OTAModal
        title={title}
        topActions={(
          <div className="top-actions flex-end">
            <div className="modal-minimize" onClick={this.toggleMode} id="minimize-upload-box">
              <img src="/assets/img/icons/minimize.svg" alt="Icon" />
            </div>
            <div className="modal-close" onClick={this.close} id="close-upload-box">
              <img src={assets.DEFAULT_CLOSE_ICON} alt="Icon" />
            </div>
          </div>
        )}
        content={uploadBoxData}
        visible={!!(softwareStore.packagesUploading.length && !minimized)}
        onRequestClose={toggleUploadBoxMode}
        className="upload-box"
      />
    );
  }
}

UploadBox.propTypes = {
  stores: PropTypes.shape({}),
  toggleUploadBoxMode: PropTypes.func,
  minimized: PropTypes.bool,
  t: PropTypes.func
};

export default withTranslation()(UploadBox);
