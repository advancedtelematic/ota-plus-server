import React, { Component, PropTypes } from 'react';
import { FlatButton } from 'material-ui';
import { Modal } from '../../partials';
import _ from 'underscore';

class CancelAllUploadsModal extends Component {
    constructor(props) {
        super(props);
        this.cancelAllUploads = this.cancelAllUploads.bind(this);
    }
    cancelAllUploads() {
        _.each(this.props.packagesStore.packagesUploading, (upload) => {
            upload.source.cancel();
        }, this);
        if(this.props.ifClearUploads)
            this.props.packagesStore.packagesUploading = [];
        this.props.hide();
    }
    render() {
        const { shown, hide } = this.props;
        const content = (
            <span>
                Your uploads are not complete. Would you like to cancel all ongoing uploads?
                <div className="body-actions">
                    <a href="#"
                        onClick={hide}
                        className="link-cancel">
                        Continue uploads
                    </a>
                    <FlatButton
                        label="Cancel uploads"
                        type="submit"
                        className="btn-main"
                        onClick={this.cancelAllUploads}
                    />
                </div>
            </span>
        );
        return (
            <Modal 
                title="Cancel all uploads?"
                content={content}
                shown={shown}
                className="cancel-upload-modal"
                titleClassName="red"
            />
        );
    }
}

CancelAllUploadsModal.propTypes = {
    shown: PropTypes.bool.isRequired,
    hide: PropTypes.func.isRequired,
    ifClearUploads: PropTypes.bool.isRequired,
    packagesStore: PropTypes.object.isRequired
}

export default CancelAllUploadsModal;