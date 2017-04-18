import React, { Component, PropTypes } from 'react';
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
                    With ATS Garage, you can <strong>blacklist</strong> problem packages, ensuring they <br />
                    won't get installed on any of your devices. <br /><br />
                    On the <strong>Impact analysis tab</strong>, you can view which of your devices already <br /> 
                    have the blacklisted version of the package installed, letting you <br />
                    proactively troubleshoot and update those devices to a fixed version, <br />
                    or roll them back to an older version.<br /><br />
                    <img src="/assets/img/impact_tooltip.jpg" alt="" />
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
                title="Blacklist"
                content={content}
                shown={shown}
            />
        );
    }
}

export default Tooltip;