import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Modal, AsyncResponse } from '../../partials';
import { AsyncStatusCallbackHandler } from '../../utils';
import { Form } from 'formsy-react';
import { FormsyText } from 'formsy-material-ui/lib';
import { FlatButton } from 'material-ui';
import serialize from 'form-serialize';

@observer
class CreateModal extends Component {
    @observable submitButtonDisabled = true;
    @observable fileName = null;

    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.createHandler = new AsyncStatusCallbackHandler(this.props.packagesStore, 'packagesCreateAsync', this.hideModal.bind(this));
    }
    componentWillUnmount() {
        this.createHandler();
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
        this.props.packagesStore.createPackage(data, formData);
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
        this.props.hide();
    }
    render() {
        const { shown, hide, packagesStore, fileDropped } = this.props;
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
                            updateImmediately
                            required
                        />
                    </div>
                    <div className="col-xs-6">
                        <FormsyText
                            name="version"
                            floatingLabelText="Version"
                            className="input-wrapper"
                            updateImmediately
                            required
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-6">
                        <FormsyText
                            name="description"
                            value=""
                            floatingLabelText="Description"
                            className="input-wrapper"
                            updateImmediately
                        />
                    </div>
                    <div className="col-xs-6">
                        <FormsyText
                            name="vendor"
                            value=""
                            floatingLabelText="Vendor"
                            className="input-wrapper"
                            updateImmediately
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-6">
                        <div className="upload-wrapper">
                            {!fileDropped ?
                                <FlatButton
                                    label="Choose file"
                                    onClick={this._onFileUploadClick.bind(this)}
                                    className="btn-main btn-small"
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
                <div className="row">
                    <div className="col-xs-12">
                        <div className="body-actions">
                            <a href="#"
                                onClick={this.hideModal.bind(this)}
                                className="link-cancel"
                            >
                                Cancel
                            </a>
                            <FlatButton
                                label="Add package"
                                type="submit"
                                className="btn-main"
                                disabled={this.submitButtonDisabled}
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
            />
        );
    }
}

CreateModal.propTypes = {
    shown: PropTypes.bool.isRequired,
    hide: PropTypes.func.isRequired,
    packagesStore: PropTypes.object.isRequired,
    fileDropped: PropTypes.object
}

export default CreateModal;