import React, { Component, PropTypes } from 'react';
import { Modal } from '../../../partials';
import { FlatButton } from 'material-ui';

class Tooltip extends Component {
    constructor(props) {
        super(props);
    }
    _onClick() {
        this.props.provisioningStore.activateProvisioning();
    }
    render() {
        const { shown, hide } = this.props;
        const content = (
            <span>
                <div className="text-center">
                    The provisioning API lets you programmatically add new devices <br />
                    to ATS Garage as soon as they come online. You can, for example, <br />
                    put the same image on 100 devices, power them on, and have them <br />
                    register themselves (and download updates!) the first time they boot.<br /><br />
                    If you enable this feature, you'll get an individual URL and API <br />
                    credentials for the provisioning endpoints. Read the docs for more details.
                </div>

                <div className="body-actions">
                    <a href="#"
                        onClick={hide}
                        className="link-cancel">
                        Later
                    </a>
                    <FlatButton
                        label="Activate Provisioning API"
                        type="button"
                        className="btn-main"
                        onClick={this._onClick.bind(this)}
                    />
                </div>
            </span>
        );
            
        return (
            <Modal 
                title="Provisioning"
                content={content}
                shown={shown}
            />
        );
    }
}

Tooltip.propTypes = {
    provisioningStore: PropTypes.object.isRequired
}

export default Tooltip;