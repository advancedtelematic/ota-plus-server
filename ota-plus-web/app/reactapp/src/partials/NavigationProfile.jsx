/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';

import { Avatar, Divider } from 'antd';
import { assets } from '../config';

@inject('stores')
@observer
class NavigationProfile extends Component {
  static propTypes = {
    stores: PropTypes.object,
    settingsOnly: PropTypes.bool,
    uiUserProfileEdit: PropTypes.bool,
    uiCredentialsDownload: PropTypes.bool,
  };

  /*closeDropdown = () => {
        document.getElementById('profile-dropdown').click();
    };*/

  logout = e => {
    e.preventDefault();
    const { stores } = this.props;
    const { userStore } = stores;
    userStore._logout();
  };

  clearLocalStorage = e => {
    e.preventDefault();
    const { stores } = this.props;
    const { packagesStore } = stores;
    localStorage.clear();
    packagesStore._handleCompatibles();
  };

  render() {
    const { stores, settingsOnly, uiCredentialsDownload, uiUserProfileEdit } = this.props;
    const { userStore, featuresStore } = stores;
    const { alphaPlusEnabled } = featuresStore;
    const { user } = userStore;
    const pictureSrc = user.picture || assets.DEFAULT_PROFILE_PICTURE;
    const showUserMenu = !settingsOnly && uiCredentialsDownload;

    return (
      <div className='dropdown-menu'>
        <Avatar src={pictureSrc} className='icon-profile' />
        <div className='user-data'>
          <div className='full-name'>
            <span className='username'>{userStore.user.fullName}</span>
          </div>
          <div className='email'>
            <span className='email'>{userStore.user.email}</span>
          </div>
        </div>
        <Divider type='horizontal' />
        {settingsOnly && (
          <ul className='links'>
            <li>
              <Link to='/profile/access-keys' id='dropdown-link-access-keys'>
                <img src={assets.DEFAULT_PROVISIONING_ICON} alt='Icon' />
                {'Provisioning keys'}
              </Link>
            </li>
          </ul>
        )}
        {showUserMenu && (
          <ul className='links'>
            {uiUserProfileEdit && (
              <li>
                <Link to='/profile/edit' id='dropdown-link-editprofile'>
                  <img src={assets.DEFAULT_EDIT_ICON} alt='Icon' />
                  {'Edit profile'}
                </Link>
              </li>
            )}
            <li>
              <Link to='/profile/usage' id='dropdown-link-usage'>
                <img src={assets.DEFAULT_USAGE_ICON} alt='Icon' />
                {'Usage'}
              </Link>
            </li>
            {uiCredentialsDownload && (
              <li>
                <Link to='/profile/access-keys' id='dropdown-link-access-keys'>
                  <img src={assets.DEFAULT_PROVISIONING_ICON} alt='Icon' />
                  {'Provisioning keys'}
                </Link>
              </li>
            )}
            <li>
              <Link to='/policy'>
                <img src={assets.DEFAULT_TERMS_ICON} alt='Icon' />
                {'Terms of use'}
              </Link>
            </li>
            {alphaPlusEnabled && (
              <li className='clear-localstorage'>
                <a onClick={this.clearLocalStorage} id='reset-demo' className='add-button'>
                  <img src={assets.DEFAULT_CLEAR_STORAGE_ICON} alt='Icon' />
                  {'Reset demo'}
                </a>
              </li>
            )}
            <li>
              <a onClick={this.logout} id='app-logout' className='add-button'>
                <img src={assets.DEFAULT_LOGOUT_ICON} alt='Icon' />
                {'Log out'}
              </a>
            </li>
          </ul>
        )}
      </div>
    );
  }
}

export default NavigationProfile;