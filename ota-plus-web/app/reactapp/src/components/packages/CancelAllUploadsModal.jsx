import React, { Component, PropTypes } from 'react';
import { FlatButton } from 'material-ui';
import { Modal } from '../../partials';
import _ from 'underscore';
import { inject } from 'mobx-react';

@inject("stores")
class CancelAllUploadsModal extends Component {
    constructor(props) {
        super(props);
        this.cancelAllUploads = this.cancelAllUploads.bind(this);
    }
    cancelAllUploads() {
        const { packagesStore } = this.props.stores;
        _.each(packagesStore.packagesUploading, (upload) => {
            upload.source.cancel();
        }, this);
        if(this.props.ifClearUploads)
            packagesStore.packagesUploading = [];
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
                    <button
                        className="btn-primary"
                        id="cancel-all-uploads"
                        onClick={this.cancelAllUploads}
                    >
                        Cancel uploads
                    </button>
                </div>
            </span>
        );
        return (
            <Modal
                title={"Cancel all uploads?"}
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

CancelAllUploadsModal.propTypes = {
    shown: PropTypes.bool.isRequired,
    hide: PropTypes.func.isRequired,
    ifClearUploads: PropTypes.bool.isRequired,
    stores: PropTypes.object
}

export default CancelAllUploadsModal;