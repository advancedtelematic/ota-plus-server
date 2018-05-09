import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import UserDropdown from './UserDropdown';
import { Avatar } from 'material-ui';
import { Dropdown, Button } from 'react-bootstrap';
import onClickOutside from 'react-onclickoutside';
import { LinkWrapper } from '../utils';
import $ from 'jquery';

@observer
class SettingsDropdown extends Component {
    constructor(props) {
        super(props);
    }
    handleClickOutside(e) {
        if($('#menu-login .dropdown').hasClass('open'))
            document.getElementById('profile-dropdown').click();
    }
    render() {
        const { userStore, alphaPlusEnabled, uiCredentialsDownload } = this.props;
        return (
            <Dropdown id="profile-dropdown" rootCloseEvent="mousedown">
                <LinkWrapper
                    bsRole="toggle">
                    {window.atsGarageTheme ?
                        <Avatar
                            src="/assets/img/device_step_two.png"
                            className="icon-profile"
                            id="icon-profile-min"
                        />
                    :
                        <Avatar
                            src="/assets/img/icons/Settings_Icon_small.svg"
                            className="icon-profile"
                            id="icon-profile-min"
                        />
                    }
                    &nbsp; 
                    <div className="dots nav-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </LinkWrapper>
                <UserDropdown 
                    userStore={userStore}
                    bsRole="menu"
                    alphaPlusEnabled={alphaPlusEnabled}
                    uiCredentialsDownload={uiCredentialsDownload}
                    settings={true}
                />
            </Dropdown>
        );
    }
}

SettingsDropdown.propTypes = {
    userStore: PropTypes.object.isRequired
}

export default onClickOutside(SettingsDropdown);