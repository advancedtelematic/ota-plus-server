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
        this.otaPlusLogout = this.otaPlusLogout.bind(this);
        this.toggleMode = this.toggleMode.bind(this);
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
    otaPlusLogout(e) {
        e.preventDefault();
        this.context.router.push('/login/creds');
    }
    toggleMode() {
        this.props.toggleOtaPlusMode();
    }
    render() {
        const { userStore, otaPlusMode, alphaPlusEnabled, uiCredentialsDownload, settings } = this.props;
        const otaPlusBlock = (
            <li>
                <span className="switch-mode-heading">OTA Demo:</span>
                <div className={"switch" + (otaPlusMode ? " switchOn" : "")} id="switch" onClick={this.toggleMode}>
                    <div className="switch-status">
                        {otaPlusMode ?
                            <span id="switch-on"></span>
                        :
                            <span id="switch-off"></span>
                        }
                    </div>
                </div>
            </li>
        );
        const otaPlusNewEntries = (
            <span className="ota-plus-new-entries">
                <li>
                      <Link to="/profile/users-and-roles" id="dropdown-link-users-and-roles" onClick={this.closeDropdown}>Users and roles</Link>
                </li>
                <li>
                      <Link to="/profile/bl-settings" id="dropdown-link-bl-settings" onClick={this.closeDropdown}>Bl settings</Link>
                </li>
            </span>
        );
        const otaPlusSignOut = (
            <li className="signout">
                <button className="btn-main btn-small" onClick={this.otaPlusLogout}><span>Sign out</span></button>
            </li>
        );
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
                        {otaPlusMode ?
                            otaPlusNewEntries
                        :
                            null
                        }
                        {alphaPlusEnabled ?                        
                            otaPlusBlock
                        :
                            null
                        }
                        {otaPlusMode ?
                            otaPlusSignOut
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
                                  <a href="http://atsgarage.com/en/terms-conditions.html" target="_blank" id="terms-of-use" onClick={this.closeDropdown}>Terms of use</a>
                            </li>
                            {otaPlusMode ?
                                otaPlusNewEntries
                            :
                                null
                            }
                            {alphaPlusEnabled ?                        
                                otaPlusBlock
                            :
                                null
                            }
                            {otaPlusMode ?
                                otaPlusSignOut
                            :
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
                            }
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