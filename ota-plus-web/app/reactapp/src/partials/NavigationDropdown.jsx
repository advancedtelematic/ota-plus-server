import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import UserDropdown from './UserDropdown';
import { Avatar } from 'material-ui';
import { Dropdown, Button } from 'react-bootstrap';
import onClickOutside from 'react-onclickoutside';
import { LinkWrapper } from '../utils';
import $ from 'jquery';

@observer
class NavigationDropdown extends Component {
    constructor(props) {
        super(props);
    }
    handleClickOutside(e) {
        if($('#menu-login .dropdown').hasClass('open'))
            document.getElementById('profile-dropdown').click();
    }
    render() {
        const { userStore, packagesStore, alphaPlusEnabled, uiCredentialsDownload, uiUserProfileEdit } = this.props;
        return (
            <Dropdown id="profile-dropdown" rootCloseEvent="mousedown">
                <LinkWrapper
                    bsRole="toggle">
                    <Avatar 
                        src={userStore.user.picture ? userStore.user.picture : "/assets/img/icons/profile.png"}
                        className="icon-profile"
                        id="icon-profile-min"
                    />
                    &nbsp;
                    <div className="dots nav-dots" id="nav-menu">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </LinkWrapper>
                <UserDropdown 
                    userStore={userStore}
                    packagesStore={packagesStore}
                    bsRole="menu"
                    uiUserProfileEdit={uiUserProfileEdit}
                    alphaPlusEnabled={alphaPlusEnabled}
                    uiCredentialsDownload={uiCredentialsDownload}
                    settings={false}
                />
            </Dropdown>
        );
    }
}

NavigationDropdown.propTypes = {
    userStore: PropTypes.object.isRequired
}

export default onClickOutside(NavigationDropdown);