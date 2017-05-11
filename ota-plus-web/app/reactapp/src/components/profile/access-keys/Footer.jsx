import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

@observer
class Footer extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { provisioningStore, showDevicesCreateModal } = this.props;
        return (
            <div className="footer">
                <ul>
                    <li>
                        <div className="server-name">
                            <div className="text">
                                My server Name:
                            </div>
                            <pre id="personal-server-name">
                                {provisioningStore.provisioningDetails.hostName}
                            </pre>
                        </div>
                    </li>
                    <li>
                        <div className="treehub">
                            <div className="text">
                                get <a href="/api/v1/features/treehub/client">Treehub</a> credentials
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="prebuilds">
                            <div className="text">
                                get prebuilds <a href="#" onClick={showDevicesCreateModal} >DEB/RPM</a>
                            </div>                            
                        </div>
                    </li>
                </ul>
            </div>
        );
    }
}

Footer.propTypes = {
    provisioningStore: PropTypes.object.isRequired
}

export default Footer;