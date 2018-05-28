import React, { Component, PropTypes } from 'react';
import Modal from './Modal';

class ConfirmationModal extends Component {
    constructor(props) {
        super(props);
        this.continue = this.continue.bind(this);
    }
    continue() {
        this.props.deleteItem();
    }
    render() {
        const { shown, hide, topText, bottomText, modalTitle } = this.props;
        const content = (
            <span>
                <div className="text-left">
                    {topText}
                    <div className="important-info">
                        This action cannot be undone.
                    </div>
                    {bottomText}
                </div>
                <div className="body-actions">
                    <button className="btn-primary" onClick={this.continue}>
                        Continue
                    </button>
                </div>
            </span>
        );

        return (
            <Modal 
                title={modalTitle}
                topActions={
                    <div className="top-actions flex-end">
                        <div className="modal-close" onClick={hide}>
                            <img src="/assets/img/icons/close.svg" alt="Icon" />
                        </div>
                    </div>
                }                  
                content={content}
                shown={shown}
                className="secondary-ecu-details-modal"
                hideOnClickOutside={true}
                onRequestClose={hide}
            />
        );
    }
}

export default ConfirmationModal;