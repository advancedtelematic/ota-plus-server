import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { observer } from 'mobx-react';
import NavigationDropdown from './NavigationDropdown';
import SecondNavigation from './SecondNavigation';
import SettingsDropdown from './SettingsDropdown';

@observer
class Navigation extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { 
            userStore,
            devicesStore,
            alphaPlusEnabled, 
            packagesStore,
            uiUserProfileMenu,
            uiCredentialsDownload,
            location,
            toggleSWRepo,
            switchToSWRepo,
            uiUserProfileEdit,
            toggleFleet,
            activeFleet
        } = this.props;
        return (
            <nav className="navbar navbar-inverse">
                  <div className="container">
                    <div className="navbar-header">
                        <div className="navbar-brand" id="logo"/>
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
                                    userStore={userStore}
                                    packagesStore={packagesStore}
                                    uiUserProfileEdit={uiUserProfileEdit}
                                    alphaPlusEnabled={alphaPlusEnabled}
                                    uiCredentialsDownload={uiCredentialsDownload}
                                />
                            </li>
                        : uiCredentialsDownload ?
                            <li id="menu-login">
                                <SettingsDropdown
                                    userStore={userStore}
                                    alphaPlusEnabled={alphaPlusEnabled}
                                    uiCredentialsDownload={uiCredentialsDownload}
                                />
                            </li>
                        :
                            null
                        }
                    </ul>
                </div>
                {alphaPlusEnabled && (location === 'page-packages' || location === 'page-devices')?
                    <SecondNavigation
                        location={location}
                        toggleSWRepo={toggleSWRepo}
                        switchToSWRepo={switchToSWRepo}
                        toggleFleet={toggleFleet}
                        devicesStore={devicesStore}
                        activeFleet={activeFleet}
                    />
                :
                    null
                }
            </nav>
        );
    }
}

Navigation.propTypes = {
    userStore: PropTypes.object.isRequired
}

export default Navigation;