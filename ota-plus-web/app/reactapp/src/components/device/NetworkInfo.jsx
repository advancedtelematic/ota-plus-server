import React, { PureComponent, PropTypes } from 'react';

class NetworkInfo extends PureComponent {
    constructor(props) {
        super(props);
    }
    render() {
        const { data } = this.props;
        const ip = data.local_ipv4;
        const mac = data.mac;
        const hostname = data.hostname;
        return (
             <div className="device-info-group">
                <div className="device-info-item crop" id="ip-info">
                    <span className="device-info-label">IP</span>
                    <div className="device-info-desc" title={ip}>
                        {ip ? 
                            ip 
                        : 
                            'Not reported'
                        }
                    </div>
                </div>
                <div className="device-info-item crop" id="mac-info">
                    <span className="device-info-label">MAC</span>
                    <div className="device-info-desc" title={mac}>
                        {mac ? 
                            mac 
                        : 
                            'Not reported'
                        }
                    </div>
                </div>
                <div className="device-info-item crop" id="hostname-info">
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