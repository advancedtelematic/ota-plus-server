import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { MetaData, FadeAnimation } from '../utils';
import { Header } from '../partials';
import { ProfileHeader } from '../components/profile';

const title = "Profile";

@observer
class Profile extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { userStore, provisioningStore, devicesStore, groupsStore, children, otaPlusStore, uiUserProfileMenu, uiCredentialsDownload } = this.props;
        return (
            <FadeAnimation 
                display="flex">
                <div className="wrapper-flex">
                    <MetaData 
                        title={title}>
                        <ProfileHeader
                            userStore={userStore}
                            otaPlusStore={otaPlusStore}
                            uiUserProfileMenu={uiUserProfileMenu}
                            uiCredentialsDownload={uiCredentialsDownload}
                        />
                        {children ?
                            <children.type
                                userStore={userStore}
                                provisioningStore={provisioningStore}
                                devicesStore={devicesStore}
                                groupsStore={groupsStore}
                                uiCredentialsDownload={uiCredentialsDownload}
                            />
                        :
                            null
                        }
                    </MetaData>
                </div>
            </FadeAnimation>
        );
    }
}

Profile.propTypes = {
    userStore: PropTypes.object
}

export default Profile;