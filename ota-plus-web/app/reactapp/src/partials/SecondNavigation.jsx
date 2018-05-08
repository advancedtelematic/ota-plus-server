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
        		<div className="container second-navigation">
		            <ul className="links">
		                <li onClick={toggleSWRepo} className={!switchToSWRepo ? 'active' : ''}><span>Compact</span></li>
                		<li onClick={toggleSWRepo} className={switchToSWRepo ? 'active' : ''}><span>Advanced (BETA)</span></li>
		            </ul>
		        </div>
    		);
        }
        if(location === 'page-devices') {
        	block = (
    			<div className="container second-navigation">
		            <ul className="links">
		    			{_.map(devicesStore.deviceFleets, (fleet) => {
                            const isFleetActive = activeFleet ? activeFleet.id === fleet.id : false;
		                    return (
		                        <li key={fleet.id} onClick={toggleFleet.bind(this, fleet)} className={isFleetActive ? 'active' : ''}>
                                    <div className="fleet-icon" style={{ backgroundImage: 'url(' + (isFleetActive ? fleet.icon_active : fleet.icon_default) + ')' }}></div>
		                            <span>
                                        {fleet.name}
                                    </span>
		                        </li>
		                    );
		                })}
	                </ul>
                </div>
    		);
        }
        return (
        	block
        );
    }
}

export default SecondNavigation;