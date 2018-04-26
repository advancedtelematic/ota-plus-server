import React, { Component, PropTypes } from 'react';
import { observer, observable } from 'mobx-react';
import _ from 'underscore';
import { Modal } from '../../../partials';
import { FlatButton } from 'material-ui';

@observer
class SecondaryEcuDetails extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { hideDetails, shown } = this.props;
        const content = (
            <span>
                <div className="text-left">
                   In many connected mobility domains, most notably in automotive, it is common to have a device, vehicle, or platform that has 
                    multiple independent micro-controllers or other devices networked together. ATS Garage is built to handle updates to those other 
                    micro-controllers even if they don't have an internet connection, or are too resource-constrained to run a full updater client 
                    themselves. The device that has a direct internet connection – the one running the ATS Garage client – is called the "Primary ECU", 
                    and is able to distribute firmware updates to secondary ECUs.<br /><br />
                    The term <strong>ECU</strong> comes from automotive, and stands for <strong>Electronic Control Unit.</strong><br /><br />
                    If you don't have multiple devices to update from one primary/master device, you don't need to worry about this functionality.
                    </div>

                <div className="body-actions">
                    <button className="btn-primary" onClick={hideDetails}>
                        Got it
                    </button>
                </div>
            </span>
        );

        return (
            <Modal 
                title={"Secondary ECUs"}
                topActions={
                    <div className="top-actions flex-end">
                        <div className="modal-close" onClick={hideDetails}>
                            <img src="/assets/img/icons/close.svg" alt="Icon" />
                        </div>
                    </div>
                }                
                content={content}
                shown={shown}
                className="secondary-ecu-details-modal"
                hideOnClickOutside={true}
                onRequestClose={hideDetails}
            />
        );
    }
}

SecondaryEcuDetails.propTypes = {
    hideDetails: PropTypes.func.isRequired,
    shown: PropTypes.bool
}

export default SecondaryEcuDetails;