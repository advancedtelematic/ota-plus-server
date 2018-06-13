import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import _ from 'underscore';

@observer
class SecondNavigation extends Component {
    constructor(props) {
        super(props);
    }
    componentWillMount() {
    	if(this.props.location === 'page-devices') {
    		this.props.devicesStore.fetchDeviceFleets();
    	}
    }
    componentWillReceiveProps(nextProps) {
    	if(nextProps.location === 'page-devices') {
    		this.props.devicesStore.fetchDeviceFleets();
    	}
    }
    render() {
        const { location, toggleSWRepo, switchToSWRepo, toggleFleet, activeFleet, devicesStore } = this.props;
        let block = null;
        if(location === 'page-packages') {
        	block = (
	            <ul className="second-navigation__links">
	                <li onClick={toggleSWRepo} className={"second-navigation__link " + (!switchToSWRepo ? 'second-navigation__link--active' : '')}><span>Compact</span></li>
            		<li onClick={toggleSWRepo} className={"second-navigation__link " + (switchToSWRepo ? 'second-navigation__link--active' : '')}><span>Advanced (BETA)</span></li>
	            </ul>
    		);
        }
        if(location === 'page-devices') {
        	block = (
	            <ul className="second-navigation__links">
	    			{_.map(devicesStore.deviceFleets, (fleet) => {
                        const isFleetActive = activeFleet ? activeFleet.id === fleet.id : false;
	                    return (
	                        <li key={fleet.id} onClick={toggleFleet.bind(this, fleet)} className={"second-navigation__link " + (isFleetActive ? 'second-navigation__link--active' : '')}>
                                <div className="second-navigation__icon" style={{ backgroundImage: 'url(' + (isFleetActive ? fleet.icon_active : fleet.icon_default) + ')' }}></div>
	                            <span>
                                    {fleet.name}
                                </span>
	                        </li>
	                    );
	                })}
                </ul>
		    );
        }
        return (
            <div className="second-navigation">
        	   {block}
            </div>
        );
    }
}

export default SecondNavigation;