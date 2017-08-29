import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { observer } from 'mobx-react';
import { Avatar } from 'material-ui';

@observer
class UserDropdown extends Component {
    constructor(props) {
        super(props);
        this.closeDropdown = this.closeDropdown.bind(this);
        this.logout = this.logout.bind(this);
    }
    closeDropdown() {
        document.getElementById('profile-dropdown').click();
    }
    logout(e) {
        e.preventDefault();
        this.props.userStore._logout();
    }
    render() {
        const { userStore } = this.props;
        return (
            <div className="dropdown-menu">
                <Avatar 
                    src={userStore.user.picture ? userStore.user.picture : "/assets/img/icons/profile.png"}
                    className="icon-profile"
                />
                <div className="user-data">
                    <div className="full-name">
                        <span className="username">{userStore.user.fullName}</span>
                    </div>
                    <div className="email">
                        <span className="email">{userStore.user.email}</span>
                    </div>
                </div>
                <hr />
                <ul className="links">
                    <li>
                        <Link to="/profile/edit" id="link-editprofile" onClick={this.closeDropdown}>Edit profile</Link>
                    </li>
                    <li>
                          <Link to="/profile/usage" id="link-usage" onClick={this.closeDropdown}>Usage</Link>
                    </li>
                    <li>
                          <Link to="/profile/billing" id="link-billing" onClick={this.closeDropdown}>Billing</Link>
                    </li>
                    <li>
                          <Link to="/profile/access-keys" id="link-access-keys" onClick={this.closeDropdown}>Provisioning keys</Link>
                    </li>
                    <li>
                          <a href="http://atsgarage.com/en/terms-conditions.html" target="_blank" id="terms-of-use" onClick={this.closeDropdown}>Terms of use</a>
                    </li>
                    <li className="signout">
                        <button className="btn-main btn-small" onClick={this.logout}><span>Sign out</span></button>
                    </li>
                </ul>
            </div>  
        );
    }
}

UserDropdown.propTypes = {
    userStore: PropTypes.object.isRequired
}

export default UserDropdown;