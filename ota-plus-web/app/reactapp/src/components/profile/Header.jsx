/** @format */

import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { Tag } from 'antd';

@inject('stores')
@observer
class Header extends Component {
  render() {
    const { uiUserProfileMenu, uiCredentialsDownload, uiUserProfileEdit, stores } = this.props;
    const { featuresStore } = stores;
    const { alphaPlusEnabled } = featuresStore;
    const fullNavigation = (
      <div className='profile-nav__list'>
        {uiUserProfileEdit && (
          <NavLink to='/profile/edit' activeClassName='profile-nav__list-item--active' className='profile-nav__list-item' id='edit-profile-link'>
            <div>
              Edit profile
              <span className='profile-nav__bottom-line' />
            </div>
          </NavLink>
        )}
        {alphaPlusEnabled && (
          <NavLink to='/profile/organization' activeClassName='profile-nav__list-item--active' className='profile-nav__list-item' id='organization-link'>
            <div>
              <span>
                Organization
                <Tag color='#48dad0' className='alpha-tag'>
                  ALPHA
                </Tag>
              </span>
              <span className='profile-nav__bottom-line' />
            </div>
          </NavLink>
        )}
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
