import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Modal, AsyncResponse, Loader } from '../../partials';
import { AsyncStatusCallbackHandler } from '../../utils';
import { Form } from 'formsy-react';
import { FormsyText } from 'formsy-material-ui/lib';
import { FlatButton, SelectField, MenuItem } from 'material-ui';
import serialize from 'form-serialize';
import _ from 'underscore';

@observer
class CreateModal extends Component {
    @observable submitButtonDisabled = true;
    @observable fileName = null;
    @observable selectedHardwareIds = [];
    constructor(props) {
        super(props);
        this.selectHardwareIds = this.selectHardwareIds.bind(this);
    }
    enableButton() {
        this.submitButtonDisabled = false;
    }
    disableButton() {
        this.submitButtonDisabled = true;
    }
    submitForm() {
        let formData = new FormData();
        if(this.props.fileDropped)
            formData.append('file', this.props.fileDropped);
        else
            formData.append('file', this.refs.fileUpload.files[0]);
        let data = serialize(document.querySelector('#package-create-form'), { hash: true });
        delete data['fake-file'];
        data.description = data.description ? data.description : "";
        data.vendor = data.vendor ? data.vendor : "";
        if(this.props.uploadToTuf) {
            this.props.packagesStore.createTufPackage(data, formData, this.selectedHardwareIds.join());
        } else {
            this.props.packagesStore.createPackage(data, formData);
        }
        this.hideModal();
    }
    _onFileUploadClick() {
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
    formatHardwareIds(selectedHardwareIds) {
        let hardwareIds = this.props.hardwareStore.hardwareIds;
        return hardwareIds.map((id) => (
            <MenuItem
                key={id}
                insetChildren={true}
                checked={selectedHardwareIds && selectedHardwareIds.indexOf(id) > -1}
                value={id}
                primaryText={id}
                id={"hardware-ids-select-menu-item-" + id}
            />
        ));
    }
    selectHardwareIds(event, index, values) {
        this.selectedHardwareIds = values;
    }
    render() {
        const { shown, hide, packagesStore, hardwareStore, toggleTufUpload, uploadToTuf, fileDropped } = this.props;

        const form = (
            <Form
                onValid={this.enableButton.bind(this)}
                onInvalid={this.disableButton.bind(this)}
                onValidSubmit={this.submitForm.bind(this)}
                id="package-create-form">
                <AsyncResponse 
                    handledStatus="error"
                    action={packagesStore.packagesCreateAsync}
                    errorMsg={
                        (packagesStore.packagesCreateAsync.data ? 
                            packagesStore.packagesCreateAsync.data.description 
                        : 
                            "An error occured during package creation. Please try again."
                        )
                    }
                />
                <div className="row">
                    <div className="col-xs-6">
                        <FormsyText
                            name="packageName"
                            floatingLabelText="Package name"
                            className="input-wrapper"
                            id="add-new-package-name"
                            updateImmediately
                            required
                        />
                    </div>
                    <div className="col-xs-6">
                        <FormsyText
                            name="version"
                            floatingLabelText="Version"
                            className="input-wrapper"
                            id="add-new-package-version"
                            updateImmediately
                            required
                        />
                    </div>
                </div>
                {!uploadToTuf ?
                    <div className="row">
                        <div className="col-xs-6">
                            <FormsyText
                                name="description"
                                value=""
                                floatingLabelText="Description"
                                className="input-wrapper"
                                id="add-new-package-description"
                                updateImmediately
                            />
                        </div>
                        <div className="col-xs-6">
                            <FormsyText
                                name="vendor"
                                value=""
                                floatingLabelText="Vendor"
                                className="input-wrapper"
                                id="add-new-package-vendor"
                                updateImmediately
                            />
                        </div>
                    </div>
                :
                    null 
                }
                {uploadToTuf ?
                    <div className="row">
                        <div className="col-xs-6">
                            <div className="hardware-ids-select" id="hardware-ids-select">
                                {hardwareStore.hardwareIdsFetchAsync.isFetching ?
                                    <Loader />
                                :
                                    <SelectField
                                        id="hardware-ids-select-field"
                                        multiple={true}
                                        onChange={this.selectHardwareIds}
                                        hintText="Select hardware ids"
                                        hintStyle={{opacity: this.selectedHardwareIds.length ? 0 : 1, color: '#b2b2b2', fontWeight: 'bold'}}
                                        value={this.selectedHardwareIds}
                                    >
                                        {this.formatHardwareIds(this.selectedHardwareIds)}
                                    </SelectField>
                                }
                            </div>
                        </div>
                    </div>
                :
                    null
                }
                <div className="row">
                    <div className="col-xs-6">
                        <div className="row">
                            <div className="upload-wrapper col-xs-12">
                                {!fileDropped ?
                                    <FlatButton
                                        label="Choose file"
                                        onClick={this._onFileUploadClick.bind(this)}
                                        className="btn-main btn-small"
                                        id="choose-package"
                                    />
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

                    <div className="col-xs-6">
                        <div className="row">
                            <div className="switch-row">
                                <div className="col-xs-2">
                                    <div className={"switch" + (uploadToTuf ? " switchOn" : "")} id="switch" onClick={toggleTufUpload.bind(this)}>
                                        <div className="switch-status">
                                        {uploadToTuf ?
                                            <span id="switch-on">ON</span>
                                        :
                                            <span id="switch-off">OFF</span>
                                        }
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xs-10">
                                    <div className="tuf-title" id="tuf-title">
                                        Secured
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-2">
                                <div className="tuf-icon" id="tuf-icon">
                                    <img src="/assets/img/icons/black/lock.png" alt="Icon" />
                                </div>
                            </div>
                            <div className="col-xs-10">
                                <div className="tuf-description" id="tuf-description">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <div className="body-actions">
                            <a href="#"
                                onClick={this.hideModal.bind(this)}
                                className="link-cancel"
                                id="add-new-package-cancel"
                            >
                                Cancel
                            </a>
                            <FlatButton
                                label="Add package"
                                type="submit"
                                className="btn-main"
                                id="add-new-package-confirm"
                                disabled={this.submitButtonDisabled || (uploadToTuf && !this.selectedHardwareIds.length)}
                            />
                        </div>
                    </div>
                </div>
            </Form>
        );
        return (
            <Modal 
                title={(
                    <span>
                        Add new package
                    </span>
                )}
                content={form}
                shown={shown}
                className="add-package-modal"
            />
        );
    }
}

CreateModal.propTypes = {
    shown: PropTypes.bool.isRequired,
    hide: PropTypes.func.isRequired,
    packagesStore: PropTypes.object.isRequired,
    hardwareStore: PropTypes.object.isRequired,
    toggleTufUpload: PropTypes.func.isRequired,
    uploadToTuf: PropTypes.bool.isRequired,
    fileDropped: PropTypes.object
}

export default CreateModal;