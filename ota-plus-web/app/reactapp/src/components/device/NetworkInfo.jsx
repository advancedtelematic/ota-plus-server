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
             <div className="page-header__network-info">
                <div className="page-header__device-report-item page-header__device-report-item--crop" id="ip-info">
                    <span className="page-header__device-report-label">IP</span>
                    <div className="page-header__device-report-desc" title={ip}>
                        {ip ? 
                            ip 
                        : 
                            'Not reported'
                        }
                    </div>
                </div>
                <div className="page-header__device-report-item page-header__device-report-item--crop" id="mac-info">
                    <span className="page-header__device-report-label">MAC</span>
                    <div className="page-header__device-report-desc" title={mac}>
                        {mac ? 
                            mac 
                        : 
                            'Not reported'
                        }
                    </div>
                </div>
                <div className="page-header__device-report-item page-header__device-report-item--crop" id="hostname-info">
                    <span className="page-header__device-report-label">Hostname</span>
                    <div className="page-header__device-report-desc" title={hostname}>
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