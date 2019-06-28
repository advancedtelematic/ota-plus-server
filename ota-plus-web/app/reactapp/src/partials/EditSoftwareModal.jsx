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

@inject('stores')
@observer
class EditSoftwareModal extends Component {
  @observable submitButtonDisabled = true;

  constructor(props) {
    super(props);
    const { stores } = this.props;
    const { softwareStore } = stores;
    this.renameHandler = new AsyncStatusCallbackHandler(
      softwareStore,
      'campaignsRenameAsync',
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
    const { stores } = this.props;
    const { softwareStore, campaignsStore } = stores;
    const { campaign } = campaignsStore;
    const formData = serialize(document.querySelector('#edit-name-form'), { hash: true });
    softwareStore.renameCampaign(campaign.id, { name: formData.campaignName });
  }

  handleRenameResponse() {
    const { hide } = this.props;
    hide();
  }

  render() {
    const { shown, hide, modalTitle, defaultValue, stores } = this.props;
    const { softwareStore } = stores;
    const form = (
      <OTAForm onSubmit={() => this.submitForm()} id="edit-name-form">
        <AsyncResponse
          handledStatus="error"
          action={softwareStore.campaignsRenameAsync}
          errorMsg={
            softwareStore.campaignsRenameAsync.data ? softwareStore.campaignsRenameAsync.data.description : null
          }
        />
        <div className="row">
          <div className="col-xs-12">
            <FormInput
              onValid={() => this.enableButton()}
              onInvalid={() => this.disableButton()}
              name="campaignName"
              className="input-wrapper"
              isEditable={!softwareStore.campaignsRenameAsync.isFetching}
              title="Campaign name"
              label="Campaign name"
              placeholder="Name"
              id="campaign-name"
              defaultValue={defaultValue}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <div className="body-actions">
              <button
                type="button"
                disabled={this.submitButtonDisabled || softwareStore.campaignsRenameAsync.isFetching}
                className="btn-primary"
                id="add"
              >
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
        topActions={(
          <div className="top-actions flex-end">
            <div className="modal-close" id="close-modal" onClick={hide}>
              <img src="/assets/img/icons/close.svg" alt="Icon" />
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

EditSoftwareModal.propTypes = {
  stores: PropTypes.shape({}),
  shown: PropTypes.bool,
  hide: PropTypes.func,
  modalTitle: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string
  ]),
  defaultValue: PropTypes.string,
};

export default EditSoftwareModal;
