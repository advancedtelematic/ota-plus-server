import React, { Component, PropTypes } from 'react';
import { Modal } from '../../partials';
import { FlatButton } from 'material-ui';

class Tooltip extends Component {
    constructor(props) {
        super(props);
    }
    _onClick() {
        this.props.featuresStore.activateTreehub();
    }
    render() {
        const { shown, hide } = this.props;
        const content = (
            <span>
                With ATS Garage, OSTree, and Treehub, you can have incredibly fast 
                and efficient atomic differential updates to your embedded devices
                --it's like Git (and GitHub) for your embedded filesystems. You even 
                get versioning on the device, so you can instantly switch between
                different firmware releases without having to re-flash or re-download anything.
                <br /><br />
                Sound exciting? Click the switch to enable, and then start reading 
                the docs to learn how to <strong>integrate Treehub into your existing 
                OpenEmbedded/Yocto project </strong>, or how to <strong>start a new project from scratch on a Raspberry Pi</strong>.

                <div className="body-actions">
                    <a href="#"
                        onClick={hide}
                        className="link-cancel">
                        Later
                    </a>
                    <FlatButton
                        label="Get started now!"
                        type="button"
                        className="btn-main"
                        onClick={this._onClick.bind(this)}
                    />
                </div>
            </span>
        );
            
        return (
            <Modal 
                title="TreeHub"
                content={content}
                shown={shown}
            />
        );
    }
}

Tooltip.propTypes = {
    featuresStore: PropTypes.object.isRequired
}

export default Tooltip;