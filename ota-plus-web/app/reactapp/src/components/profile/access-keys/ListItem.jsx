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
            <a href="#/profile/access-keys"
                onClick={this._onDownload.bind(this)}
                className="common-box"
                id={"key-" + provisioningKey.description}>

                <div className="icon"></div>
                <div className="desc">
                    <div className="title" title={provisioningKey.description}>
                        {provisioningKey.description}
                    </div>
                    <div className="subtitle" id="key-valid-from">
                        Start date: {validFrom.toDateString() + ' ' + validFrom.toLocaleTimeString()}
                    </div>
                    <div className="subtitle" id="key-valid-until">
                        End date: {validUntil.toDateString() + ' ' + validUntil.toLocaleTimeString()}
                    </div>                        
                </div>
                <div className="download-icon">
                    <img src="/assets/img/icons/download_key.png" alt="Icon" />
                </div>
            </a>
        );
    }
}

ListItem.propTypes = {
    provisioningStore: PropTypes.object.isRequired,
    provisioningKey: PropTypes.object.isRequired,
}

export default ListItem;
