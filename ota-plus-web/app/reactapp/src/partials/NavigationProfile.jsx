/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { observer, inject } from 'mobx-react';

import { Tag } from 'antd';
import Dropdown from './Dropdown';
import { ALPHA_TAG, ORGANIZATION_NAMESPACE_COOKIE } from '../config';

@inject('stores')
@observer
class NavigationProfile extends Component {
  static propTypes = {
    stores: PropTypes.shape({}),
    settingsOnly: PropTypes.bool,
    uiUserProfileEdit: PropTypes.bool,
    uiCredentialsDownload: PropTypes.bool,
    hideDropdown: PropTypes.func,
  };

  logout = (e) => {
    e.preventDefault();
    const { stores, hideDropdown } = this.props;
    const { userStore } = stores;
    Cookies.remove(ORGANIZATION_NAMESPACE_COOKIE);
    userStore.logout();
    hideDropdown();
  };

  clearLocalStorage = (e) => {
    e.preventDefault();
    const { stores, hideDropdown } = this.props;
    const { softwareStore } = stores;
    localStorage.clear();
    softwareStore.handleCompatibles();
    hideDropdown();
  };

  render() {
    const { settingsOnly, uiCredentialsDownload, uiUserProfileEdit, hideDropdown } = this.props;
    const showUserMenu = !settingsOnly && uiCredentialsDownload;

    return (
      <Dropdown hideSubmenu={hideDropdown}>
        {settingsOnly && (
          <ul className="links">
            <li>
              <Link to="/profile/access-keys" id="dropdown-link-access-keys" onClick={hideDropdown}>
                {'Credentials (provisioning)'}
              </Link>
            </li>
          </ul>
        )}
        {showUserMenu && (
          <ul className="links">
            {uiUserProfileEdit && (
              <li>
                <Link to="/profile/edit" id="dropdown-link-editprofile" onClick={hideDropdown}>
                  {'Edit profile'}
                </Link>
              </li>
            )}
            <li>
              <Link
                className="centered"
                to="/profile/environments"
                id="dropdown-link-organization"
                onClick={hideDropdown}
              >
                {'Environment'}
                <Tag color="#00B6B2" className="alpha-tag--nav">{ALPHA_TAG}</Tag>
              </Link>
            </li>
            <li>
              <Link to="/profile/usage" id="dropdown-link-usage" onClick={hideDropdown}>
                {'Usage'}
              </Link>
            </li>
            {uiCredentialsDownload && (
              <li>
                <Link to="/profile/access-keys" id="dropdown-link-access-keys" onClick={hideDropdown}>
                  {'Credentials (provisioning)'}
                </Link>
              </li>
            )}
            <li>
              <Link to="/policy" id="dropdown-link-terms-of-use" onClick={hideDropdown}>
                {'Terms of use'}
              </Link>
            </li>
            <li>
              <a className="primary" onClick={this.logout} id="app-logout">
                {'Log out'}
              </a>
            </li>
          </ul>
        )}
      </Dropdown>
    );
  }
}

export default NavigationProfile;
