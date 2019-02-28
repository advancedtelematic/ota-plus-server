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
class EditSoftwareModal extends Component {
  @observable submitButtonDisabled = true;

  constructor(props) {
    super(props);
    const { softwareStore } = props.stores;
    this.renameHandler = new AsyncStatusCallbackHandler(softwareStore, 'campaignsRenameAsync', this.handleRenameResponse.bind(this));
  }
  enableButton() {
    this.submitButtonDisabled = false;
  }
  disableButton() {
    this.submitButtonDisabled = true;
  }
  submitForm(e) {
    if (e) e.preventDefault();
    const { softwareStore, campaignsStore } = this.props.stores;
    const { campaign } = campaignsStore;
    const formData = serialize(document.querySelector('#edit-name-form'), { hash: true });
    softwareStore.renameCampaign(campaign.id, { name: formData.campaignName });
  }
  handleRenameResponse() {
    this.props.hide();
  }
  render() {
    const { shown, hide, modalTitle, defaultValue } = this.props;
    const { softwareStore } = this.props.stores;
    const form = (
      <OTAForm onSubmit={this.submitForm.bind(this)} id='edit-name-form'>
        <AsyncResponse
          handledStatus='error'
          action={softwareStore.campaignsRenameAsync}
          errorMsg={softwareStore.campaignsRenameAsync.data ? softwareStore.campaignsRenameAsync.data.description : null}
        />
        <div className='row'>
          <div className='col-xs-12'>
            <FormInput
              onValid={this.enableButton.bind(this)}
              onInvalid={this.disableButton.bind(this)}
              name='campaignName'
              className='input-wrapper'
              isEditable={!softwareStore.campaignsRenameAsync.isFetching}
              title={'Campaign name'}
              label={'Campaign name'}
              placeholder={'Name'}
              id='campaign-name'
              defaultValue={defaultValue}
            />
          </div>
        </div>
        <div className='row'>
          <div className='col-xs-12'>
            <div className='body-actions'>
              <button disabled={this.submitButtonDisabled || softwareStore.campaignsRenameAsync.isFetching} className='btn-primary' id='add'>
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

export default EditSoftwareModal;