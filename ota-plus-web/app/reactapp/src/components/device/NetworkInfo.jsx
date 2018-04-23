import React, { PureComponent, PropTypes } from 'react';

class NetworkInfo extends PureComponent {
    constructor(props) {
        super(props);
    }
    render() {
        const { devicesStore } = this.props;
        const ip = devicesStore.deviceNetworkInfo.local_ipv4;
        const mac = devicesStore.deviceNetworkInfo.mac;
        const hostname = devicesStore.deviceNetworkInfo.hostname;
        return (
             <div className="device-info-group">
                <div className="device-info-item" id="ip-info">
                    <span className="device-info-label">IP</span>
                    <div className="device-info-desc" title={ip}>
                        {ip ? 
                            ip 
                        : 
                            'Not reported'
                        }
                    </div>
                </div>
                <div className="device-info-item" id="mac-info">
                    <span className="device-info-label">MAC</span>
                    <div className="device-info-desc" title={mac}>
                        {mac ? 
                            mac 
                        : 
                            'Not reported'
                        }
                    </div>
                </div>
                <div className="device-info-item" id="hostname-info">
                    <span className="device-info-label">Hostname</span>
                    <div className="device-info-desc" title={hostname}>
                        {hostname ? 
                            hostname
                        : 
                            'Not reported'
                        }
                    </div>
                </div>
            </div>
        );
    }
}

NetworkInfo.propTypes = {
}

export default NetworkInfo;