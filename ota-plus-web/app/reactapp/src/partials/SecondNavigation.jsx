import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

@observer
class SecondNavigation extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const {
            switchToSWRepo,
            toggleSWRepo
        } = this.props;
        return (
            <div className="container second-navigation">
                <ul className="links">
                    <li onClick={toggleSWRepo} className={!switchToSWRepo ? 'active' : ''}><span>Compact</span></li>
                    <li onClick={toggleSWRepo} className={switchToSWRepo ? 'active' : ''}><span>Advanced (BETA)</span></li>
                </ul>
            </div>
        );
    }
}

export default SecondNavigation;