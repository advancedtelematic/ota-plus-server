import React, { Component } from 'react';
import { Link } from 'react-router';
import { observer } from 'mobx-react';

@observer
class OtaPlusTabs extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const otaPlusNavigation = (
            <ul className="nav navbar-nav">
                <li>
                    <Link to="/dashboard" activeClassName="active" id="link-dashboard">Dashboard</Link>
                </li>
                <li>
                    <Link to="/device-registry" activeClassName="active" id="link-device-registry">Device registry</Link>
                </li>
                <li>
                    <Link to="/software-repository" activeClassName="active" id="link-software-repository">Software repository</Link>
                </li>
                <li>
                    <Link to="/advanced-campaigns" activeClassName="active" id="link-campaigns">Campaigns</Link>
                </li>
                <li>
                    <Link to="/connectors" activeClassName="active" id="link-connectors">Connectors</Link>
                </li>
                <li>
                    <Link to="/device-gateway" activeClassName="active" id="link-gateway">Device Gateway</Link>
                </li>
                <li>
                    <Link to="/auditor" activeClassName="active" id="link-auditor">Auditor</Link>
                </li>
          </ul>
        );
        return (
            otaPlusNavigation
        );
    }
}

export default OtaPlusTabs;