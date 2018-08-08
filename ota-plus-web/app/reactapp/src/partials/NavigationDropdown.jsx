import React, { Component, PropTypes } from 'react';
import { observer, inject } from 'mobx-react';
import UserDropdown from './UserDropdown';
import { Avatar } from 'material-ui';
import { Dropdown, Button } from 'react-bootstrap';
import onClickOutside from 'react-onclickoutside';
import { LinkWrapper } from '../utils';
import $ from 'jquery';

@inject('stores')
@observer
class NavigationDropdown extends Component {
    render() {
        const { uiCredentialsDownload, uiUserProfileEdit } = this.props;
        const { userStore } = this.props.stores;
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
                    bsRole="menu"
                    uiUserProfileEdit={uiUserProfileEdit}
                    uiCredentialsDownload={uiCredentialsDownload}
                    settings={false}
                />
            </Dropdown>
        );
    }
}

NavigationDropdown.propTypes = {
    stores: PropTypes.object
}

export default onClickOutside(NavigationDropdown, {
    handleClickOutside: (e) => {
        return () => {
            if($('#menu-login .dropdown').hasClass('open'))
                document.getElementById('profile-dropdown').click();
        }
    }
});