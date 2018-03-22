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
                    <button className="btn-primary" onClick={hide} id="provisioning-keys-got-it">Got it</button>
                </div>
            </span>
        );
            
        return (
            <Modal 
                title={
                    <div className="heading">
                        <div className="internal">
                            Provisioning Keys
                        </div>
                    </div>
                }
                content={content}
                shown={shown}
                className="provisioning-key-tooltip"
            />
        );
    }
}

export default Tooltip;