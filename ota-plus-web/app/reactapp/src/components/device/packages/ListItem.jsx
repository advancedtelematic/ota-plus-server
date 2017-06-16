import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

@observer
class ListItem extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { pack, deviceId, queuedPackage, installedPackage, blacklistedAndInstalled, isSelected, isAutoInstallEnabled, toggleAutoInstall, togglePackage } = this.props;
        return (
            <span className="wrapper-item">
                <button className="item" id={"button-package-" + pack.packageName} onClick={togglePackage.bind(this, pack.packageName)}>
                    {pack.packageName}
                    {!isSelected ?
                        blacklistedAndInstalled ?
                            pack.isAutoInstallEnabled ?
                                <div className="labels">
                                    <label className="label label-auto-update">Auto</label>
                                    <label className="label label-package-blacklisted">Blacklisted</label>
                                </div>
                            :
                                <div className="labels">
                                    <label className="label label-package-blacklisted">Blacklisted</label>
                                </div>
                        :
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
                </button>
                {isSelected ?
                    <div className="wrapper-auto-update">
                        Automatic update
                        <div className={"switch" + (pack.isAutoInstallEnabled ? " switchOn" : "")} onClick={toggleAutoInstall.bind(this, pack.packageName, deviceId, pack.isAutoInstallEnabled)}>
                            <div className="switch-status">
                                {pack.isAutoInstallEnabled ?
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
    pack: PropTypes.object.isRequired,
    deviceId: PropTypes.string.isRequired,
    queuedPackage: PropTypes.string,
    installedPackage: PropTypes.string,
    isSelected: PropTypes.bool.isRequired,
    togglePackage: PropTypes.func.isRequired,
    toggleAutoInstall: PropTypes.func.isRequired
}

export default ListItem;