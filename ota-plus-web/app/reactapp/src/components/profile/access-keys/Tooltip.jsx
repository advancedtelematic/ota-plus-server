import React, { Component, PropTypes } from 'react';
import { Modal } from '../../../partials';
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
                    ATS Garage automatically provisions and activates your devices the first
                    time they come online. Here, you can create and manage the provisioning keys
                    linked to your account.
                </div>

                <div className="body-actions">
                    <FlatButton
                        label="Got it!"
                        type="button"
                        className="btn-main"
                        onClick={hide}
                    />
                </div>
            </span>
        );
            
        return (
            <Modal 
                title={<span className="heading provisioning-tooltip-header"><img src="/assets/img/icons/white/key.png" alt="Image" />Provisioning Key</span>}
                content={content}
                shown={shown}
                className="provisioning-key-tooltip"
            />
        );
    }
}

export default Tooltip;