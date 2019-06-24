/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { MetaData, FadeAnimation } from '../utils';
import { ProfileHeader } from '../components/profile';

const title = 'Profile';

@observer
class Profile extends Component {
  static propTypes = {
    children: PropTypes.any,
    uiUserProfileMenu: PropTypes.bool,
    uiCredentialsDownload: PropTypes.bool,
    uiUserProfileEdit: PropTypes.bool,
  };

  render() {
    const { children, uiUserProfileMenu, uiCredentialsDownload, uiUserProfileEdit } = this.props;
    //without sending location as a props, the activeClass with NavLink will not work
    const location = this.props.location.pathname;
    return (
      <FadeAnimation>
        <MetaData title={title}>
          <ProfileHeader location={location} uiUserProfileMenu={uiUserProfileMenu} uiUserProfileEdit={uiUserProfileEdit} uiCredentialsDownload={uiCredentialsDownload} />
          {children}
        </MetaData>
      </FadeAnimation>
    );
  }
}

export default Profile;
