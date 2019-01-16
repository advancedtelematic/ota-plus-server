/** @format */

import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { MetaData, FadeAnimation } from '../utils';
import { ProfileHeader } from '../components/profile';

const title = 'Profile';

@observer
class Profile extends Component {
  render() {
    const { children, uiUserProfileMenu, uiCredentialsDownload, uiUserProfileEdit } = this.props;
    return (
      <FadeAnimation>
        <MetaData title={title}>
          <ProfileHeader uiUserProfileMenu={uiUserProfileMenu} uiUserProfileEdit={uiUserProfileEdit} uiCredentialsDownload={uiCredentialsDownload} />
          {children ? <children.type uiCredentialsDownload={uiCredentialsDownload} /> : null}
        </MetaData>
      </FadeAnimation>
    );
  }
}

export default Profile;
