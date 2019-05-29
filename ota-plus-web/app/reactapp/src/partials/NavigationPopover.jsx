/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Cookies from 'js-cookie';
import { observer, inject } from 'mobx-react';
import { observable, observe } from 'mobx';
import { Avatar, Button, Dropdown, Icon, Menu, Popover } from 'antd';
import NavigationProfile from './NavigationProfile';
import { API_USER_ORGANIZATIONS_SWITCH_NAMESPACE, ORGANIZATION_NAMESPACE_COOKIE } from '../config';

@inject('stores')
@observer
class NavigationPopover extends Component {
  @observable visibleDropdown = false;

  static propTypes = {
    stores: PropTypes.shape({}),
    uiCredentialsDownload: PropTypes.bool,
    uiUserProfileEdit: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedOrganizationIndex: -1,
    };
    this.createOrganizationsMenu = this.createOrganizationsMenu.bind(this);
    this.handleMenuClick = this.handleMenuClick.bind(this);
    const { userStore } = props.stores;
    this.fetchUngroupedDevicesHandler = observe(userStore, (change) => {
      const { selectedOrganizationIndex: stateSelectedOrganizationIndex } = this.state;
      if (change.name === 'userOrganizationNamespace' && stateSelectedOrganizationIndex === -1) {
        const selectedOrganizationIndex = userStore.userOrganizations.findIndex(
          organization => organization.namespace === userStore.userOrganizationNamespace
        );
        this.createOrganizationsMenu(userStore.userOrganizationNamespace);
        this.setState({ selectedOrganizationIndex });
      }
    });
  }

  componentWillUnmount() {
    this.fetchUngroupedDevicesHandler();
  }

  createOrganizationsMenu = (namespace) => {
    const { stores } = this.props;
    const { userStore } = stores;
    this.namespacesMenu = (
      <Menu onClick={this.handleMenuClick}>
        {userStore.userOrganizations.map(organization => (
          <Menu.Item key={organization.namespace} disabled={organization.namespace === namespace}>
            {organization.name}
          </Menu.Item>
        ))}
      </Menu>
    );
  };

  hideDropdown = () => {
    this.visibleDropdown = false;
  };

  changeVisibility = (visibility) => {
    this.visibleDropdown = visibility;
  };

  handleMenuClick(event) {
    const namespace = event.key;
    const pathOrigin = window.location.origin;
    const subUrl = API_USER_ORGANIZATIONS_SWITCH_NAMESPACE.replace('$namespace', namespace);
    const redirectUrl = `${pathOrigin}${subUrl}`;
    Cookies.set(ORGANIZATION_NAMESPACE_COOKIE, namespace);
    window.location.replace(redirectUrl);
  }

  render() {
    const { selectedOrganizationIndex } = this.state;
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
              {selectedOrganizationIndex > -1 ? (
                <Dropdown overlay={this.namespacesMenu}>
                  <Button
                    htmlType="button"
                    className="ant-btn ant-btn-hero drop-down organization-namespace"
                  >
                    {userStore.userOrganizations[selectedOrganizationIndex].name}
                    <Icon type="down" />
                  </Button>
                </Dropdown>
              ) : userOrganizationName}
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
