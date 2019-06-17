/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { observer, inject } from 'mobx-react';

import NavigationPopover from './NavigationPopover';
import SupportMenu from './SupportMenu';

@inject('stores')
@observer
class Navigation extends Component {

  render() {
    const { uiUserProfileMenu, uiCredentialsDownload, uiUserProfileEdit } = this.props;
    return (
      <nav className='navbar navbar-inverse clearfix'>
        <div className='container clearfix'>
          <div>
            <div className='navbar-header'>
              <div className='navbar-brand' id='logo' />
            </div>
            <div id='navbar'>
              <ul className='nav navbar-nav'>
                <li>
                  <NavLink exact to='/' activeClassName='active' id='link-dashboard'>
                    {'Dashboard'}
                  </NavLink>
                </li>
                <li>
                  <NavLink to='/devices' activeClassName='active' id='link-devices'>
                    {'Devices'}
                  </NavLink>
                </li>
                <li>
                  <NavLink to='/software-repository' activeClassName='active' id='link-software-repository'>
                    {'Software Repository'}
                  </NavLink>
                </li>
                <li>
                  <NavLink to='/updates' activeClassName='active' id='link-updates'>
                    {'Updates'}
                  </NavLink>
                </li>
                <li>
                  <NavLink to='/campaigns' activeClassName='active' id='link-campaigns'>
                    {'Campaigns'}
                  </NavLink>
                </li>
                <li>
                  <NavLink to='/impact-analysis' activeClassName='active' id='link-impact-analysis'>
                    {'Impact analysis'}
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
          <div className='right-nav'>
            {uiUserProfileMenu && (
              <div id='menu-login'>
                <NavigationPopover uiUserProfileEdit={uiUserProfileEdit} uiCredentialsDownload={uiCredentialsDownload} />
              </div>
            )}
            <SupportMenu />
          </div>
        </div>
      </nav>
    );
  }
}

Navigation.propTypes = {
  stores: PropTypes.shape({}),
  location: PropTypes.string.isRequired,
  uiUserProfileEdit: PropTypes.bool.isRequired,
  uiUserProfileMenu: PropTypes.bool.isRequired,
  uiCredentialsDownload: PropTypes.bool.isRequired,
  alphaPlusEnabled: PropTypes.bool.isRequired,
  addNewWizard: PropTypes.func
};

export default Navigation;
