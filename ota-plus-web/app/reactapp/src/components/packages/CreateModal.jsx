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
    componentWillMount() {
        this.props.hardwareStore.fetchHardwareIds();
    }
    enableButton() {
        this.submitButtonDisabled = false;
    }
    disableButton() {
        this.submitButtonDisabled = true;
    }
    submitForm(type) {
        let formData = new FormData();
        if(this.props.fileDropped)
            formData.append('file', this.props.fileDropped);
        else
            formData.append('file', this.refs.fileUpload.files[0]);
        let data = serialize(document.querySelector('#package-create-form'), { hash: true });
        delete data['fake-file'];
        data.description = data.description ? data.description : "";
        data.vendor = data.vendor ? data.vendor : "";
        this.props.packagesStore.createPackage(data, formData, this.selectedHardwareIds.join());
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
        const { shown, hide, packagesStore, hardwareStore, fileDropped, devicesStore } = this.props;
        const directorForm = (
            <Form
                onValid={this.enableButton.bind(this)}
                onInvalid={this.disableButton.bind(this)}
                onValidSubmit={this.submitForm.bind(this, 'director')}
                id="package-create-form">
                <div className="row">
                    <div className="col-xs-6">
                        <FormsyText
                            name="packageName"
                            floatingLabelText="Package name"
                            className="input-wrapper"
                            underlineFocusStyle={!window.atsGarageTheme || window.otaPlusMode ? {borderColor: '#fa9872'} : {}}
                            floatingLabelFocusStyle={!window.atsGarageTheme || window.otaPlusMode ? {color: '#fa9872'} : {}}
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
                            underlineFocusStyle={!window.atsGarageTheme || window.otaPlusMode ? {borderColor: '#fa9872'} : {}}
                            floatingLabelFocusStyle={!window.atsGarageTheme || window.otaPlusMode ? {color: '#fa9872'} : {}}
                            id="add-new-package-version"
                            updateImmediately
                            required
                        />
                    </div>
                </div>
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
                                    id="file-input-hidden"
                                />
                                <FormsyText
                                    type="text"
                                    name="fake-file"
                                    underlineFocusStyle={!window.atsGarageTheme || window.otaPlusMode ? {borderColor: '#fa9872'} : {}}
                                    floatingLabelFocusStyle={!window.atsGarageTheme || window.otaPlusMode ? {color: '#fa9872'} : {}}
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
                                disabled={this.submitButtonDisabled || !this.selectedHardwareIds.length}
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
                        <img src="/assets/img/icons/white/packages.png" alt="Icon" className="header-icon" />                    
                        <span className="header-text">Add new package</span>
                    </span>
                )}
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
    packagesStore: PropTypes.object.isRequired,
    hardwareStore: PropTypes.object.isRequired,
    fileDropped: PropTypes.object
}

export default CreateModal;