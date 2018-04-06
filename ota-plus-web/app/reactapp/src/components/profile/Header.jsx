import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { observer } from 'mobx-react';
import { Loader } from '../../partials';
import { Avatar } from 'material-ui';

@observer
class Header extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { userStore, otaPlusStore, uiUserProfileMenu, uiCredentialsDownload } = this.props;
        const otaPlusNewEntries = (
            <span className="ota-plus-new-entries" style={{display: 'flex'}}>
                <Link to="/profile/users-and-roles" activeClassName="active" id="sidebar-link-users-and-roles">
                    <div className="text">
                        Edit profile
                        <span></span>
                    </div>
                </Link>
                <Link to="/profile/bl-settings" activeClassName="active" id="sidebar-link-bl-settings">
                    <div className="text">
                        Bl settings
                        <span></span>
                    </div>
                </Link>
            </span>
        );
        const fullNavigation = (
            <div className="nav-container">
                <div className="page-title">
                    Profile
                </div>
                <div className="nav">
                    <Link to="/profile/edit" activeClassName="active" id="edit-profile-link">
                        <div className="text">
                            Edit profile
                            <span></span>
                        </div>
                    </Link>
                    <Link to="/profile/usage" activeClassName="active" id="usage-link">
                        <div className="text">
                            Usage
                            <span></span>
                        </div>
                    </Link>
                    <Link to="/profile/access-keys" activeClassName="active" id="provisioning-keys-link">
                        <div className="text">
                            Provisioning keys
                            <span></span>
                        </div>
                    </Link>
                </div>
            </div>
        );
        const fullNavigationWithoutProvisioningKeys = (
            <div className="nav-container">
                <div className="page-title">
                    Profile
                </div>
                <div className="nav">
                    <Link to="/profile/edit" activeClassName="active" id="edit-profile-link">
                        <div className="text">
                            Edit profile
                            <span></span>
                        </div>
                    </Link>
                    <Link to="/profile/usage" activeClassName="active" id="usage-link">
                        <div className="text">
                            Usage
                            <span></span>
                        </div>
                    </Link>
                    {otaPlusStore.otaPlusMode ?
                        otaPlusNewEntries
                    :
                        null
                    }
                </div>
            </div>
        );
        const onlyProvisioningKeys = (
            <div className="nav-container">
                <div className="page-title">
                    Profile
                </div>
                <div className="nav">
                    <Link to="/profile/access-keys" activeClassName="active" id="provisioning-keys-link">
                        <div className="text">
                            Provisioning keys
                            <span></span>
                        </div>
                    </Link>
                    {otaPlusStore.otaPlusMode ?
                        otaPlusNewEntries
                    :
                        null
                    }
                </div>
            </div>
        );
        return (
            uiUserProfileMenu ?
                uiCredentialsDownload ?
                    fullNavigation
                :
                    fullNavigationWithoutProvisioningKeys
            :
                uiCredentialsDownload ?
                    onlyProvisioningKeys
                :
                    null            
        );
    }
}

Header.propTypes = {
    userStore: PropTypes.object.isRequired
}

export default Header;