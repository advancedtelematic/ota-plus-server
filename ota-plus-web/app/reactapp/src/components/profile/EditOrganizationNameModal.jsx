/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';

import { Button } from 'antd';
import OTAModal from '../../partials/OTAModal';
import OTAForm from '../../partials/OTAForm';
import FormInput from '../../partials/FormInput';

import AsyncResponse from '../../partials/AsyncResponse';

import { assets } from '../../config';

@inject('stores')
@observer
class EditOrganizationNameModal extends Component {
  @observable submitButtonDisabled = true;

  static propTypes = {
    stores: PropTypes.shape({ userStore: PropTypes.shape({}) }).isRequired,
    shown: PropTypes.bool.isRequired,
    hide: PropTypes.func.isRequired,
    modalTitle: PropTypes.shape({}).isRequired,
    organization: PropTypes.shape({
      name: PropTypes.string.isRequired,
      namespace: PropTypes.string.isRequired
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      newOrganizationName: undefined
    };
  }

  enableButton = () => {
    this.submitButtonDisabled = false;
  };

  disableButton = () => {
    this.submitButtonDisabled = true;
  };

  onChange = (event) => {
    if (event) {
      event.preventDefault();
    }
    this.setState({ newOrganizationName: event.target.value });
  };

  submitForm = (event) => {
    const { newOrganizationName } = this.state;
    const { stores, hide } = this.props;
    const { userStore } = stores;
    if (event) {
      event.preventDefault();
    }
    userStore.editOrganizationName(newOrganizationName);
    hide();
  };

  render() {
    const { stores, shown, hide, modalTitle, organization } = this.props;
    const { userStore } = stores;
    const form = (
      <OTAForm onSubmit={this.submitForm} id="edit-name-form">
        <AsyncResponse
          handledStatus="error"
          action={userStore.editOrganizationNameAsync}
          errorMsg={userStore.editOrganizationNameAsync.data && userStore.editOrganizationNameAsync.data.description}
        />
        <div>
          <div className="col-xs-12">
            <FormInput
              onValid={this.enableButton}
              onInvalid={this.disableButton}
              name="organizationName"
              className="input-wrapper"
              isEditable={!userStore.editOrganizationNameAsync.isFetching}
              title="Organization name"
              label="Organization name"
              placeholder="Name"
              id="organization-edit-name-input"
              defaultValue={organization.name}
              onChange={this.onChange}
            />
          </div>
        </div>
        <div>
          <div className="col-xs-12">
            <div className="body-actions">
              <Button
                htmlType="submit"
                disabled={this.submitButtonDisabled || userStore.editOrganizationNameAsync.isFetching}
                className="btn-primary"
                id="organization-edit-name-button"
              >
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
        topActions={(
          <div className="top-actions flex-end">
            <div className="modal-close" id="close-modal" onClick={hide}>
              <img src={assets.DEFAULT_CLOSE_ICON} alt="close" />
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

export default EditOrganizationNameModal;
