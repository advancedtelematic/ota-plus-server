/** @format */

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { observer } from 'mobx-react';
import { Loader } from '../../partials';
import { Avatar } from 'material-ui';

@observer
class Header extends Component {
  render() {
    const { uiUserProfileMenu, uiCredentialsDownload, uiUserProfileEdit } = this.props;
    const fullNavigation = (
      <div className='profile-nav__list'>
        {uiUserProfileEdit ? (
          <Link to='/profile/edit' activeClassName='profile-nav__list-item--active' className='profile-nav__list-item' id='edit-profile-link'>
            <div>
              Edit profile
              <span className='profile-nav__bottom-line' />
            </div>
          </Link>
        ) : null}
        <Link to='/profile/usage' activeClassName='profile-nav__list-item--active' className='profile-nav__list-item' id='usage-link'>
          <div>
            Usage
            <span className='profile-nav__bottom-line' />
          </div>
        </Link>
        <Link to='/profile/access-keys' activeClassName='profile-nav__list-item--active' className='profile-nav__list-item' id='provisioning-keys-link'>
          <div>
            Provisioning keys
            <span className='profile-nav__bottom-line' />
          </div>
        </Link>
      </div>
    );
    const fullNavigationWithoutProvisioningKeys = (
      <div className='profile-nav__list'>
        <Link to='/profile/edit' activeClassName='profile-nav__list-item--active' className='profile-nav__list-item' id='edit-profile-link'>
          <div>
            Edit profile
            <span className='profile-nav__bottom-line' />
          </div>
        </Link>
        <Link to='/profile/usage' activeClassName='profile-nav__list-item--active' className='profile-nav__list-item' id='usage-link'>
          <div>
            Usage
            <span className='profile-nav__bottom-line' />
          </div>
        </Link>
      </div>
    );
    const onlyProvisioningKeys = (
      <div className='profile-nav__list'>
        <Link to='/profile/access-keys' activeClassName='profile-nav__list-item--active' className='profile-nav__list-item' id='provisioning-keys-link'>
          <div>
            Provisioning keys
            <span className='profile-nav__bottom-line' />
          </div>
        </Link>
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
