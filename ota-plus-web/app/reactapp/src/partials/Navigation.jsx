/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';

import { Button } from 'antd';
import NavigationPopover from './NavigationPopover';
import TabNavigation from './TabNavigation';

@inject('stores')
@observer
class Navigation extends Component {
  static propTypes = {
    stores: PropTypes.object,
    location: PropTypes.string.isRequired,
    uiUserProfileEdit: PropTypes.bool.isRequired,
    uiUserProfileMenu: PropTypes.bool.isRequired,
    uiCredentialsDownload: PropTypes.bool.isRequired,
    alphaPlusEnabled: PropTypes.bool.isRequired,
    addNewWizard: PropTypes.func,
  };

  render() {
    const { uiUserProfileMenu, uiCredentialsDownload, location, uiUserProfileEdit, alphaPlusEnabled, addNewWizard } = this.props;

    return (
      <nav className='navbar navbar-inverse clearfix'>
        <div className='container clearfix'>
          <div className='navbar-header'>
            <div className='navbar-brand' id='logo' />
          </div>
          <div id='navbar'>
            <ul className='nav navbar-nav'>
              <li ref='linkGetStarted'>
                <NavLink to='/get-started' activeClassName='active' id='get-started-link'>
                  {'Get Started'}
                </NavLink>
              </li>
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
                <NavLink to='/impact-analysis' activeClassName='active' id='link-impactanalysis'>
                  {'Impact analysis'}
                </NavLink>
              </li>
            </ul>
          </div>
          <ul className='right-nav'>
            {window.atsGarageTheme && (
              <span>
                <li className='text-link'>
                  <a href='http://docs.ota.here.com' rel='noopener noreferrer' target='_blank' id='docs-link'>
                    {'DOCS'}
                  </a>
                </li>
                <li className='separator'>{'|'}</li>
                <li className='text-link'>
                  <a href='mailto:otaconnect.support@here.com' id='support-link'>
                    {'SUPPORT'}
                  </a>
                </li>
              </span>
            )}
            {uiUserProfileMenu && (
              <li id='menu-login'>
                <NavigationPopover uiUserProfileEdit={uiUserProfileEdit} uiCredentialsDownload={uiCredentialsDownload} />
              </li>
            )}
          </ul>
        </div>
        {alphaPlusEnabled && location === 'page-software-repository' && <TabNavigation location={location} />}
        {location === 'page-campaigns' && <TabNavigation showCreateCampaignModal={addNewWizard} location={location} />}
      </nav>
    );
  }
}

export default Navigation;
