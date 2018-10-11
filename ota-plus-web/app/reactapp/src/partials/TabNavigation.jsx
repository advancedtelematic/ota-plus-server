import React, { Component, PropTypes } from 'react';
import { observer, inject } from 'mobx-react';

@inject('stores')
@observer
class TabNavigation extends Component {
    componentWillMount() {
        const { location } = this.props;
        const { campaignsStore } = this.props.stores;
        const isCampaignsPage = location === 'page-campaigns';
        isCampaignsPage && campaignsStore.fetchStatusCounts();
    }

    isActive = (tab) => {
        const { activeTab } = this.props;
        return (tab === activeTab ? 'tab-navigation__link--active' : '');
    };
    
    switchTo = (tab) => {
        const { switchTab } = this.props;
        switchTab(tab);
    };

    render() {
        const { location } = this.props;
        let tabs;
        switch (location) {
            case 'page-packages':
                tabs = (
                    <ul className="tab-navigation__links">
                        <li onClick={ () => { this.switchTo('compact') } }
                            className={ "tab-navigation__link " + this.isActive('compact') }>
                            <span>{ "Compact" }</span></li>
                        <li onClick={ () => { this.switchTo('advanced') } }
                            className={ "tab-navigation__link " + this.isActive('advanced') }>
                            <span>{ "Advanced (BETA)" }</span></li>
                    </ul>
                );
                break;
            case 'page-campaigns':
                const {
                    prepared,
                    launched,
                    finished,
                    cancelled,
                } = this.props.stores.campaignsStore.count;
                tabs = (
                    <ul className="tab-navigation__links">
                        <li onClick={ () => { this.switchTo('prepared') } }
                            className={ "tab-navigation__link " + this.isActive('prepared') }>
                            <span>{ `${prepared} In Preparation` }</span></li>
                        <li onClick={ () => { this.switchTo('launched') } }
                            className={ "tab-navigation__link " + this.isActive('launched') }>
                            <span>{ `${launched} Running` }</span></li>
                        <li onClick={ () => { this.switchTo('finished') } }
                            className={ "tab-navigation__link " + this.isActive('finished') }>
                            <span>{ `${finished} Finished` }</span></li>
                        <li onClick={ () => { this.switchTo('cancelled') } }
                            className={ "tab-navigation__link " + this.isActive('cancelled') }>
                            <span>{ `${cancelled} Canceled` }</span></li>
                    </ul>
                );
                break;
            default: break;
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
    switchTab: PropTypes.func.isRequired,
    activeTab: PropTypes.string.isRequired,
};

export default TabNavigation;