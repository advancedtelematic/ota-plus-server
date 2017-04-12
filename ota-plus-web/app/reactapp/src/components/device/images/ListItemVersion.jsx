import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

@observer
class ListItemVersion extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { version, queuedImage, isAutoInstallEnabled, installImage } = this.props;
        const createdDate = new Date(version.createdAt);
        return (
            <li className={version.isBlackListed ? "blacklist" : ""}>
                <div className="left-box">
                    <span title={version.hash} className="version-hash">
                        {version.hash}
                    </span>
                    <span className="version-created-at">
                        Created {createdDate.toDateString() + ' ' + createdDate.toLocaleTimeString()}
                    </span>
                </div>
                <div className="right-box">
                    {version.hash === queuedImage || version.hash === installImage ?
                        version.hash === queuedImage ?
                            <span className="status queued">Queued</span>
                        :
                            <span className="status installed">Installed</span>
                    :
                        <button 
                            className="btn-install"
                            title="Install image"
                            id={"button-install-image-" + version.name + "-" + version.hash}
                            onClick={installImage.bind(this, {name: version.name, version: version.hash})}
                            disabled={version.isBlackListed || isAutoInstallEnabled || queuedImage}>
                            Install
                        </button>
                    }
                </div>
            </li>
        );
    }
}

ListItemVersion.propTypes = {
    version: PropTypes.object.isRequired,
    queuedImage: PropTypes.string,
    isAutoInstallEnabled: PropTypes.bool.isRequired,
    installImage: PropTypes.func.isRequired,
}

export default ListItemVersion;