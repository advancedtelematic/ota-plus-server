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
                        <div className="prebuilds">
                            <div className="text" id="access-keys-prebuilds-description">
                                get pre-builds <a href="#" id="access-keys-prebuilds-link" onClick={showDevicesCreateModal}>DEB/RPM</a>
                                <a href="https://docs.atsgarage.com/index.html" target="_blank" className="icon">
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