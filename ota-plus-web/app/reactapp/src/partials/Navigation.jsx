/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { withTranslation } from 'react-i18next';

import NavigationPopover from './NavigationPopover';
import SupportMenu from './SupportMenu';
import { FEATURES } from '../config';

@inject('stores')
@observer
class Navigation extends Component {
  render() {
    const { uiUserProfileMenu, t, uiCredentialsDownload, uiUserProfileEdit, stores } = this.props;
    const { featuresStore } = stores;
    const { features } = featuresStore;

    return (
      <nav className="navbar navbar-inverse clearfix">
        <div className="container clearfix">
          <div>
            <div className="navbar-header">
              <div className="navbar-brand" id="logo" />
            </div>
            <div id="navbar">
              <ul className="nav navbar-nav">
                <li>
                  <NavLink exact to="/" activeClassName="active" id="link-dashboard">
                    {t('navigation.dashboard')}
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/devices" activeClassName="active" id="link-devices">
                    {t('navigation.devices')}
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/software-repository" activeClassName="active" id="link-software-repository">
                    {t('navigation.softwares')}
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/updates" activeClassName="active" id="link-updates">
                    {t('navigation.updates')}
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/campaigns" activeClassName="active" id="link-campaigns">
                    {t('navigation.campaigns')}
                  </NavLink>
                </li>
                {features.includes(FEATURES.IMPACT_ANALYSIS) && (
                  <li>
                    <NavLink to="/impact-analysis" activeClassName="active" id="link-impact-analysis">
                      {t('navigation.impact_analysis')}
                    </NavLink>
                  </li>
                )}
              </ul>
            </div>
          </div>
          <div className="right-nav">
            {uiUserProfileMenu && (
              <div id="menu-login">
                <NavigationPopover
                  uiUserProfileEdit={uiUserProfileEdit}
                  uiCredentialsDownload={uiCredentialsDownload}
                />
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
  t: PropTypes.func.isRequired,
  uiUserProfileEdit: PropTypes.bool.isRequired,
  uiUserProfileMenu: PropTypes.bool.isRequired,
  uiCredentialsDownload: PropTypes.bool.isRequired,
};

export default withTranslation()(Navigation);
