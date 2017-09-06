import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { observer } from 'mobx-react';
import { Loader } from '../../partials';
import { Avatar } from 'material-ui';

@observer
class Aside extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { userStore, otaPlusStore } = this.props;
        const otaPlusNewEntries = (
            <span className="ota-plus-new-entries">
                <li>
                    <Link to="/profile/users-and-roles" activeClassName="active" id="link-users-and-roles">
                        Users and roles
                    </Link>
                </li>
                <li>
                    <Link to="/profile/bl-settings" activeClassName="active" id="link-bl-settings">
                        Bl settings
                    </Link>
                </li>
            </span>
        );
        return (
            <aside>
                <div className="user-details">
                    {userStore.userFetchAsync.isFetching ?
                        <div className="wrapper-center">
                            <Loader />
                        </div>
                    :
                        <span>
                            <Avatar
                                src={userStore.user.picture ?
                                    userStore.user.picture
                                :
                                    "/assets/img/icons/profile.png"
                                }
                                className="icon-profile"
                                id="icon-profile-min"
                            />
                        </span>
                    }
                </div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/profile/edit" activeClassName="active" id="link-edit-profile">
                                Edit profile
                            </Link>
                        </li>
                        <li>
                            <Link to="/profile/usage" activeClassName="active" id="link-usage">
                                Usage
                            </Link>
                        </li>
                        <li>
                            <Link to="/profile/billing" activeClassName="active" id="link-billing">
                                Billing
                            </Link>
                        </li>
                        <li>
                            <Link to="/profile/access-keys" activeClassName="active" id="link-access-keys">
                                Provisioning keys
                            </Link>
                        </li>
                        {otaPlusStore.otaPlusMode ?
                            otaPlusNewEntries
                        :
                            null
                        }
                        
                    </ul>
                </nav>
            </aside>
        );
    }
}

Aside.propTypes = {
    userStore: PropTypes.object.isRequired
}

export default Aside;