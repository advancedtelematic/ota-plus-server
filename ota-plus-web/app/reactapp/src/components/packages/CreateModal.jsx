import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Modal, AsyncResponse, Loader, FormSelect, FormInput } from '../../partials';
import { Form } from 'formsy-react';
import { FormsyText } from 'formsy-material-ui/lib';
import { FlatButton, SelectField, MenuItem } from 'material-ui';
import serialize from 'form-serialize';
import _ from 'underscore';

@inject("stores")
@observer
class CreateModal extends Component {
    @observable submitButtonDisabled = true;
    @observable fileName = null;
    @observable selectedHardwareIds = [];
    constructor(props) {
        super(props);
        this.selectHardwareIds = this.selectHardwareIds.bind(this);
    }
    componentWillMount() {
        const { hardwareStore } = this.props.stores;
        hardwareStore.fetchHardwareIds();
    }
    enableButton() {
        this.submitButtonDisabled = false;
    }
    disableButton() {
        this.submitButtonDisabled = true;
    }
    submitForm(type) {
        const { packagesStore } = this.props.stores;
        let formData = new FormData();
        if(this.props.fileDropped)
            formData.append('file', this.props.fileDropped);
        else
            formData.append('file', this.refs.fileUpload.files[0]);
        let data = serialize(document.querySelector('#package-create-form'), { hash: true });
        delete data['fake-file'];
        data.description = data.description ? data.description : "";
        data.vendor = data.vendor ? data.vendor : "";
        packagesStore.createPackage(data, formData, this.selectedHardwareIds.join());
        this.hideModal();
    }
    _onFileUploadClick(e) {
        e.preventDefault();
        var fileUploadDom = this.refs.fileUpload;
        fileUploadDom.click();
    }
    _onFileChange(e) {
        let name = e.target.value.split("\\").pop();
        this.fileName = name;
    }
    hideModal(e) {
        if(e) e.preventDefault();
        this.fileName = null;
        this.selectedHardwareIds = [];
        this.props.hide();
    }
    selectHardwareIds(selectedOptions) {
        this.selectedHardwareIds = selectedOptions;
    }
    render() {
        const { shown, hide, fileDropped } = this.props;
        const { hardwareStore } = this.props.stores;
        const directorForm = (
            <Form
                onValid={this.enableButton.bind(this)}
                onInvalid={this.disableButton.bind(this)}
                onValidSubmit={this.submitForm.bind(this, 'director')}
                id="package-create-form">

                <div className="row">
                    <div className="col-xs-6">
                        <FormInput
                            label="Package Name"
                            placeholder="Name"
                            name="packageName"
                            onInvalid={this.disableButton.bind(this)}
                            id="add-new-package-name"
                        />
                    </div>
                    <div className="col-xs-6">
                        <FormInput
                            label="Version"
                            name="version"
                            id="add-new-package-version"
                            onInvalid={this.disableButton.bind(this)}
                            placeholder="Select version"
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-6">
                        <div className="hardware-ids-select">
                            {hardwareStore.hardwareIdsFetchAsync.isFetching ?
                                <Loader />
                            :
                                <FormSelect
                                    multiple={true}
                                    appendMenuToBodyTag={false}
                                    label="Hardware ids"
                                    id="hardware-ids-select"
                                    placeholder="Select Hardware ids"
                                    onChange={this.selectHardwareIds}
                                    visibleFieldsCount={4}
                                    defaultValue={_.isArray(this.selectedHardwareIds) ? this.selectedHardwareIds : null}
                                    options={hardwareStore.hardwareIds}
                                />
                            }
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-6">
                        <div className="row">
                            <div className="upload-wrapper col-xs-12">
                                {!fileDropped ?
                                    <a href="#"
                                       className="add-button"
                                       onClick={this._onFileUploadClick.bind(this)}
                                       id="choose-package"
                                    >
                                        <span>Choose file</span>
                                    </a>
                                    :
                                    null
                                }
                                <div className="file-name">
                                    {fileDropped ?
                                        fileDropped.name
                                        :
                                        this.fileName
                                    }
                                </div>
                                <input
                                    ref="fileUpload"
                                    name="file"
                                    type="file"
                                    onChange={this._onFileChange.bind(this)}
                                    className="file"
                                    id="file-input-hidden"
                                />
                                <FormsyText
                                    type="text"
                                    name="fake-file"
                                    value={fileDropped ?
                                        fileDropped.name
                                        :
                                        this.fileName
                                    }
                                    style={{display: 'none'}}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <div className="body-actions">
                            <button className="btn-primary"
                                    disabled={this.submitButtonDisabled || !this.selectedHardwareIds.length}
                                    id="add-new-package-confirm"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            </Form>
        );
        return (
            <Modal
                title={"Add new package"}
                topActions={
                    <div className="top-actions flex-end">
                        <div className="modal-close" onClick={hide}>
                            <img src="/assets/img/icons/close.svg" alt="Icon" />
                        </div>
                    </div>
                }
                content={directorForm}
                shown={shown}
                className="add-package-modal"
            />
        );
    }
}

CreateModal.propTypes = {
    shown: PropTypes.bool.isRequired,
    hide: PropTypes.func.isRequired,
    stores: PropTypes.object,
    fileDropped: PropTypes.object
}

export default CreateModal;