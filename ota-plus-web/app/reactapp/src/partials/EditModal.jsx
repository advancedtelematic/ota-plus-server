/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import serialize from 'form-serialize';
import OTAModal from './OTAModal';
import AsyncResponse from './AsyncResponse';
import OTAForm from './OTAForm';
import FormInput from './FormInput';
import { AsyncStatusCallbackHandler } from '../utils';
import { assets } from '../config';

@inject('stores')
@observer
class EditModal extends Component {
  @observable submitButtonDisabled = true;

  constructor(props) {
    super(props);
    const { stores } = props;
    const { devicesStore } = stores;
    this.renameHandler = new AsyncStatusCallbackHandler(
      devicesStore,
      'devicesRenameAsync',
      this.handleRenameResponse.bind(this)
    );
  }

  enableButton() {
    this.submitButtonDisabled = false;
  }

  disableButton() {
    this.submitButtonDisabled = true;
  }

  submitForm(e) {
    if (e) e.preventDefault();
    const { stores, device } = this.props;
    const { devicesStore } = stores;
    const formData = serialize(document.querySelector('#edit-name-form'), { hash: true });
    devicesStore.renameDevice(device.uuid, {
      deviceName: formData.deviceName,
      deviceType: 'Other',
    });
  }

  handleRenameResponse() {
    const { hide } = this.props;
    hide();
  }

  render() {
    const { shown, hide, modalTitle, device, stores } = this.props;
    const { devicesStore } = stores;
    const form = (
      <OTAForm id="edit-name-form">
        <AsyncResponse
          handledStatus="error"
          id="edit-device-name__alert"
          action={devicesStore.devicesRenameAsync}
          errorMsg={devicesStore.devicesRenameAsync.data ? devicesStore.devicesRenameAsync.data.description : null}
        />
        <div>
          <div className="col-xs-12">
            <FormInput
              onValid={() => this.enableButton()}
              onInvalid={() => this.disableButton()}
              name="deviceName"
              className="input-wrapper"
              isEditable={!devicesStore.devicesRenameAsync.isFetching}
              title="Device name"
              label="Device name"
              placeholder="Name"
              id="device-name"
              defaultValue={device.deviceName}
            />
          </div>
        </div>
        <div>
          <div className="col-xs-12">
            <div className="body-actions">
              <button
                type="button"
                onClick={() => this.submitForm()}
                disabled={this.submitButtonDisabled || devicesStore.devicesRenameAsync.isFetching}
                className="btn-primary"
                id="add"
              >
                {'Rename'}
              </button>
            </div>
          </div>
        </div>
      </OTAForm>
    );
    return (
      <OTAModal
        title={modalTitle}
        topActions={(
          <div className="top-actions flex-end">
            <div className="modal-close" id="close-modal" onClick={hide}>
              <img src={assets.DEFAULT_CLOSE_ICON} alt="Icon" />
            </div>
          </div>
        )}
        className="edit-name-modal"
        content={form}
        visible={shown}
      />
    );
  }
}

EditModal.propTypes = {
  stores: PropTypes.shape({}),
  shown: PropTypes.bool,
  hide: PropTypes.func,
  modalTitle: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string
  ]),
  device: PropTypes.shape({}),
};

export default EditModal;
