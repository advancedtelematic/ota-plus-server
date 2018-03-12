import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

@observer
class ListItem extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { pack, device, queuedPackage, installedPackage, isSelected, togglePackage, toggleTufAutoInstall, showPackageDetails } = this.props;
        return (
            <span className="wrapper-item">
                {!pack.unmanaged ?
                    <span>
                        <button className={"item" + (isSelected ? " selected": "")} id={"button-package-" + pack.packageName} onClick={togglePackage.bind(this, pack.packageName)}>
                            <div className="left-box">
                                <div className="name">
                                    {pack.packageName}
                                </div>
                                <div className="package-versions-nr" id="package-versions-nr">
                                    {pack.versions.length === 1 ?
                                        pack.versions.length + " version"
                                    :
                                        pack.versions.length + " versions"
                                    }
                                </div>
                            </div>
                            <div className="right-box">
                                {!isSelected ?
                                    queuedPackage ?
                                        <span>
                                            {pack.isAutoInstallEnabled ?
                                                <div className="labels">
                                                    <label className="label label-auto-update">Auto</label>
                                                    <label className="label label-package-queued">Queued</label>
                                                </div>
                                            : 
                                                <div className="labels">
                                                    <label className="label label-package-queued">Queued</label>
                                                </div>
                                            }
                                        </span>
                                    :
                                    installedPackage ?
                                        pack.isAutoInstallEnabled ?
                                            <div className="labels">
                                                <label className="label label-auto-update">Auto</label>
                                                <label className="label label-package-installed">Installed</label>
                                            </div>
                                        :
                                            <div className="labels">
                                                <label className="label label-package-installed">Installed</label>
                                            </div>
                                    :
                                    pack.isAutoInstallEnabled ?
                                            <div className="labels">
                                                <label className="label label-auto-update">Auto</label>
                                            </div>
                                        : 
                                            null
                                    : 
                                        null
                                }
                                {isSelected ?
                                    <div className="wrapper-auto-update">
                                        Automatic update
                                        <div className={"switch" + (pack.isAutoInstallEnabled ? " switchOn" : "")} id="auto-install-switch" onClick={
                                            toggleTufAutoInstall.bind(this, pack.packageName, device.uuid, pack.isAutoInstallEnabled)
                                        }>
                                        </div>
                                    </div>
                                : 
                                    null
                                }
                            </div>
                        </button>
                        
                    </span>
                :
                    <span>
                        <button className="item unmanaged" id={"button-package-" + pack.hash} onClick={showPackageDetails.bind(this, 'unmanaged')}>
                            <div className="filepath">
                                Filepath: {pack.filepath}
                            </div>
                            <div className="filepath">
                                Size: {pack.size}
                            </div>
                            <div className="hash">
                                Hash: {pack.hash}
                            </div>
                        </button>
                    </span>
            }
            </span>
        );
    }
}

ListItem.propTypes = {
    pack: PropTypes.object.isRequired,
    device: PropTypes.object.isRequired,
    queuedPackage: PropTypes.string,
    installedPackage: PropTypes.string,
    isSelected: PropTypes.bool.isRequired,
    togglePackage: PropTypes.func.isRequired,
    toggleTufAutoInstall: PropTypes.func.isRequired,
    showPackageDetails: PropTypes.func.isRequired,
}

export default ListItem;