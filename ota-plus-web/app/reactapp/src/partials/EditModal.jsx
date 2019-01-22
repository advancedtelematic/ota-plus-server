/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import OTAModal from './OTAModal';
import AsyncResponse from './AsyncResponse';
import { OTAForm } from './OTAForm';
import FormInput from './FormInput';
import serialize from 'form-serialize';
import { AsyncStatusCallbackHandler } from '../utils';

@inject('stores')
@observer
class EditModal extends Component {
  @observable submitButtonDisabled = true;

  constructor(props) {
    super(props);
    const { devicesStore } = props.stores;
    this.renameHandler = new AsyncStatusCallbackHandler(devicesStore, 'devicesRenameAsync', this.handleRenameResponse.bind(this));
  }
  enableButton() {
    this.submitButtonDisabled = false;
  }
  disableButton() {
    this.submitButtonDisabled = true;
  }
  submitForm(e) {
    if (e) e.preventDefault();
    const { devicesStore } = this.props.stores;
    const formData = serialize(document.querySelector('#edit-name-form'), { hash: true });
    devicesStore.renameDevice(this.props.device.uuid, {
      deviceName: formData.deviceName,
      deviceType: 'Other',
    });
  }
  handleRenameResponse() {
    this.props.hide();
  }
  render() {
    const { shown, hide, modalTitle, device } = this.props;
    const { devicesStore } = this.props.stores;
    const form = (
      <OTAForm onSubmit={this.submitForm.bind(this)} id='edit-name-form'>
        <AsyncResponse
          handledStatus='error'
          id='edit-device-name__alert'
          action={devicesStore.devicesRenameAsync}
          errorMsg={devicesStore.devicesRenameAsync.data ? devicesStore.devicesRenameAsync.data.description : null}
        />
        <div className='row'>
          <div className='col-xs-12'>
            <FormInput
              onValid={this.enableButton.bind(this)}
              onInvalid={this.disableButton.bind(this)}
              name='deviceName'
              className='input-wrapper'
              isEditable={!devicesStore.devicesRenameAsync.isFetching}
              title={'Device name'}
              label={'Device name'}
              placeholder={'Name'}
              id='device-name'
              defaultValue={device.deviceName}
            />
          </div>
        </div>
        <div className='row'>
          <div className='col-xs-12'>
            <div className='body-actions'>
              <button disabled={this.submitButtonDisabled || devicesStore.devicesRenameAsync.isFetching} className='btn-primary' id='add'>
                Edit
              </button>
            </div>
          </div>
        </div>
      </OTAForm>
    );
    return (
      <OTAModal
        title={modalTitle}
        topActions={
          <div className='top-actions flex-end'>
            <div className='modal-close' id='close-modal' onClick={hide}>
              <img src='/assets/img/icons/close.svg' alt='Icon' />
            </div>
          </div>
        }
        className='edit-name-modal'
        content={form}
        visible={shown}
      />
    );
  }
}

export default EditModal;
