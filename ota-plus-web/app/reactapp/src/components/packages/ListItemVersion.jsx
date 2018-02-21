import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import moment from 'moment';
import _ from 'underscore';
import { FlatButton } from 'material-ui';

@observer
class ListItemVersion extends Component {
    @observable activeEditField = false;
    @observable showEditButton = false;
    @observable commentFieldLength = 0;
    @observable comment = null;
    @observable commentTmp = null;

    constructor(props) {
        super(props);
        this.enableEditField = this.enableEditField.bind(this);
        this.disableEditField = this.disableEditField.bind(this);
        this.changeCommentFieldLength = this.changeCommentFieldLength.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentWillMount() {
        this.comment = this.props.version.description;
        this.commentTmp = this.props.version.description;
    }
    componentWillReceiveProps(nextProps) {
        this.comment = nextProps.version.description;
        this.commentTmp = nextProps.version.description;
    }
    enableEditField(e) {
        e.preventDefault();
        this.activeEditField = true;
        this.changeCommentFieldLength();
    }
    disableEditField(e) {
        e.preventDefault();
        let that = this;
        setTimeout(function(){
            if(document.activeElement.className.indexOf('accept-button') == -1) {
                that.activeEditField = false;
                that.commentTmp = that.comment;
            }
        }, 1);
    }
    changeCommentFieldLength() {
        var val = this.refs.comment.value;
        this.commentFieldLength = val.length;
        this.commentTmp = val;
    }
    handleSubmit(e) {
        e.preventDefault();
        this.comment = this.refs.comment.value;
        this.commentTmp = this.refs.comment.value;
        this.activeEditField = false;
        const data = {
            name: this.props.version.id.name,
            version: this.props.version.id.version,
            details: {
                description: this.refs.comment.value
            }
        };
        this.props.packagesStore.updatePackageDetails(data);
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
        let borderStyle = {};
        if(version.installedOnEcus > 0) {
            borderStyle = {
                borderLeft: '10px solid ' + version.color,
            };
        }
        let compatibilityData = packagesStore.compatibilityData;
        let versionCompatibilityData = _.find(compatibilityData, item => item.name === version.imageName);
        let requiredBy = [];
        _.each(compatibilityData, (data, index) => {
            let found = _.find(data.required, item => item === version.imageName);
            if(found) {
                requiredBy.push(data.name);
            }
        });
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
                        <span id={"version-" + version.id.version + "-installed-on-ecus"}>
                            Installed on <span id={"version-" + version.id.version + "-installed-on-ecus-count"}>{version.installedOnEcus}</span> ECU(s)
                        </span>
                    </div>
                    <div className="c-package__hw-row c-package__hw-row--hardware-ids" id={"package-" + packageName + "-hardware_ids"}>
                        <div className="c-package__heading c-package__heading--strict">
                            Hardware ids:
                        </div>
                        <div className="c-package__hw-value">
                            {_.map(version.hardwareIds, (hardwareId, index) => {
                                return (
                                    <span className="c-package__label" key={index} id={"package-" + packageName + "-hardware-label"}>
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
                                <span className="c-package__label" id={"package-" + packageName + "-format-label"}>
                                    {version.targetFormat}
                                </span>
                            </div>
                        </div>
                    :
                        null
                    }                                   
                </div>
                <div className="c-package__show-dependencies">
                    <div className="c-package__dependencies-icon" title="Show dependencies" onClick={showDependenciesModal.bind(this, version.imageName)}></div>
                </div>                
            </span>
        );
        const legacyBlock = (
            <span>
                <div className="left-box">
                    <span>
                        <input 
                            className="input-comment" 
                            name="comment" 
                            value={this.commentTmp} 
                            type="text" 
                            placeholder="Comment here." 
                            ref="comment" 
                            onKeyUp={this.changeCommentFieldLength} 
                            onChange={this.changeCommentFieldLength} 
                            onFocus={this.enableEditField} />
                            {this.commentFieldLength > 0 && this.activeEditField ?
                                <div className="action-buttons">
                                    <a href="#" className="cancel-button" onClick={this.disableEditField}>
                                        <img src="/assets/img/icons/close_icon.png" alt="" />
                                    </a>
                                    &nbsp;
                                    <a href="#" className="accept-button" onClick={this.handleSubmit}>
                                        <img src="/assets/img/icons/accept_icon.png" alt="" />
                                    </a>
                                </div>
                            : 
                                ''
                            }
                    </span>
                </div>
                <div className="right-box">
                    <span title={version.id.version} className="version-name">
                        {version.id.version}
                    </span>
                    {isBlacklisted ?
                        <button 
                            className="btn-blacklist edit" 
                            onClick={this.openBlacklistModal.bind(this, 'edit')} 
                            title="Edit blacklisted package version" 
                            id={"button-edit-blacklisted-package-" + packageName + "-" + version.id.version}>
                        </button>
                    : 
                        <button 
                            className="btn-blacklist" 
                            onClick={this.openBlacklistModal.bind(this, 'add')} 
                            title="Blacklist package version" 
                            id={"button-blacklist-package-" + packageName + "-" + version.id.version}>
                        </button>
                    }
                </div>
            </span>
        );        
        return (
            <span>
                <li className={"c-package__version-item" + (!alphaPlusEnabled ? " c-package__version-item--ident" : "") + (isBlacklisted ? " blacklist" : "")} id={"package-" + packageName + "-version"}>
                    {version.inDirector ?
                        directorBlock
                    :
                        legacyBlock
                    }
                </li>
                {alphaPlusEnabled ?
                    <div className={"c-package__manager" + 
                                   (_.isEmpty(borderStyle) ? " c-package__manager--full" : "") + 
                                   (versionCompatibilityData || requiredBy.length ? " c-package__manager--aligned" : "")}>
                        {versionCompatibilityData && versionCompatibilityData.required.length ?
                            <div className="c-package__relations" id="required">
                                <div className="c-package__heading">
                                    Requires:
                                </div>
                                {_.map(versionCompatibilityData.required, (filepath, i) => {
                                    let pack = _.find(packagesStore.directorPackages, item => item.imageName === filepath);
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
                                    let pack = _.find(packagesStore.directorPackages, item => item.imageName === filepath);
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
                        {requiredBy.length ?
                            <div className="c-package__relations" id="required-by">
                                <div className="c-package__heading">
                                    Required by:
                                </div>
                                {_.map(requiredBy, (filepath, i) => {
                                    let pack = _.find(packagesStore.directorPackages, item => item.imageName === filepath);
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
                            null}
                        {versionCompatibilityData ?
                            <div className="c-package__manage-dependencies c-package__manage-dependencies--small">
                                <FlatButton
                                    label="Edit"
                                    onClick={showDependenciesManager.bind(this, version)}
                                    className="btn-main btn-small"
                                    id="edit-dependencies"
                                />
                            </div>
                        :
                            <div className="c-package__manage-dependencies">
                                <FlatButton
                                    label="Manage dependencies"
                                    onClick={showDependenciesManager.bind(this, version)}
                                    className="btn-main btn-small"
                                    id="add-dependencies"
                                />
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