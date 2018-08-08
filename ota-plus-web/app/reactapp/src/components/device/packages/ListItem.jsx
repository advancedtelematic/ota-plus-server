import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

@observer
class ListItem extends Component {
    render() {
        const { pack, device, queuedPackage, installedPackage, isSelected, togglePackage, toggleTufAutoInstall, showPackageDetails } = this.props;
        return (
            !pack.unmanaged ?
                <span>
                    <div className={"software-panel__item" + (isSelected ? " software-panel__item--selected": "")} id={"button-package-" + pack.packageName} onClick={togglePackage.bind(this, pack.packageName)}>
                        <div className="software-panel__item-left">
                            <div className="software-panel__item-name">
                                {pack.packageName}
                            </div>
                            <div className="software-panel__item-versions-nr" id="package-versions-nr">
                                {pack.versions.length === 1 ?
                                    pack.versions.length + " version"
                                :
                                    pack.versions.length + " versions"
                                }
                            </div>
                        </div>
                        <div className="software-panel__item-right">
                            {!isSelected ?
                                queuedPackage ?
                                    <span>
                                        {pack.isAutoInstallEnabled ?
                                            <div className="software-panel__labels">
                                                <div className="software-panel__label software-panel__label--auto-update">Auto</div>
                                                <div className="software-panel__label software-panel__label--queued">Queued</div>
                                            </div>
                                        : 
                                            <div className="software-panel__labels">
                                                <div className="software-panel__label software-panel__label--queued">Queued</div>
                                            </div>
                                        }
                                    </span>
                                :
                                installedPackage ?
                                    pack.isAutoInstallEnabled ?
                                        <div className="software-panel__labels">
                                            <div className="software-panel__label software-panel__label--auto-update">Auto</div>
                                            <div className="software-panel__label software-panel__label--installed">Installed</div>
                                        </div>
                                    :
                                        <div className="software-panel__labels">
                                            <div className="software-panel__label software-panel__label--installed">Installed</div>
                                        </div>
                                :
                                pack.isAutoInstallEnabled ?
                                        <div className="software-panel__labels">
                                            <div className="software-panel__label software-panel__label--auto-update">Auto</div>
                                        </div>
                                    : 
                                        null
                                : 
                                    null
                            }
                            {isSelected ?
                                <div className="software-panel__auto-update">
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
                    </div>
                    
                </span>
            :
                <span>
                    <div className="software-panel__item-unmanaged" id={"button-package-" + pack.hash} onClick={showPackageDetails.bind(this, 'unmanaged')}>
                        <div className="software-panel__item-unmanaged-left">
                            <div className="software-panel__item-unmanaged-block">
                                <span className="software-panel__item-unmanaged-subtitle">
                                    Filepath:
                                </span>
                                <span className="software-panel__item-unmanaged-value">
                                    {pack.filepath}
                                </span>
                            </div>
                            <div className="software-panel__item-unmanaged-block">
                                <span className="software-panel__item-unmanaged-subtitle">
                                    Size:
                                </span>
                                <span className="software-panel__item-unmanaged-value">
                                    {pack.size}
                                </span>
                            </div>
                            <div className="software-panel__item-unmanaged-block">
                                <span className="software-panel__item-unmanaged-subtitle">
                                    Hash:
                                </span>
                                <span className="software-panel__item-unmanaged-value">
                                    {pack.hash}
                                </span>
                            </div>
                        </div>
                    </div>
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