/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import moment from 'moment';

import { Form } from 'formsy-antd';
import { Row, Col, DatePicker } from 'antd';
import { AsyncStatusCallbackHandler } from '../../../utils';
import { OTAModal, AsyncResponse, FormInput, } from '../../../partials';

@inject('stores')
@observer
class CreateModal extends Component {
  static propTypes = {
    stores: PropTypes.object,
    shown: PropTypes.bool.isRequired,
    hide: PropTypes.func.isRequired,
  };
  
  @observable
  submitButtonDisabled = true;
  @observable
  untilTime = moment().add(1, 'year');
  @observable
  description = '';
  
  disableButton = () => {
    this.submitButtonDisabled = true;
  };
  
  enableButton = () => {
    this.submitButtonDisabled = false;
  };
  
  submitForm = () => {
    let data = {
      description: this.description,
      until: moment(this.untilTime).format('YYYY-MM-DD'),
    };
    const { stores } = this.props;
    const { provisioningStore } = stores;
    provisioningStore.createProvisioningKey(data);
  };
  
  disabledDate = (current) => {
    return current && current < moment().endOf('day');
  };
  
  handleDateChange = (value) => {
    this.untilTime = value;
  };
  
  handleDescriptionChange = (e) => {
    console.log(e.target.value);
    this.description = e.target.value;
  };
  
  constructor(props) {
    super(props);
    const { stores } = this.props;
    const { provisioningStore } = stores;
    this.createHandler = new AsyncStatusCallbackHandler(provisioningStore, 'provisioningKeyCreateAsync', props.hide);
  }

  componentWillUnmount() {
    this.createHandler();
  }

  render() {
    const { stores, shown, hide } = this.props;
    const { provisioningStore } = stores;
    const { provisioningKeyCreateAsync } = provisioningStore;
    const form = (
      <Form onValidSubmit={this.submitForm} id="provisioning-key-create-form">
        <AsyncResponse handledStatus="error" action={provisioningKeyCreateAsync}
                       errorMsg={provisioningKeyCreateAsync.data && provisioningKeyCreateAsync.data.description}/>
        <Row className={'row'}>
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
        <Row className={'row'}>
          <Col span={24}>
            <label title={'Valid until'} htmlFor={'add-new-key-valid-until'} className='c-form__label'>
              {'Valid until'}
            </label>
            <DatePicker
              className="input-wrapper date-wrapper"
              name="until"
              defaultValue={this.untilTime}
              onChange={this.handleDateChange}
              format={'YYYY-MM-DD'}
              showToday={false}
              id="add-new-key-valid-until"
              disabled={provisioningKeyCreateAsync.isFetching}
              disabledDate={this.disabledDate}
              allowClear={false}
            />
          </Col>
        </Row>
        <div className="body-actions">
          <button disabled={this.submitButtonDisabled || provisioningKeyCreateAsync.isFetching} className="btn-primary"
                  id="add-new-key-confirm﻿">
            Add key
          </button>
        </div>
      </Form>
    );
    return (
      <OTAModal
        title="Add new key"
        topActions={
          <div className="top-actions flex-end">
            <div className="modal-close" onClick={hide}>
              <img src="/assets/img/icons/close.svg" alt="Icon"/>
            </div>
          </div>
        }
        className="create-provisioning-key-modal"
        content={form}
        visible={shown}
      />
    );
  }
}

export default CreateModal;
