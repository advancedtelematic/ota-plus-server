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
                <div className="text">
                    My personal server Name:
                </div>
                <pre>
                    {provisioningStore.provisioningDetails.hostName}
                </pre>
            </div>
        );
    }
}

Footer.propTypes = {
    provisioningStore: PropTypes.object.isRequired
}

export default Footer;