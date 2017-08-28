import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { observer } from 'mobx-react';
import NavigationDropdown from './NavigationDropdown';

@observer
class IntroNavigation extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { userStore, devicesStore, logoLink, hideQueueModal } = this.props;
        return (
            <nav className="navbar navbar-inverse navbar-fixed-top">
                  <div className="container">
                    <div className="navbar-header">
                          <Link to={logoLink} className="navbar-brand" id="logo"></Link>
                    </div>
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
                            />
                        </li>
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