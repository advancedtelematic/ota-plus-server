import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { observer } from 'mobx-react';
import _ from 'underscore';

@observer
class LastDevicesItem extends Component {
    constructor(props) {
        super(props);
    }    
    render() {
        const { device } = this.props;
        const link = 'device/' + device.uuid;
        const lastSeenDate = new Date(device.lastSeen);
        let deviceStatus = 'Status unknown';
        switch(device.deviceStatus) {
            case 'UpToDate':
                deviceStatus = 'Device synchronized';
            break;
            case 'Outdated':
                deviceStatus = 'Device unsynchronized';
            break;
            case 'Error':
                deviceStatus = 'Installation error';
            break;
            default:
            break;
        }
        return (
            <Link
                to={`${link}`} 
                className="device" 
                title={device.deviceName}
                id={"link-devicedetails-" + device.uuid}>
                <div className="col">
                    {device.deviceName}
                </div>
                <div className="col">
                    {deviceStatus !== 'Status unknown' ?
                        <span>{lastSeenDate.toDateString() + ' ' + lastSeenDate.toLocaleTimeString()}</span>
                    :
                        <span>Never seen online</span>
                    }
                </div>
                <div className="col">
                    {deviceStatus}
                </div>
            </Link>
        );
    }
}

LastDevicesItem.propTypes = {
    device: PropTypes.object.isRequired
}

export default LastDevicesItem;