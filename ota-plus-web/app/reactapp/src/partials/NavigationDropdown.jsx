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
        this.onDropdownClick = this.onDropdownClick.bind(this);
    }
    handleClickOutside(e) {
        if($('#menu-login .dropdown').hasClass('open'))
            document.getElementById('profile-dropdown').click();
    }
    onDropdownClick(e) {
        if(e) e.preventDefault();
        this.props.hideQueueModal();
    }
    render() {
        const { userStore, toggleOtaPlusMode, otaPlusMode, alphaPlusEnabled, uiCredentialsDownload } = this.props;
        return (
            <Dropdown id="profile-dropdown" rootCloseEvent="mousedown">
                <LinkWrapper
                    onClick={this.onDropdownClick.bind(this)}
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
                    toggleOtaPlusMode={toggleOtaPlusMode}
                    otaPlusMode={otaPlusMode}
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