/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { FadeAnimation } from '../utils';
import { ProfileHeader } from '../components/profile';

@observer
class Profile extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
    location: PropTypes.shape({}),
    uiUserProfileMenu: PropTypes.bool,
    uiCredentialsDownload: PropTypes.bool,
    uiUserProfileEdit: PropTypes.bool,
  };

  render() {
    const { children, uiUserProfileMenu, uiCredentialsDownload, uiUserProfileEdit, location } = this.props;
    // without sending location as a props, the activeClass with NavLink will not work
    const currentLocation = location.pathname;
    return (
      <FadeAnimation>
        <div>
          <ProfileHeader
            location={currentLocation}
            uiUserProfileMenu={uiUserProfileMenu}
            uiUserProfileEdit={uiUserProfileEdit}
            uiCredentialsDownload={uiCredentialsDownload}
          />
          {children}
        </div>
      </FadeAnimation>
    );
  }
}

export default Profile;
