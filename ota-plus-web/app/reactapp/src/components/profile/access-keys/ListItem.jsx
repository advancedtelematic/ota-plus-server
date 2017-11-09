import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

@observer
class ListItem extends Component {
    constructor(props) {
        super(props);
    }
    _onDownload() {
	const { provisioningStore, provisioningKey } = this.props;
        location.href="/api/v1/provisioning/credentials/archive/" + provisioningKey.id;
    }
    render() {
        const { provisioningKey, width } = this.props; 
        const validFrom = new Date(provisioningKey.validFrom);
        const validUntil = new Date(provisioningKey.validUntil);
        return (
            <a href="#/profile/access-keys"
                onClick={this._onDownload.bind(this)}
                className="common-box"
                id={"key-" + provisioningKey.description}
                style={{width: width}}>

                <div className="actions">
                    <ul>
                        <li title="Download key">
                            <img src="/assets/img/icons/download_key.png" alt="" />
                        </li>
                    </ul>
                </div>
                <div className="icon"></div>
                <div className="desc">
                    <div className="title" title={provisioningKey.description}>
                        {provisioningKey.description}
                    </div>
                    <div className="subtitle" id="key-valid-from">
                        Valid from: {validFrom.toDateString() + ' ' + validFrom.toLocaleTimeString()}
                    </div>
                    <div className="subtitle" id="key-valid-until">
                        Valid until: {validUntil.toDateString() + ' ' + validUntil.toLocaleTimeString()}
                    </div>                        
                </div>
            </a>
        );
    }
}

ListItem.propTypes = {
    provisioningStore: PropTypes.object.isRequired,
    provisioningKey: PropTypes.object.isRequired,
    width: PropTypes.number.isRequired
}

export default ListItem;
