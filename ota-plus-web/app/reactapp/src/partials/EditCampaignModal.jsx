/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import serialize from 'form-serialize';

import { Button } from 'antd';
import OTAModal from './OTAModal';
import { OTAForm } from './OTAForm';
import FormInput from './FormInput';

import AsyncResponse from './AsyncResponse';
import { AsyncStatusCallbackHandler } from '../utils';

import { assets } from '../config';

@inject('stores')
@observer
class EditCampaignModal extends Component {
  @observable submitButtonDisabled = true;

  static propTypes = {
    stores: PropTypes.object,
    shown: PropTypes.bool,
    hide: PropTypes.func,
    modalTitle: PropTypes.any,
    defaultValue: PropTypes.string,
  };

  enableButton = () => {
    this.submitButtonDisabled = false;
  };

  disableButton = () => {
    this.submitButtonDisabled = true;
  };

  submitForm = e => {
    const { stores, hide } = this.props;
    const { campaignsStore } = stores;
    const { campaign } = campaignsStore;
    const formData = serialize(document.querySelector('#edit-name-form'), { hash: true });
    if (e) e.preventDefault();
    campaignsStore.renameCampaign(campaign.id, { name: formData.campaignName });

    hide();
  };

  render() {
    const { stores, shown, hide, modalTitle, defaultValue } = this.props;
    const { campaignsStore } = stores;
    const form = (
      <OTAForm onSubmit={this.submitForm} id='edit-name-form'>
        <AsyncResponse
          handledStatus='error'
          action={campaignsStore.campaignsRenameAsync}
          errorMsg={campaignsStore.campaignsRenameAsync.data && campaignsStore.campaignsRenameAsync.data.description}
        />
        <div className='row'>
          <div className='col-xs-12'>
            <FormInput
              onValid={this.enableButton}
              onInvalid={this.disableButton}
              name='campaignName'
              className='input-wrapper'
              isEditable={!campaignsStore.campaignsRenameAsync.isFetching}
              title="Campaign name"
              label="Campaign name"
              placeholder="Name"
              id='campaign-name'
              defaultValue={defaultValue}
            />
          </div>
        </div>
        <div className='row'>
          <div className='col-xs-12'>
            <div className='body-actions'>
              <Button htmlType='submit' disabled={this.submitButtonDisabled || campaignsStore.campaignsRenameAsync.isFetching} className='btn-primary' id='add'>
                Edit
              </Button>
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
              <img src={assets.DEFAULT_CLOSE_ICON} alt='close' />
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

export default EditCampaignModal;
