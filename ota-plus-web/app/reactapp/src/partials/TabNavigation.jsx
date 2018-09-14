import React, { Component, PropTypes } from 'react';
import { observer, inject } from 'mobx-react';

@inject('stores')
@observer
class TabNavigation extends Component {

    render() {
        const { location, toggleSWRepo, switchToSWRepo } = this.props;
        let tabs = null;
        if (location === 'page-packages') {
            tabs = (
                <ul className="tab-navigation__links">
                    <li onClick={ toggleSWRepo }
                        className={ "tab-navigation__link " + (!switchToSWRepo ? 'tab-navigation__link--active' : '') }>
                        <span>{ "Compact" }</span></li>
                    <li onClick={ toggleSWRepo }
                        className={ "tab-navigation__link " + (switchToSWRepo ? 'tab-navigation__link--active' : '') }>
                        <span>{ "Advanced (BETA)" }</span></li>
                </ul>
            );
        }
        return (
            <div className="tab-navigation">
                { tabs }
            </div>
        );
    }
}

TabNavigation.propTypes = {
    location: PropTypes.string.isRequired,
    toggleSWRepo: PropTypes.func,
    switchToSWRepo: PropTypes.bool,
};

export default TabNavigation;