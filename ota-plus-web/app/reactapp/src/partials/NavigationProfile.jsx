/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';

import { Avatar, Divider, Tag } from 'antd';
import { assets } from '../config';

@inject('stores')
@observer
class NavigationProfile extends Component {
  static propTypes = {
    stores: PropTypes.object,
    settingsOnly: PropTypes.bool,
    uiUserProfileEdit: PropTypes.bool,
    uiCredentialsDownload: PropTypes.bool,
    hideDropdown: PropTypes.func,
  };

  logout = e => {
    e.preventDefault();
    const { stores, hideDropdown } = this.props;
    const { userStore } = stores;
    userStore._logout();
    hideDropdown();
  };

  clearLocalStorage = e => {
    e.preventDefault();
    const { stores, hideDropdown } = this.props;
    const { softwareStore } = stores;
    localStorage.clear();
    softwareStore._handleCompatibles();
    hideDropdown();
  };

  render() {
    const { stores, settingsOnly, uiCredentialsDownload, uiUserProfileEdit, hideDropdown } = this.props;
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
        {window.atsGarageTheme && (
          <ul className='links'>
            <li className="link-support">
              <a href='http://docs.ota.here.com' rel='noopener noreferrer' target='_blank' id='docs-link'>
                {'DOCS'}
              </a>
            </li>
            <li className="link-support">
              <a href='mailto:otaconnect.support@here.com' id='support-link'>
                {'SUPPORT'}
              </a>
            </li>
          </ul>
        )}
        <Divider type='horizontal' />
        {settingsOnly && (
          <ul className='links'>
            <li>
              <Link to='/profile/access-keys' id='dropdown-link-access-keys' onClick={hideDropdown}>
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
                <Link to='/profile/edit' id='dropdown-link-editprofile' onClick={hideDropdown}>
                  <img src={assets.DEFAULT_EDIT_ICON} alt='Icon' />
                  {'Edit profile'}
                </Link>
              </li>
            )}
            <li>
              <Link to='/profile/usage' id='dropdown-link-usage' onClick={hideDropdown}>
                <img src={assets.DEFAULT_USAGE_ICON} alt='Icon' />
                {'Usage'}
              </Link>
            </li>
            {uiCredentialsDownload && (
              <li>
                <Link to='/profile/access-keys' id='dropdown-link-access-keys' onClick={hideDropdown}>
                  <img src={assets.DEFAULT_PROVISIONING_ICON} alt='Icon' />
                  {'Provisioning keys'}
                </Link>
              </li>
            )}
            <li>
              <Link to='/policy' id='dropdown-link-terms-of-use' onClick={hideDropdown}>
                <img src={assets.DEFAULT_TERMS_ICON} alt='Icon' />
                {'Terms of use'}
              </Link>
            </li>
            {alphaPlusEnabled && (
              <li className='clear-localstorage'>
                <a onClick={this.clearLocalStorage} id='reset-demo' className='add-button'>
                  <img src={assets.DEFAULT_CLEAR_STORAGE_ICON} alt='Icon' />
                  {'Reset demo'}
                  <Tag color='#48dad0' className='alpha-tag'>ALPHA</Tag>
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
