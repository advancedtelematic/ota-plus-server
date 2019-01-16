/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Avatar, Button, Popover } from 'antd';
import NavigationProfile from './NavigationProfile';

import { assets } from '../config';

@inject('stores')
@observer
class NavigationPopover extends Component {
  static propTypes = {
    stores: PropTypes.object,
    uiCredentialsDownload: PropTypes.bool,
    uiUserProfileEdit: PropTypes.bool,
  };

  render() {
    const { stores, uiCredentialsDownload, uiUserProfileEdit } = this.props;
    const { userStore } = stores;
    const { user } = userStore;
    const settingsOnly = !uiUserProfileEdit && uiCredentialsDownload;

    const pictureSrc = settingsOnly ? assets.DEFAULT_SETTINGS_ICON : user.picture || assets.DEFAULT_PROFILE_PICTURE;

    const profileMenu = <NavigationProfile uiUserProfileEdit={uiUserProfileEdit} uiCredentialsDownload={uiCredentialsDownload} settingsOnly={settingsOnly} />;

    return (
      <Popover content={profileMenu} placement='bottomRight' id='profile-dropdown' trigger={['click']} overlayClassName='dropdown-menu-popover'>
        <div className='menu-login-clickable'>
          <Avatar src={pictureSrc} className='icon-profile' id='icon-profile-min' />
          <span className='dots nav-dots' id='nav-menu'>
            <span />
            <span />
            <span />
          </span>
        </div>
      </Popover>
    );
  }
}

export default NavigationPopover;
