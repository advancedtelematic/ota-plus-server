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
                    <strong>Packages</strong> are how ATS Garage represents software updates. A package might be <br />
                    a traditional linux package like a .deb or .rpm, a custom file format passed off to a <br />
                    processing script on your device, a simple metadata file informing a target device <br />
                    what it should do, or even a complete filesystem image. <br /><br />
                    The easiest way to get started is to use deb or rpm packages. <br />
                    However, the most powerful features of ATS Garage require a bit more setup. If you want to <br />
                    use custom update handlers or do incremental full-filesystem updates, we've got you covered.
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
                title={(
                    <span>
                        Packages
                    </span>
                )}
                content={content}
                shown={shown}
            />
        );
    }
}

Tooltip.propTypes = {
    shown: PropTypes.bool.isRequired,
    hide: PropTypes.func.isRequired
}

export default Tooltip;