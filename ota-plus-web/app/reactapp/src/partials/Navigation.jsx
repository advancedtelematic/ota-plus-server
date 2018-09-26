import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { observer, inject } from 'mobx-react';
import _ from 'underscore';
import NavigationDropdown from './NavigationDropdown';
import SettingsDropdown from './SettingsDropdown';
import TabNavigation from './TabNavigation';

@inject("stores")
@observer
class Navigation extends Component {

    handleClick = (e) => {
        const { startWhatsNewPopover } = this.props;
        const newFeaturesAvailable = _.isFunction(startWhatsNewPopover);
        e && e.preventDefault();
        newFeaturesAvailable && startWhatsNewPopover();
    };


    render() {
        const {
            uiUserProfileMenu,
            uiCredentialsDownload,
            location,
            toggleSWRepo,
            switchToSWRepo,
            uiUserProfileEdit,
            alphaPlusEnabled,
        } = this.props;

        const { whatsNewShowPage, whatsNewPostponed, whatsNewPopOver } = this.props.stores.featuresStore;

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
                                <Link to="/updates" activeClassName="active" id="link-updates">Updates</Link>
                            </li>
                            <li>
                                <Link to="/campaigns" activeClassName="active" id="link-campaigns">Campaigns</Link>
                            </li>
                            <li>
                                <Link to="/impact-analysis" activeClassName="active" id="link-impactanalysis">Impact
                                    analysis</Link>
                            </li>
                        </ul>
                    </div>
                    <ul className="right-nav">
                        {
                            window.atsGarageTheme &&
                                <span>
                                    {
                                        (whatsNewPostponed || whatsNewPopOver) &&
                                            <li className="text-link highlighted" ref="linkWhatsNew">
                                                <a href="#" onClick={ this.handleClick } target="_blank" id="whats-new-link">WHAT's NEW</a>
                                                <span className="whats-new-badge"></span>
                                            </li>

                                    }
                                    {
                                        whatsNewShowPage &&
                                            <li className="text-link highlighted" ref="linkWhatsNew">
                                                <Link to="/whats-new" activeClassName="active" id="link-impactanalysis">WHAT's NEW</Link>
                                            </li>
                                    }
                                    <li className={ 'separator' }>|</li>
                                    <li className="text-link">
                                      <a href="http://docs.atsgarage.com" target="_blank" id="docs-link">DOCS</a>
                                    </li>
                                    <li className="separator">|</li>
                                    <li className="text-link">
                                      <a href="mailto:otaconnect.support@here.com" id="support-link">SUPPORT</a>
                                    </li>
                                </span>
                        }
                        {
                            uiUserProfileMenu ?
                                <li id="menu-login">
                                    <NavigationDropdown
                                        uiUserProfileEdit={ uiUserProfileEdit }
                                        uiCredentialsDownload={ uiCredentialsDownload }
                                    />
                                </li>
                                : uiCredentialsDownload &&
                                <li id="menu-login">
                                    <SettingsDropdown
                                        uiCredentialsDownload={ uiCredentialsDownload }
                                    />
                                </li>
                        }
                    </ul>
                </div>
                {
                    alphaPlusEnabled && (location === 'page-packages') &&
                        <TabNavigation
                            location={ location }
                            toggleSWRepo={ toggleSWRepo }
                            switchToSWRepo={ switchToSWRepo }
                        />
                }
            </nav>
        );
    }
}

Navigation.propTypes = {};

export default Navigation;