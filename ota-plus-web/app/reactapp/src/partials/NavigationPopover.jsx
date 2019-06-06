/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { observable } from 'mobx';
import { Avatar, Popover } from 'antd';
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

  changeVisibility = (visibility) => {
    this.visibleDropdown = visibility;
  };

  render() {
    const { stores, uiCredentialsDownload, uiUserProfileEdit } = this.props;
    const { userStore } = stores;
    const { user, userOrganizationName } = userStore;
    const settingsOnly = !uiUserProfileEdit && uiCredentialsDownload;

    const { fullName } = user;
    const initials = fullName ? (fullName.split(' ').map(name => name[0]).join(' ').toUpperCase()) : '';
    const profileMenu = (
      <NavigationProfile
        hideDropdown={this.hideDropdown}
        uiUserProfileEdit={uiUserProfileEdit}
        uiCredentialsDownload={uiCredentialsDownload}
        settingsOnly={settingsOnly}
      />
    );

    return (
      <div className="menu-login-clickable">
        <div className="navigation-name-organization">
          <div className="fullname">{fullName}</div>
          <div className="organization">
            {userOrganizationName}
          </div>
        </div>
        <Popover
          content={profileMenu}
          placement="bottomRight"
          id="profile-dropdown"
          trigger="click"
          overlayClassName="dropdown-menu-popover"
          visible={this.visibleDropdown}
          onVisibleChange={this.changeVisibility}
        >
          <Avatar src={user.picture} className="ant-avatar-menu" id="icon-profile-min">
            {initials}
          </Avatar>
          <span className="dots nav-dots" id="nav-menu">
            <span />
            <span />
            <span />
          </span>
        </Popover>
      </div>
    );
  }
}

export default withRouter(NavigationPopover);
