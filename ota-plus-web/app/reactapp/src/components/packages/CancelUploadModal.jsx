import React, { Component, PropTypes } from 'react';
import { FlatButton } from 'material-ui';
import { Modal } from '../../partials';

class CancelUploadModal extends Component {
    constructor(props) {
        super(props);
        this.cancelUpload = this.cancelUpload.bind(this);
    }
    cancelUpload() {
        this.props.packagesStore.packagesUploading[this.props.uploadIndex].source.cancel();
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
                    <FlatButton
                        label="Cancel upload"
                        type="submit"
                        className="btn-main"
                        onClick={this.cancelUpload}
                    />
                </div>
            </span>
        );
        return (
            <Modal 
                title="Cancel upload?"
                content={content}
                shown={shown}
                className="cancel-upload-modal"
                titleClassName="red"
            />
        );
    }
}

CancelUploadModal.propTypes = {
    shown: PropTypes.bool.isRequired,
    hide: PropTypes.func.isRequired,
    uploadIndex: PropTypes.number,
    packagesStore: PropTypes.object.isRequired
}

export default CancelUploadModal;