/** @format */

import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import Modal from './Modal';
import AsyncResponse from './AsyncResponse';
import { Form } from './Form';
import FormInput from './FormInput';
import serialize from 'form-serialize';
import { AsyncStatusCallbackHandler } from '../utils';
import _ from 'underscore';

@inject('stores')
@observer
class EditPackageModal extends Component {
  @observable submitButtonDisabled = true;

  constructor(props) {
    super(props);
    const { packagesStore } = props.stores;
    this.renameHandler = new AsyncStatusCallbackHandler(packagesStore, 'campaignsRenameAsync', this.handleRenameResponse.bind(this));
  }
  enableButton() {
    this.submitButtonDisabled = false;
  }
  disableButton() {
    this.submitButtonDisabled = true;
  }
  submitForm(e) {
    if (e) e.preventDefault();
    const { packagesStore, campaignsStore } = this.props.stores;
    const { campaign } = campaignsStore;
    const formData = serialize(document.querySelector('#edit-name-form'), { hash: true });
    packagesStore.renameCampaign(campaign.id, { name: formData.campaignName });
  }
  handleRenameResponse() {
    this.props.hide();
  }
  render() {
    const { shown, hide, modalTitle, defaultValue } = this.props;
    const { packagesStore } = this.props.stores;
    const form = (
      <Form onSubmit={this.submitForm.bind(this)} id='edit-name-form'>
        <AsyncResponse
          handledStatus='error'
          action={packagesStore.campaignsRenameAsync}
          errorMsg={packagesStore.campaignsRenameAsync.data ? packagesStore.campaignsRenameAsync.data.description : null}
        />
        <div className='row'>
          <div className='col-xs-12'>
            <FormInput
              onValid={this.enableButton.bind(this)}
              onInvalid={this.disableButton.bind(this)}
              name='campaignName'
              className='input-wrapper'
              isEditable={!packagesStore.campaignsRenameAsync.isFetching}
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
              <button disabled={this.submitButtonDisabled || packagesStore.campaignsRenameAsync.isFetching} className='btn-primary' id='add'>
                Edit
              </button>
            </div>
          </div>
        </div>
      </Form>
    );
    return (
      <Modal
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
        shown={shown}
      />
    );
  }
}

export default EditPackageModal;
