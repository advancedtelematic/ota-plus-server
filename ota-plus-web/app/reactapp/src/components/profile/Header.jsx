/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { observer } from 'mobx-react';

@observer
class Header extends Component {
  render() {
    const { uiUserProfileMenu, uiCredentialsDownload, uiUserProfileEdit } = this.props;
    const fullNavigation = (
      <div className='profile-nav__list'>
        {uiUserProfileEdit ? (
          <NavLink to='/profile/edit' activeClassName='profile-nav__list-item--active' className='profile-nav__list-item' id='edit-profile-link'>
            <div>
              Edit profile
              <span className='profile-nav__bottom-line' />
            </div>
          </NavLink>
        ) : null}
        <NavLink to='/profile/usage' activeClassName='profile-nav__list-item--active' className='profile-nav__list-item' id='usage-link'>
          <div>
            Usage
            <span className='profile-nav__bottom-line' />
          </div>
        </NavLink>
        <NavLink to='/profile/access-keys' activeClassName='profile-nav__list-item--active' className='profile-nav__list-item' id='provisioning-keys-link'>
          <div>
            Provisioning keys
            <span className='profile-nav__bottom-line' />
          </div>
        </NavLink>
      </div>
    );
    const fullNavigationWithoutProvisioningKeys = (
      <div className='profile-nav__list'>
        <NavLink to='/profile/edit' activeClassName='profile-nav__list-item--active' className='profile-nav__list-item' id='edit-profile-link'>
          <div>
            Edit profile
            <span className='profile-nav__bottom-line' />
          </div>
        </NavLink>
        <NavLink to='/profile/usage' activeClassName='profile-nav__list-item--active' className='profile-nav__list-item' id='usage-link'>
          <div>
            Usage
            <span className='profile-nav__bottom-line' />
          </div>
        </NavLink>
      </div>
    );
    const onlyProvisioningKeys = (
      <div className='profile-nav__list'>
        <NavLink to='/profile/access-keys' activeClassName='profile-nav__list-item--active' className='profile-nav__list-item' id='provisioning-keys-link'>
          <div>
            Provisioning keys
            <span className='profile-nav__bottom-line' />
          </div>
        </NavLink>
      </div>
    );
    return (
      <div className='profile-nav'>
        <div className='profile-nav__title'>Profile</div>
        {uiUserProfileMenu ? (uiCredentialsDownload ? fullNavigation : fullNavigationWithoutProvisioningKeys) : uiCredentialsDownload ? onlyProvisioningKeys : null}
      </div>
    );
  }
}

export default Header;
