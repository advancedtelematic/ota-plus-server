import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { observer, inject } from 'mobx-react';
import { Avatar } from 'material-ui';

@inject('stores')
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
        const { userStore } = this.props.stores;
        userStore._logout();
    }
    clearLocalStorage(e) {
        e.preventDefault();
        const { packagesStore } = this.props.stores;
        localStorage.clear();
        packagesStore._handleCompatibles();
    }
    render() {
        const { uiCredentialsDownload, settings, uiUserProfileEdit } = this.props;
        const { userStore, featuresStore } = this.props.stores;
        const { alphaPlusEnabled } = featuresStore;
        return (
            <div className="dropdown-menu">
                <div className="triangle"></div>
                {settings ? 
                    <ul className="links">
                        {uiCredentialsDownload ?
                            <li>
                                  <Link to="/profile/access-keys" id="dropdown-link-access-keys" onClick={this.closeDropdown}>
                                      <img src="/assets/img/icons/dropdown_key.svg" alt="Icon" />
                                      Provisioning keys
                                  </Link>
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
                                <span className="username">{userStore.user.fullName}</span>
                            </div>
                            <div className="email">
                                <span className="email">{userStore.user.email}</span>
                            </div>
                        </div>
                        <hr />
                        <ul className="links">
                            {uiUserProfileEdit ?
                                <li>
                                    <Link to="/profile/edit" id="dropdown-link-editprofile" onClick={this.closeDropdown}>
                                        <img src="/assets/img/icons/edit_icon.svg" alt="Icon" />
                                        Edit profile
                                    </Link>
                                </li>
                                : ''
                            }
                            <li>
                                  <Link to="/profile/usage" id="dropdown-link-usage" onClick={this.closeDropdown}>
                                      <img src="/assets/img/icons/dropdown_usage.svg" alt="Icon" />
                                      Usage
                                  </Link>
                            </li>
                            {uiCredentialsDownload ?
                                <li>
                                      <Link to="/profile/access-keys" id="dropdown-link-access-keys" onClick={this.closeDropdown}>
                                          <img src="/assets/img/icons/dropdown_key.svg" alt="Icon" />
                                          Provisioning keys
                                      </Link>
                                </li>
                            :
                                null
                            }
                            <li>
                                <Link to="/policy">
                                    <img src="/assets/img/icons/dropdown_terms.svg" alt="Icon" />
                                    Terms of use
                                </Link>
                            </li>
                            <span>
                                {alphaPlusEnabled ?
                                    <li className="clear-localstorage">
                                        <a href="#" className="add-button" onClick={this.clearLocalStorage} id="reset-demo">
                                            <img src="/assets/img/icons/dropdown_reset_demo.svg" alt="Icon" />
                                            Reset demo
                                        </a>
                                    </li>
                                :
                                    null
                                }
                                <li className="signout">
                                    <a href="#" className="add-button" onClick={this.logout} id="app-logout">
                                        <img src="/assets/img/icons/dropdown_logout.svg" alt="Icon" />
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

UserDropdown.propTypes = {
    stores: PropTypes.object
}

export default UserDropdown;