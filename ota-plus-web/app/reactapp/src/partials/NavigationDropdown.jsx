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
        const { userStore } = this.props;
        return (
            <Dropdown id="profile-dropdown" rootCloseEvent="mousedown">
                <LinkWrapper
                    bsRole="toggle">
                    <Avatar 
                        src={userStore.user.picture ? userStore.user.picture : "/assets/img/icons/profile.png"}
                        className="icon-profile"
                        id="icon-profile-min"
                    />
                    &nbsp; <i className="fa fa-caret-down"></i>
                </LinkWrapper>
                <UserDropdown 
                    userStore={userStore}
                    bsRole="menu"
                />
            </Dropdown>
        );
    }
}

NavigationDropdown.propTypes = {
    userStore: PropTypes.object.isRequired
}

export default onClickOutside(NavigationDropdown);