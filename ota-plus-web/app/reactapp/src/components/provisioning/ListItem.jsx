import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

@observer
class ListItem extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { provisioningKey, width } = this.props; 
        const validFrom = new Date(provisioningKey.validFrom);
        const validUntil = new Date(provisioningKey.validUntil);
        return (
            <a href={"/api/v1/provisioning/credentials/registration/" + provisioningKey.id} className="common-box" style={{width: width}}>
                <div className="actions">
                </div>
                <div className="icon"></div>
                <div className="desc">
                    <div className="title" title={provisioningKey.description}>
                        {provisioningKey.description}
                    </div>
                    <div className="subtitle">
                        Valid from: {validFrom.toDateString() + ' ' + validFrom.toLocaleTimeString()}
                    </div>
                    <div className="subtitle">
                        Valid until: {validUntil.toDateString() + ' ' + validUntil.toLocaleTimeString()}
                    </div>                        
                </div>
                <span className="hidden-label" style={{'position': 'absolute', 'left': '50%', 'top': '50%', 'transform': 'translate(-50%, -50%)'}}>
                    <div className="download-key-icon" style={{'text-align': 'center', 'margin-bottom': '5px'}}>
                        <img src="/assets/img/icons/download_key.png" style={{'width': '20px'}} alt=""/>
                    </div>
                    <div className="download-key-text" style={{'text-align': 'center'}}>
                        DOWNLOAD
                    </div>
                </span>
            </a>
        );
    }
}

ListItem.propTypes = {
    provisioningKey: PropTypes.object.isRequired,
    width: PropTypes.number.isRequired
}

export default ListItem;