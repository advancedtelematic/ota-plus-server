import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

@observer
class Footer extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { provisioningStore } = this.props;
        return (
            <div className="footer">
                <ul>
                    <li>
                        <div className="server-name">
                            <div className="text">
                                Device gateway:
                            </div>
                            <pre id="personal-server-name">
                                 {provisioningStore.provisioningDetails.hostName}
                            </pre>
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
