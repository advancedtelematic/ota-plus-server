import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { observer } from 'mobx-react';
import NavigationDropdown from './NavigationDropdown';
import SettingsDropdown from './SettingsDropdown';
import OtaPlusTabs from './OtaPlusTabs';

@observer
class Navigation extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { 
            userStore, 
            devicesStore, 
            hideQueueModal, 
            toggleOtaPlusMode, 
            otaPlusMode, 
            alphaPlusEnabled, 
            packagesStore,
            uiUserProfileMenu,
            uiCredentialsDownload,
        } = this.props;
        const garageNavigation = (
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
        );
        return (
            <nav className="navbar navbar-inverse navbar-fixed-top">
                  <div className="container">
                    <div className="navbar-header">
                        <div className="navbar-brand" id="logo"/>
                    </div>
                    <div id="navbar">
                        {otaPlusMode ?
                            <OtaPlusTabs />
                        :
                            garageNavigation
                        }
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
                                    hideQueueModal={hideQueueModal}
                                    toggleOtaPlusMode={toggleOtaPlusMode}
                                    otaPlusMode={otaPlusMode}
                                    alphaPlusEnabled={alphaPlusEnabled}
                                    uiCredentialsDownload={uiCredentialsDownload}
                                />
                            </li>
                        : uiCredentialsDownload ?
                            <li id="menu-login">
                                <SettingsDropdown
                                    userStore={userStore}
                                    hideQueueModal={hideQueueModal}
                                    toggleOtaPlusMode={toggleOtaPlusMode}
                                    otaPlusMode={otaPlusMode}
                                    alphaPlusEnabled={alphaPlusEnabled}
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

Navigation.propTypes = {
    userStore: PropTypes.object.isRequired
}

export default Navigation;