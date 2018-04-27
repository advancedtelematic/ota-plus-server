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
        this.clearLocalStorage = this.clearLocalStorage.bind(this);
    }
    closeDropdown() {
        document.getElementById('profile-dropdown').click();
    }
    logout(e) {
        e.preventDefault();
        this.props.userStore._logout();
    }
    clearLocalStorage(e) {
        e.preventDefault();
        localStorage.clear();
        this.props.packagesStore._handleCompatibles();
    }
    render() {
        const { userStore, alphaPlusEnabled, uiCredentialsDownload, settings } = this.props;
        return (
            <div className="dropdown-menu">
                <div className="triangle"></div>
                {settings ? 
                    <ul className="links">
                        {uiCredentialsDownload ?
                            <li>
                                  <Link to="/profile/access-keys" id="dropdown-link-access-keys" onClick={this.closeDropdown}>Provisioning keys</Link>
                            </li>
                        :
                            null
                        }
                    </ul>
                :
                    <span>
                        <Avatar 
                            src={userStore.user.picture ? userStore.user.picture : "/assets/img/icons/profile.png"}
                            className="icon-profile"
                        />
                        <div className="user-data">
                            <div className="full-name">
                                <span className="username font-medium">{userStore.user.fullName}</span>
                            </div>
                            <div className="email">
                                <span className="email">{userStore.user.email}</span>
                            </div>
                        </div>
                        <hr />
                        <ul className="links">
                            <li>
                                <Link to="/profile/edit" id="dropdown-link-editprofile" onClick={this.closeDropdown}>Edit profile</Link>
                            </li>
                            <li>
                                  <Link to="/profile/usage" id="dropdown-link-usage" onClick={this.closeDropdown}>Usage</Link>
                            </li>
                            {uiCredentialsDownload ?
                                <li>
                                      <Link to="/profile/access-keys" id="dropdown-link-access-keys" onClick={this.closeDropdown}>Provisioning keys</Link>
                                </li>
                            :
                                null
                            }
                            <li>
                                <Link to="/policy">Terms of use</Link>
                            </li>
                            <span>
                                {alphaPlusEnabled ?
                                    <li className="clear-localstorage">
                                        <a href="#" className="add-button" onClick={this.clearLocalStorage} id="reset-demo">
                                            Reset demo
                                        </a>
                                    </li>
                                :
                                    null
                                }
                                <li className="signout">
                                    <a href="#" className="add-button" onClick={this.logout} id="app-logout">
                                        Log out
                                    </a>
                                </li>
                            </span>
                        </ul>
                    </span>
                }
                
            </div>  
        );
    }
}

UserDropdown.contextTypes = {
    router: React.PropTypes.object.isRequired
}

UserDropdown.propTypes = {
    userStore: PropTypes.object.isRequired
}

export default UserDropdown;