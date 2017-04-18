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
                    You can install a package on an individual device from the device screen. <br />
                    But when you want to push an update out to multiple devices at the same time, <br />
                    whether it's 5 devices in the lab or 50,000 devices in the field, you'll <br />
                    want to create <strong>update campaigns</strong>. An update campaign delivers one or more packages <br />
                    to a specified group of updates. It also lets you track the progress of the campaign, <br />
                    seeing how many of your devices successfully updated.<br /><br />
                    To create a campaign, you'll need to have at least one &nbsp;
                    <Link to="/packages" className="black"><i className="fa fa-external-link" aria-hidden="true"></i> package</Link>, 
                    and at least one <Link to="/devices"  className="black"><i className="fa fa-external-link" aria-hidden="true"></i> group</Link>.
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
                title="Update campaigns"
                content={content}
                shown={shown}
            />
        );
    }
}

export default Tooltip;