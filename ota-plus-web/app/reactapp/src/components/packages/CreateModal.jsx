/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Form, Input } from 'formsy-antd';
import { Row, Col } from 'antd';
import serialize from 'form-serialize';
import _ from 'lodash';

import { Button } from 'antd';
import { OTAModal, Loader, FormSelect, FormInput } from '../../partials';

@inject('stores')
@observer
class CreateModal extends Component {
  @observable submitButtonDisabled = true;
  @observable fileName = null;
  @observable selectedHardwareIds = [];

  componentDidMount() {
    const { stores } = this.props;
    const { hardwareStore } = stores;
    hardwareStore.fetchHardwareIds();
  }

  enableButton = () => {
    this.submitButtonDisabled = false;
  };
  disableButton = () => {
    this.submitButtonDisabled = true;
  };

  /* ToDo: investigate and improve submit function */
  submitForm = () => {
    const { stores, fileDropped } = this.props;
    const { packagesStore } = stores;
    const formData = new FormData();

    if (fileDropped) {
      formData.append('file', fileDropped);
    } else {
      formData.append('file', this.refs.fileUpload.files[0]);
    }

    const data = serialize(document.querySelector('#package-create-form'), { hash: true });
    delete data['fake-file'];
    data.description = data.description ? data.description : '';
    data.vendor = data.vendor ? data.vendor : '';
    packagesStore.createPackage(data, formData, this.selectedHardwareIds.join());
    this.hideModal();
  };

  _onFileUploadClick = e => {
    if (e) e.preventDefault();
    const fileUploadDom = this.refs.fileUpload;
    fileUploadDom.click();
  };

  _onFileChange = e => {
    /* toDo: split based of `\` only affects windows paths */
    const name = e.target.value.split('\\').pop();
    this.fileName = name;
  };

  hideModal = e => {
    const { hide } = this.props;
    if (e) e.preventDefault();
    this.fileName = null;
    this.selectedHardwareIds = [];
    hide();
  };

  selectHardwareIds = selectedOptions => {
    this.selectedHardwareIds = selectedOptions;
  };

  render() {
    const { stores, shown, hide, fileDropped } = this.props;
    const { hardwareStore } = stores;
    const directorForm = (
      <Form onValid={this.enableButton} onInvalid={this.disableButton} onValidSubmit={this.submitForm} id='package-create-form'>
        <Row className='row'>
          <Col span={12}>
            <FormInput label='Package Name' placeholder='Name' name='packageName' onInvalid={this.disableButton} id='add-new-package-name' />
          </Col>
          <Col span={12}>
            <FormInput label='Version' name='version' id='add-new-package-version' onInvalid={this.disableButton} placeholder='Select version' />
          </Col>
        </Row>
        <Row className='row'>
          <Col span={12}>
            <div className='hardware-ids-select'>
              {hardwareStore.hardwareIdsFetchAsync.isFetching ? (
                <Loader />
              ) : (
                <FormSelect
                  multiple
                  appendMenuToBodyTag
                  label='Hardware ids'
                  id='hardware-ids-select'
                  placeholder='Select Hardware ids'
                  onChange={this.selectHardwareIds}
                  visibleFieldsCount={4}
                  defaultValue={_.isArray(this.selectedHardwareIds) ? this.selectedHardwareIds : null}
                  options={hardwareStore.hardwareIds}
                />
              )}
            </div>
          </Col>
        </Row>
        <Row className='row'>
          <Col span={12}>
            <div className='upload-wrapper'>
              {!fileDropped && (
                <Button htmlType='button' className='add-button' onClick={this._onFileUploadClick} id='choose-package'>
                  <span>Choose file</span>
                </Button>
              )}
              <div className='file-name'>{(fileDropped && fileDropped.name) || this.fileName}</div>
              <input ref='fileUpload' name='file' type='file' onChange={this._onFileChange.bind(this)} className='file' id='file-input-hidden' />
              {<Input type='text' name='fake-file' value={(fileDropped && fileDropped.name) || this.fileName} style={{ display: 'none' }} required />}
            </div>
          </Col>
        </Row>
        <Row className='row'>
          <Col span={24}>
            <div className='body-actions'>
              <button className='btn-primary' disabled={this.submitButtonDisabled || !this.selectedHardwareIds.length} id='add-new-package-confirm'>
                Add
              </button>
            </div>
          </Col>
        </Row>
      </Form>
    );
    return (
      <OTAModal
        title='Add new package'
        topActions={
          <div className='top-actions flex-end'>
            <div className='modal-close' onClick={hide}>
              <img src='/assets/img/icons/close.svg' alt='Icon' />
            </div>
          </div>
        }
        content={directorForm}
        visible={shown}
        className='add-package-modal'
      />
    );
  }
}

CreateModal.propTypes = {
  shown: PropTypes.bool.isRequired,
  hide: PropTypes.func.isRequired,
  stores: PropTypes.object,
  fileDropped: PropTypes.object,
};

export default CreateModal;
