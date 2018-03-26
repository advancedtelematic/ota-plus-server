import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import moment from 'moment';
import _ from 'underscore';
import { FlatButton } from 'material-ui';

@observer
class ListItemVersion extends Component {
    constructor(props) {
        super(props);
    }
    openBlacklistModal(mode, e) {
        this.props.showBlacklistModal(this.props.version.id.name, this.props.version.id.version, mode);
    }
    isPackageBlacklisted(version) {
        let isPackageBlacklisted = _.find(this.props.packagesStore.blacklist, (dev) => {
            return (dev.packageId.name === version.id.name) && (dev.packageId.version === version.id.version);
        });
        return isPackageBlacklisted ? isPackageBlacklisted : false;
    }
    render() {
        const { version, showDependenciesModal, showDependenciesManager, packagesStore, alphaPlusEnabled } = this.props;
        let isBlacklisted = this.isPackageBlacklisted(version);
        let packageName = version.id.name;
        let borderStyle = {
            borderLeft: '10px solid #e1e1e1'
        };
        if(version.installedOnEcus > 0) {
            borderStyle = {
                borderLeft: '10px solid ' + version.color
            };
        }
        let versionCompatibilityData = null;
        if(alphaPlusEnabled) {
            versionCompatibilityData = _.find(packagesStore.compatibilityData, item => item.name === version.filepath);
        }

        const directorBlock = (
            <span>
                <div className="c-package__software-box" style={borderStyle}>
                    {version.customExists ? 
                        <span>
                            <div className="c-package__sw-row c-package__sw-row--version" id={"package-" + packageName + "-version"}>
                                <span className="c-package__sw-subtitle">Version:</span>
                                <span className="c-package__sw-value">{version.id.version}</span>
                            </div>                                 
                            <div className="c-package__sw-row" id={"package-" + packageName + "-created_at"}>
                                <span className="c-package__sw-subtitle">Created at:</span>
                                <span className="c-package__sw-value">{moment(version.createdAt).format("ddd MMM DD YYYY, h:mm:ss A")}</span>
                            </div>
                            <div className="c-package__sw-row" id={"package-" + packageName + "-updated_at"}>
                                <span className="c-package__sw-subtitle">Updated at:</span>
                                <span className="c-package__sw-value">{moment(version.updatedAt).format("ddd MMM DD YYYY, h:mm:ss A")}</span>
                            </div>
                            <div className="c-package__sw-row" id={"package-" + packageName + "-hash"}>
                                <span className="c-package__sw-subtitle">Hash:</span>
                                <span className="c-package__sw-value">{version.packageHash}</span>
                            </div>
                            <div className="c-package__sw-row" id={"package-" + packageName + "-target-length"}>
                                <span className="c-package__sw-subtitle">Length:</span>
                                <span className="c-package__sw-value">{version.targetLength}</span>
                            </div>
                        </span>
                    :
                        <span>
                            <div className="c-package__sw-row" id={"package-" + packageName + "-hash"}>
                                <span className="c-package__sw-subtitle">Hash:</span>
                                <span className="c-package__sw-value">{version.packageHash}</span>
                            </div>
                            <div className="c-package__sw-row" id={"package-" + packageName + "-target-length"}>
                                <span className="c-package__sw-subtitle">Length:</span>
                                <span className="c-package__sw-value">{version.targetLength}</span>
                            </div>
                        </span>
                    }
                </div>
                <div className="c-package__hardware-box">
                    <div className="c-package__hw-row c-package__hw-row--installed" id={"package-" + packageName + "-ecus-installed"}>
                        <span id={"version-" + version.id.version.substring(0,8) + "-installed-on-ecus"}>
                            Installed on <span id={"version-" + version.id.version.substring(0,8) + "-installed-on-ecus-count"}>{version.installedOnEcus}</span> ECU(s)
                        </span>
                    </div>
                    <div className="c-package__hw-row c-package__hw-row--hardware-ids" id={"package-" + packageName + "-hardware_ids"}>
                        <div className="c-package__heading c-package__heading--strict">
                            Hardware ids:
                        </div>
                        <div className="c-package__hw-value">
                            {_.map(version.hardwareIds, (hardwareId, index) => {
                                return (
                                    <span className="app-label" key={index} id={"package-" + packageName + `-app-label`}>
                                        {hardwareId}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                    {version.targetFormat ?
                        <div className="c-package__hw-row c-package__hw-row--format" id={"package-" + packageName + "-target_format"}>
                            <div className="c-package__heading c-package__heading--strict">
                                Format:
                            </div>
                            <div className="c-package__hw-value">
                                <span className="app-label" id={"package-" + packageName + "-app-format-ostree"}>
                                    {version.targetFormat}
                                </span>
                            </div>
                        </div>
                    :
                        null
                    }                                   
                </div>
                <div className="c-package__show-dependencies">
                    <a href="#" className="add-button" id="show-dependencies" onClick={showDependenciesModal.bind(this, version.filepath)}>
                        <span>
                            Show dependencies
                        </span>
                    </a>
                </div>                
            </span>
        );
        return (
            <span>
                <li className={"c-package__version-item" + (!alphaPlusEnabled ? " c-package__version-item--ident" : "") + (isBlacklisted ? " blacklist" : "")} id={"package-" + packageName + "-version"}>
                    {directorBlock}
                </li>
                {alphaPlusEnabled ?
                    <div className={"c-package__manager" + 
                                   (_.isEmpty(borderStyle) ? " c-package__manager--full" : "") + 
                                   (versionCompatibilityData ? " c-package__manager--aligned" : "")}>
                        {versionCompatibilityData && versionCompatibilityData.required.length ?
                            <div className="c-package__relations" id="required">
                                <div className="c-package__heading">
                                    Requires:
                                </div>
                                {_.map(versionCompatibilityData.required, (filepath, i) => {
                                    let pack = _.find(packagesStore.packages, item => item.filepath === filepath);
                                    return (
                                        <div className="c-package__relation-item" key={i}>
                                            <span className="c-package__relation-name" id={"required-" + pack.id.name}>
                                                {pack.id.name}
                                            </span>
                                            <span className="c-package__relation-version" id={"required-" + pack.id.version}>
                                                {pack.id.version}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        :
                            null}
                        {versionCompatibilityData && versionCompatibilityData.incompatibles.length ?
                            <div className="c-package__relations" id="not-compatible">
                                <div className="c-package__heading">
                                    Not compatible:
                                </div>
                                {_.map(versionCompatibilityData.incompatibles, (filepath, i) => {
                                    let pack = _.find(packagesStore.packages, item => item.filepath === filepath);
                                    return (
                                        <div className="c-package__relation-item" key={i}>
                                            <span className="c-package__relation-name" id={"not-compatible-" + pack.id.name}>
                                                {pack.id.name}
                                            </span>
                                            <span className="c-package__relation-version" id={"not-compatible-" + pack.id.version}>
                                                {pack.id.version}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        :
                            null}
                        {versionCompatibilityData && versionCompatibilityData.requiredBy.length ?
                            <div className="c-package__relations" id="required-by">
                                <div className="c-package__heading">
                                    Required by:
                                </div>
                                {_.map(versionCompatibilityData.requiredBy, (filepath, i) => {
                                    let pack = _.find(packagesStore.packages, item => item.filepath === filepath);
                                    return (
                                        <div className="c-package__relation-item" key={i}>
                                            <span className="c-package__relation-name" id={"required-by-" + pack.id.version}>
                                                {pack.id.name}
                                            </span>
                                            <span className="c-package__relation-version" id={"required-by-" + pack.id.version}>
                                                {pack.id.version}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        :
                            null
                        }
                        {versionCompatibilityData ?
                            <div className="c-package__manage-dependencies c-package__manage-dependencies--small">
                                <a href="#" id="edit-dependencies" className="add-button" onClick={showDependenciesManager.bind(this, version)}>
                                    <span>
                                        Edit
                                    </span>
                                </a>
                            </div>
                        :
                            <div className="c-package__manage-dependencies">
                                <a href="#" id="add-dependencies" className="add-button" onClick={showDependenciesManager.bind(this, version)}>
                                    <span>
                                        Manage dependencies
                                    </span>
                                </a>
                            </div>
                        }
                        
                    </div>
                : 
                    null
                }
            </span>
        );
    }
}

ListItemVersion.propTypes = {
    version: PropTypes.object.isRequired,
    showBlacklistModal: PropTypes.func.isRequired,
    packagesStore: PropTypes.object.isRequired
}

export default ListItemVersion;