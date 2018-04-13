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
        const { userStore, provisioningStore, devicesStore, groupsStore, children, uiUserProfileMenu, uiCredentialsDownload } = this.props;
        return (
            <FadeAnimation>
                <MetaData 
                    title={title}>
                    <ProfileHeader
                        userStore={userStore}
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
            </FadeAnimation>
        );
    }
}

Profile.propTypes = {
    userStore: PropTypes.object
}

export default Profile;