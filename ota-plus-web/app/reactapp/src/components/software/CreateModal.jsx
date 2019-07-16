/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Form, Input } from 'formsy-antd';
import { Row, Col, Button, Input as TextInput } from 'antd';
import serialize from 'form-serialize';
import _ from 'lodash';
import { withTranslation } from 'react-i18next';
import { OTAModal, Loader, FormSelect } from '../../partials';

@inject('stores')
@observer
class CreateModal extends Component {
  @observable softwareName = '';

  @observable softwareVersion = '';

  @observable fileName = null;

  @observable selectedHardwareIds = [];

  constructor(props) {
    super(props);
    this.fileUploadRef = React.createRef();
  }

  componentDidMount() {
    const { stores } = this.props;
    const { hardwareStore } = stores;
    hardwareStore.fetchHardwareIds();
  }

  /* ToDo: investigate and improve submit function */
  submitForm = () => {
    const { stores, fileDropped } = this.props;
    const { softwareStore } = stores;
    const formData = new FormData();

    if (fileDropped) {
      formData.append('file', fileDropped);
    } else {
      formData.append('file', this.fileUploadRef.current.files[0]);
    }

    const data = serialize(document.querySelector('#software-create-form'), { hash: true });
    delete data['fake-file'];
    data.description = data.description ? data.description : '';
    data.vendor = data.vendor ? data.vendor : '';
    softwareStore.createPackage(data, formData, this.selectedHardwareIds.join());
    this.hideModal();
  };

  onFileUploadClick = (e) => {
    if (e) e.preventDefault();
    const fileUploadDom = this.fileUploadRef.current;
    fileUploadDom.click();
  };

  onFileChange = (e) => {
    /* toDo: split based of `\` only affects windows paths */
    const name = e.target.value.split('\\').pop();
    this.fileName = name;
  };

  hideModal = (e) => {
    const { hide } = this.props;
    if (e) e.preventDefault();
    this.fileName = null;
    this.selectedHardwareIds = [];
    hide();
  };

  selectHardwareIds = (selectedOptions) => {
    this.selectedHardwareIds = selectedOptions;
  };

  onInputChange = value => (event) => {
    this[value] = event.target.value;
  };

  render() {
    const { stores, shown, hide, fileDropped, t } = this.props;
    const { hardwareStore } = stores;
    const isSubmitEnabled = this.softwareName
                            && this.softwareVersion
                            && this.selectedHardwareIds.length
                            && this.fileName;
    const directorForm = (
      <Form onValidSubmit={this.submitForm} id="software-create-form">
        <Row className="gutter-bottom">
          {t('software.create_modal.intro_1')}
          <a
            href="https://docs.ota.here.com/quickstarts/pushing-updates.html"
            rel="noopener noreferrer"
            target="_blank"
          >
            {t('software.create_modal.intro_link')}
          </a>
          {t('software.create_modal.intro_2')}
        </Row>
        <Row className="row">
          <Col span={12}>
            <label className="c-form__label">
              {t('software.create_modal.software_name')}
            </label>
            <TextInput
              id="add-new-software-name"
              className="c-form__input c-form__input--antd"
              placeholder={t('software.create_modal.software_name_placeholder')}
              name="packageName"
              onChange={this.onInputChange('softwareName')}
            />
          </Col>
          <Col span={12}>
            <label className="c-form__label">
              {t('software.create_modal.version')}
            </label>
            <TextInput
              id="add-new-software-version"
              className="c-form__input c-form__input--antd"
              placeholder={t('software.create_modal.version_placeholder')}
              name="version"
              onChange={this.onInputChange('softwareVersion')}
            />
          </Col>
        </Row>
        <Row className="row">
          <Col span={12}>
            <div className="ecu-types-select">
              {hardwareStore.hardwareIdsFetchAsync.isFetching ? (
                <Loader />
              ) : (
                <FormSelect
                  multiple
                  appendMenuToBodyTag
                  label={t('software.create_modal.ecu_types')}
                  id="ecu-types-select"
                  placeholder={t('software.create_modal.ecu_types_placeholder')}
                  onChange={this.selectHardwareIds}
                  visibleFieldsCount={4}
                  defaultValue={_.isArray(this.selectedHardwareIds) ? this.selectedHardwareIds : null}
                  options={hardwareStore.hardwareIds}
                />
              )}
            </div>
          </Col>
        </Row>
        <Row className="row">
          <Col span={12}>
            <div className="upload-wrapper">
              {!fileDropped && (
                <Button
                  htmlType="button"
                  className="add-button"
                  onClick={this.onFileUploadClick}
                  id="choose-software"
                >
                  <span>{t('software.create_modal.choose_file')}</span>
                </Button>
              )}
              <div className="file-name">{(fileDropped && fileDropped.name) || this.fileName}</div>
              <input
                ref={this.fileUploadRef}
                name="file"
                type="file"
                onChange={this.onFileChange.bind(this)}
                className="file"
                id="file-input-hidden"
              />
              {<Input
                type="text"
                name="fake-file"
                value={(fileDropped && fileDropped.name) || this.fileName}
                style={{ display: 'none' }}
                required
              />}
            </div>
          </Col>
        </Row>
        <Row className="row">
          <Col span={24}>
            <div className="body-actions">
              <button
                type="submit"
                className="btn-primary"
                disabled={!isSubmitEnabled}
                id="add-new-package-confirm"
              >
                {t('software.create_modal.add')}
              </button>
            </div>
          </Col>
        </Row>
      </Form>
    );
    return (
      <OTAModal
        title={t('software.create_modal.title')}
        topActions={(
          <div className="top-actions flex-end">
            <div className="modal-close" onClick={hide}>
              <img src="/assets/img/icons/close.svg" alt="Icon" />
            </div>
          </div>
        )}
        content={directorForm}
        visible={shown}
        className="add-software-modal"
      />
    );
  }
}

CreateModal.propTypes = {
  shown: PropTypes.bool.isRequired,
  hide: PropTypes.func.isRequired,
  stores: PropTypes.shape({}),
  fileDropped: PropTypes.shape({}),
  t: PropTypes.func.isRequired
};

export default withTranslation()(CreateModal);
