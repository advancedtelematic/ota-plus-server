import React, { Component, PropTypes } from 'react';
import { FlatButton } from 'material-ui';
import { Modal } from '../../partials';
import { inject } from 'mobx-react';

@inject("stores")
class CancelUploadModal extends Component {
    constructor(props) {
        super(props);
        this.cancelUpload = this.cancelUpload.bind(this);
    }
    cancelUpload() {
        const { packagesStore } = this.props.stores;
        packagesStore.packagesUploading[this.props.uploadIndex].source.cancel();
        this.props.hide();
    }
    render() {
        const { shown, hide } = this.props;
        const content = (
            <span>
                Your upload is not complete. Would you like to cancel the upload?
                <div className="body-actions">
                    <a href="#"
                        onClick={hide}
                        className="link-cancel">
                        Continue upload
                    </a>
                    <button
                        className="btn-primary"
                        id="cancel-upload"
                        onClick={this.cancelUpload}
                    >
                        Cancel upload
                    </button>
                </div>
            </span>
        );
        return (
            <Modal 
                title={"Cancel upload?"}
                topActions={
                    <div className="top-actions flex-end">
                        <div className="modal-close" onClick={hide}>
                            <img src="/assets/img/icons/close.svg" alt="Icon" />
                        </div>
                    </div>
                }
                content={content}
                shown={shown}
                className="cancel-upload-modal"
            />
        );
    }
}

CancelUploadModal.propTypes = {
    shown: PropTypes.bool.isRequired,
    hide: PropTypes.func.isRequired,
    uploadIndex: PropTypes.number,
    stores: PropTypes.object
}

export default CancelUploadModal;