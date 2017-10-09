import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { observer } from 'mobx-react';
import NavigationDropdown from './NavigationDropdown';
import AsyncResponse from './AsyncResponse';

@observer
class Navigation extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { userStore, devicesStore, hideQueueModal, toggleOtaPlusMode, otaPlusMode, alphaPlusEnabled, packagesStore} = this.props;
        let logoLink = '/';
        if(otaPlusMode) {
            logoLink = '/dashboard';
        }
        const garageNavigation = (
            <ul className="nav navbar-nav">
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
        const otaPlusNavigation = (
            <ul className="nav navbar-nav">
                <li>
                    <Link to="/fleet" activeClassName="active" id="link-fleet">Fleet</Link>
                </li>
                <li>
                    <Link to="/software-repository" activeClassName="active" id="link-software-repository">Software repository</Link>
                </li>
                <li>
                    <Link to="/features" activeClassName="active" id="link-features">Features</Link>
                </li>
                <li>
                    <Link to="/advanced-campaigns" activeClassName="active" id="link-advanced-campaigns">Advanced campaigns</Link>
                </li>
                <li>
                    <Link to="/connectors" activeClassName="active" id="link-connectors">Connectors</Link>
                </li>
                <li>
                    <Link to="/gateway" activeClassName="active" id="link-gateway">Gateway</Link>
                </li>
                <li>
                    <Link to="/auditor" activeClassName="active" id="link-uditor">Auditor</Link>
                </li>
          </ul>
        );
        return (
            <nav className="navbar navbar-inverse navbar-fixed-top">
                  <div className="container">
                    <div className="navbar-header">
                        <Link to={logoLink} className="navbar-brand" id="logo"></Link>
                    </div>
                    <div id="navbar">
                        {otaPlusMode ?
                            otaPlusNavigation
                        :
                            garageNavigation
                        }
                    </div>
                    <AsyncResponse 
                        handledStatus="error"
                        action={packagesStore.packagesFetchAsync}
                        errorMsg={'Too much packages'}
                    />
                    <ul className="right-nav">
                        <li className="text-link">
                            <a href="http://docs.atsgarage.com" target="_blank" id="docs-link">DOCS</a>
                        </li>
                        <li className="separator">|</li>
                        <li className="text-link">
                            <a href="mailto:support@atsgarage.com" id="support-link">SUPPORT</a>
                        </li>
                        <li id="menu-login">
                            <NavigationDropdown 
                                userStore={userStore}
                                hideQueueModal={hideQueueModal}
                                toggleOtaPlusMode={toggleOtaPlusMode}
                                otaPlusMode={otaPlusMode}
                                alphaPlusEnabled={alphaPlusEnabled}
                            />
                        </li>
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