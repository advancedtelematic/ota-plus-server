import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { observer } from 'mobx-react';
import NavigationDropdown from './NavigationDropdown';
import OtaPlusTabs from './OtaPlusTabs';

@observer
class IntroNavigation extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { userStore, devicesStore, logoLink, hideQueueModal, toggleOtaPlusMode, otaPlusMode, alphaPlusEnabled } = this.props;
        const otaPlusNavigation = (
            <OtaPlusTabs />
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
                            null
                        }
                    </div>
                   <ul className="right-nav">
                        <li className="text-link">
                            <a href="http://docs.atsgarage.com" target="_blank" id="docs-link">DOCS</a>
                        </li>
                        <li className="separator">|</li>
                        <li className="text-link">
                            <a href="mailto:support@atsgarage.com" id="support-link">SUPPORT</a>
                        </li>
                       {this.props.uiUserProfileMenu === "true" ?
                           <li id="menu-login">
                               <NavigationDropdown
                                   userStore={userStore}
                                   hideQueueModal={hideQueueModal}
                                   toggleOtaPlusMode={toggleOtaPlusMode}
                                   otaPlusMode={otaPlusMode}
                                   alphaPlusEnabled={alphaPlusEnabled}
                               />
                           </li>
                       : ''}
                    </ul>
                </div>
            </nav>
        );
    }
}

IntroNavigation.propTypes = {
    userStore: PropTypes.object.isRequired
}

export default IntroNavigation;