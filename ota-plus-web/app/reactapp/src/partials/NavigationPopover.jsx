/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { observable } from 'mobx';
import { Avatar } from 'antd';
import NavigationProfile from './NavigationProfile';

@inject('stores')
@observer
class NavigationPopover extends Component {
  @observable visibleDropdown = false;

  static propTypes = {
    stores: PropTypes.shape({}),
    uiCredentialsDownload: PropTypes.bool,
    uiUserProfileEdit: PropTypes.bool,
  };

  hideDropdown = () => {
    this.visibleDropdown = false;
  };

  showDropdown = () => {
    this.visibleDropdown = true;
  };

  render() {
    const { stores, uiCredentialsDownload, uiUserProfileEdit } = this.props;
    const { userStore } = stores;
    const { user, userOrganizationName } = userStore;
    const settingsOnly = !uiUserProfileEdit && uiCredentialsDownload;
    const { fullName } = user;
    const initials = fullName ? (fullName.split(' ').map(name => name[0]).join(' ').toUpperCase()) : '';
    return (
      <div className="menu-login-clickable">
        <div className="navigation-name-organization">
          <div className="fullname">{fullName}</div>
          <div className="organization">
            {userOrganizationName}
          </div>
        </div>
        <div onClick={this.showDropdown} id="profile-dropdown">
          <Avatar src={user.picture} className="ant-avatar-menu" id="icon-profile-min">
            {initials}
          </Avatar>
          <div className="dots nav-dots" id="nav-menu">
            <span />
            <span />
            <span />
          </div>
        </div>
        {this.visibleDropdown && (
          <NavigationProfile
            hideDropdown={this.hideDropdown}
            uiUserProfileEdit={uiUserProfileEdit}
            uiCredentialsDownload={uiCredentialsDownload}
            settingsOnly={settingsOnly}
          />
        )}
      </div>
    );
  }
}

export default withRouter(NavigationPopover);
