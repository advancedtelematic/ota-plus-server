import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

@observer
class ListItem extends Component {
    constructor(props) {
        super(props);
    }
    _onDownload() {
	const { provisioningStore, provisioningKey } = this.props;
        location.href="/api/v1/clienttools/provisioning/" + provisioningKey.id;
    }
    render() {
        const { provisioningKey } = this.props; 
        const validFrom = new Date(provisioningKey.validFrom);
        const validUntil = new Date(provisioningKey.validUntil);
        return (
            <div className="box"  id={"key-" + provisioningKey.description}>
                <div className="column">
                    {provisioningKey.description}
                </div>
                <div className="column">
                    Start date: {validFrom.toDateString() + ' ' + validFrom.toLocaleTimeString()}
                </div>
                <div className="column">
                    End date: {validUntil.toDateString() + ' ' + validUntil.toLocaleTimeString()}
                </div>
                <div className="column">
                    <img src="/assets/img/icons/download_key.svg" className="download-key-link" id={"download-key-link-" + (provisioningKey.description)} alt="Icon" onClick={this._onDownload.bind(this)} />
                </div>
            </div>
        );
    }
}

ListItem.propTypes = {
    provisioningStore: PropTypes.object.isRequired,
    provisioningKey: PropTypes.object.isRequired,
}

export default ListItem;
