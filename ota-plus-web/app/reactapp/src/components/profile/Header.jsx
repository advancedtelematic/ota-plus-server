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
        const { userStore, uiUserProfileMenu, uiCredentialsDownload, uiUserProfileEdit } = this.props;
        const fullNavigation = (
            <div className="nav-container">
                <div className="page-title">
                    Profile
                </div>
                <div className="nav">
                    {uiUserProfileEdit ?
                        <Link to="/profile/edit" activeClassName="active" id="edit-profile-link">
                            <div className="text">
                                Edit profile
                                <span></span>
                            </div>
                        </Link>
                        : ''
                    }
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