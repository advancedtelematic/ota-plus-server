/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import moment from 'moment';

import { Form } from 'formsy-antd';
import { Row, Col, DatePicker } from 'antd';
import { AsyncStatusCallbackHandler } from '../../../utils';
import { Button, OTAModal, AsyncResponse, FormInput } from '../../../partials';
import { assets, MAX_REGISTRATION_CREDENTIALS_TTL } from '../../../config';

@inject('stores')
@observer
class CreateModal extends Component {
  static propTypes = {
    stores: PropTypes.shape({}),
    shown: PropTypes.bool.isRequired,
    hide: PropTypes.func.isRequired,
  };

  @observable
  submitButtonDisabled = true;

  @observable
  untilTime = moment().add(1, 'year');

  @observable
  description = '';

  constructor(props) {
    super(props);
    const { stores } = this.props;
    const { provisioningStore } = stores;
    this.createHandler = new AsyncStatusCallbackHandler(provisioningStore, 'provisioningKeyCreateAsync', props.hide);
  }

  componentWillUnmount() {
    this.createHandler();
  }

  disableButton = () => {
    this.submitButtonDisabled = true;
  };

  enableButton = () => {
    this.submitButtonDisabled = false;
  };

  submitForm = () => {
    const data = {
      description: this.description,
      until: moment(this.untilTime).format('YYYY-MM-DD'),
    };
    const { stores } = this.props;
    const { provisioningStore } = stores;
    provisioningStore.createProvisioningKey(data);
  };

  disabledDate = current => current
    && (current < moment().endOf('day').add(1, 'minutes')
      || current > moment().add(MAX_REGISTRATION_CREDENTIALS_TTL, 'hours'));

  handleDateChange = (value) => {
    this.untilTime = value;
  };

  handleDescriptionChange = (e) => {
    this.description = e.target.value;
  };

  render() {
    const { stores, shown, hide } = this.props;
    const { provisioningStore } = stores;
    const { provisioningKeyCreateAsync } = provisioningStore;
    const form = (
      <Form onValidSubmit={this.submitForm} id="provisioning-key-create-form">
        <AsyncResponse
          handledStatus="error"
          action={provisioningKeyCreateAsync}
          errorMsg={provisioningKeyCreateAsync.data && provisioningKeyCreateAsync.data.description}
        />
        <Row className="row">
          <Col span={24}>
            <FormInput
              onValid={this.enableButton}
              onInvalid={this.disableButton}
              onChange={this.handleDescriptionChange}
              name="description"
              className="input-wrapper"
              isEditable={!provisioningKeyCreateAsync.isFetching}
              title="Description"
              label="Description"
              placeholder="Description"
              id="add-new-key-description"
            />
          </Col>
        </Row>
        <Row className="row">
          <Col span={24}>
            <label title="Valid until" htmlFor="add-new-key-valid-until" className="c-form__label">
              {'Valid until'}
            </label>
            <DatePicker
              className="input-wrapper date-wrapper"
              name="until"
              defaultValue={this.untilTime}
              onChange={this.handleDateChange}
              format="YYYY-MM-DD"
              showToday={false}
              id="add-new-key-valid-until"
              disabled={provisioningKeyCreateAsync.isFetching}
              disabledDate={this.disabledDate}
              allowClear={false}
            />
          </Col>
        </Row>
        <div className="body-actions">
          <Button
            type="primary"
            light="true"
            htmlType="submit"
            disabled={this.submitButtonDisabled || provisioningKeyCreateAsync.isFetching}
            id="add-new-key-confirm"
          >
            Add key
          </Button>
        </div>
      </Form>
    );
    return (
      <OTAModal
        title="Add new key"
        topActions={(
          <div className="top-actions flex-end">
            <div className="modal-close" onClick={hide}>
              <img src={assets.DEFAULT_CLOSE_ICON} alt="Icon" />
            </div>
          </div>
        )}
        className="create-provisioning-key-modal"
        content={form}
        visible={shown}
      />
    );
  }
}

export default CreateModal;
