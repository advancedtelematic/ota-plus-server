import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { Modal } from '../../partials';
import { FlatButton } from 'material-ui';

class Tooltip extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { shown, hide } = this.props;
        const content = (
            <span>
                <div className="text-center">
                    ATS Garage helps you manage your embedded devices. <br /><br />
                    To get started, you'll need to create a device and install the ATS Garage client on it.
                </div>

                <div className="body-actions">
                    <FlatButton
                        label="Got it"
                        type="button"
                        className="btn-main"
                        onClick={hide}
                    />
                </div>
            </span>
        );
            
        return (
            <Modal 
                title="Devices"
                content={content}
                shown={shown}
            />
        );
    }
}

export default Tooltip;