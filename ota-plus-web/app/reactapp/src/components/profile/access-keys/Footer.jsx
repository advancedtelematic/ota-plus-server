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
                        <div className="prebuilds">
                            <div className="text" id="access-keys-prebuilds-description">
                                get pre-builds <a href="#" id="access-keys-prebuilds-link" onClick={showDevicesCreateModal}>DEB/RPM</a>
                                <a href="https://docs.atsgarage.com/quickstarts/install-from-a-prebuilt-deb-or-rpm-package.html" target="_blank" className="icon">
                                    <img src="/assets/img/icons/questionmark.png" alt=""/>
                                </a>
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
