import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { observer, inject } from 'mobx-react';
import NavigationDropdown from './NavigationDropdown';
import SettingsDropdown from './SettingsDropdown';

@inject("stores")
@observer
class Navigation extends Component {

  render() {
    const {
      uiUserProfileMenu,
      uiCredentialsDownload,
      location,
      toggleSWRepo,
      switchToSWRepo,
      uiUserProfileEdit,
    } = this.props;
    const { featuresStore } = this.props.stores;
    const { alphaPlusEnabled } = featuresStore;
    return (
      <nav className="navbar navbar-inverse">
        <div className="container">
          <div className="navbar-header">
            <div className="navbar-brand" id="logo" />
          </div>
          <div id="navbar">
            <ul className="nav navbar-nav">
              <li>
                <Link to="/" activeClassName="active" id="link-dashboard">Dashboard</Link>
              </li>
              <li>
                <Link to="/devices" activeClassName="active" id="link-devices">Devices</Link>
              </li>
              <li>
                <Link to="/packages" activeClassName="active" id="link-packages">Packages</Link>
              </li>
              {alphaPlusEnabled ?
                <li>
                  <Link to="/updates" activeClassName="active" id="link-updates">Updates</Link>
                </li>
                :
                null
              }
              <li>
                <Link to="/campaigns" activeClassName="active" id="link-campaigns">Campaigns</Link>
              </li>
              <li>
                <Link to="/impact-analysis" activeClassName="active" id="link-impactanalysis">Impact analysis</Link>
              </li>
            </ul>
          </div>
          <ul className="right-nav">
            {window.atsGarageTheme ?
              <span>
                <li className="text-link">
                  <a href="http://docs.atsgarage.com" target="_blank" id="docs-link">DOCS</a>
                </li>
                <li className="separator">|</li>
                <li className="text-link">
                  <a href="mailto:support@atsgarage.com" id="support-link">SUPPORT</a>
                </li>
              </span> : ''}
            {uiUserProfileMenu ?
              <li id="menu-login">
                <NavigationDropdown
                  uiUserProfileEdit={uiUserProfileEdit}
                  uiCredentialsDownload={uiCredentialsDownload}
                />
              </li>
              : uiCredentialsDownload ?
                <li id="menu-login">
                  <SettingsDropdown
                    uiCredentialsDownload={uiCredentialsDownload}
                  />
                </li>
                :
                null
            }
          </ul>
        </div>
      </nav>
    );
  }
}

Navigation.propTypes = {};

export default Navigation;