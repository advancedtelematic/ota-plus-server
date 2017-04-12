import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

@observer
class ListItem extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { image, deviceId, queuedImage, installedImage, isSelected, isAutoInstallEnabled, toggleAutoInstall, toggleImage } = this.props;
        return (
            <span className="wrapper-item">
                <button className="item" id={"button-image-" + image.imageName} onClick={toggleImage.bind(this, image.imageName)}>
                    {image.imageName}

                    {!isSelected ?
                        installedImage ?
                            image.isAutoInstallEnabled ?
                                <label className="label label-auto-update">Auto</label>
                            : null
                        :
                            queuedImage ?
                                <span>
                                    {image.isAutoInstallEnabled ?
                                        <label className="label label-auto-update">Auto</label>
                                    : 
                                        null
                                    }
                                    <span className="status-name">queued</span>
                                    <span className="image-version" title={queuedImage}>
                                        {queuedImage}&nbsp;
                                    </span>
                                    <span className="fa-stack queued">
                                        <i className="fa fa-circle fa-stack-1x"></i>
                                        <i className="fa fa-dot-circle-o fa-stack-1x" aria-hidden="true"></i>
                                    </span>
                                </span>
                            :
                                image.isAutoInstallEnabled ?
                                    <label className="label label-auto-update">Auto</label>
                                  : null
                        : null
                    }
                </button>
                {isSelected ?
                    <div className="wrapper-auto-update">
                        Automatic update
                        <div className={"switch" + (image.isAutoInstallEnabled ? " switchOn" : "")} onClick={toggleAutoInstall.bind(this, image.imageName, deviceId, image.isAutoInstallEnabled)}>
                            <div className="switch-status">
                                {image.isAutoInstallEnabled ?
                                    <span>ON</span>
                                :
                                    <span>OFF</span>
                                }
                            </div>
                        </div>
                    </div>
                : 
                    null
                }
            </span>
        );
    }
}

ListItem.propTypes = {
    image: PropTypes.object.isRequired,
    deviceId: PropTypes.string.isRequired,
    queuedImage: PropTypes.string,
    installedImage: PropTypes.string,
    isSelected: PropTypes.bool.isRequired,
    toggleImage: PropTypes.func.isRequired,
    toggleAutoInstall: PropTypes.func.isRequired,
}

export default ListItem;