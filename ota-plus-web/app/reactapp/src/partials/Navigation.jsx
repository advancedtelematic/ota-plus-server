/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';

import NavigationPopover from './NavigationPopover';
import TabNavigation from './TabNavigation';
import { assets } from '../config';

@inject('stores')
@observer
class Navigation extends Component {
  state = {
    supportMenuVisible: false
  };

  toggleSupportMenu = (event) => {
    this.setState(state => ({
      supportMenuVisible: !state.supportMenuVisible
    }));
  };

  render() {
    const { uiUserProfileMenu, uiCredentialsDownload, location, uiUserProfileEdit, alphaPlusEnabled, addNewWizard } = this.props;
    const { supportMenuVisible } = this.state;
    const linkButtonIcon = assets.LINK_BUTTON_ICON;

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
            <div className={`support-menu ${supportMenuVisible ? 'support-menu--expanded' : null}`}>
              <div className='support-menu-header' onClick={this.toggleSupportMenu}>
                <div className='support-menu-header__separator' />
                {!supportMenuVisible && (<span className='support-menu-header__arrows--left'>{'<<'}</span>)}
                {'SUPPORT'}
                {supportMenuVisible && (<span className='support-menu-header__arrows--right'>{'>>'}</span>)}
              </div>
              <div className='support-menu-body'>
                <ul className='support-menu-links'>
                  <li className='support-menu-links__link'>
                    <a href='https://docs.ota.here.com/quickstarts/start-intro.html' rel='noopener noreferrer' target='_blank' id='get-started-link'>
                      {'Get Started'}
                      <img src={linkButtonIcon} alt='Icon' />
                    </a>
                  </li>
                  <li className='support-menu-links__link'>
                    <a href='https://docs.ota.here.com' rel='noopener noreferrer' target='_blank' id='docs-link'>
                      {'Documentation'}
                      <img src={linkButtonIcon} alt='Icon' />
                    </a>
                  </li>
                  <li className='support-menu-links__link'>
                    <a href='mailto:otaconnect.support@here.com' id='support-link'>
                      {'Contact Support'}
                      <img src={linkButtonIcon} alt='Icon' />
                    </a>
                  </li>
                </ul>
                <div className='support-menu-body__separator' />
              </div>
            </div>
          </div>
        </div>
        {alphaPlusEnabled && location === 'page-software-repository' && <TabNavigation location={location} />}
        {location === 'page-campaigns' && <TabNavigation showCreateCampaignModal={addNewWizard} location={location} />}
        {supportMenuVisible && <div className="support-menu-mask" onClick={this.toggleSupportMenu} />}
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
