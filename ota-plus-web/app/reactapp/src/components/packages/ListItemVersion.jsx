import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import moment from 'moment';
import _ from 'underscore';
import { FlatButton } from 'material-ui';
import { Dropdown } from '../../partials';

@observer
class ListItemVersion extends Component {
    @observable showSubmenu = false;
    constructor(props) {
        super(props);
        this.toggleSubmenu = this.toggleSubmenu.bind(this);
    }
    toggleSubmenu() {
        this.showSubmenu = !this.showSubmenu;
    }
    render() {
        const { version, showDependenciesModal, showDependenciesManager, packagesStore, alphaPlusEnabled, showDeleteConfirmation, showEditComment } = this.props;
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
                <div className="c-package__sw-box">
                    <div className="c-package__heading">
                        Version
                    </div>
                    <div className="c-package__sw-wrapper">
                        {version.customExists ? 
                            <span>
                                <div className="c-package__sw-row">
                                    <span className="c-package__sw-subtitle">Version:</span>
                                    <span className="c-package__sw-value" id={"package-" + packageName + "-version-" + version.id.version.substring(0,8)}>{version.id.version}</span>
                                </div>                                 
                                <div className="c-package__sw-row">
                                    <span className="c-package__sw-subtitle">Created at:</span>
                                    <span className="c-package__sw-value" id={"package-" + packageName + "-created-at-" + version.id.version.substring(0,8)}>
                                        {moment(version.createdAt).format("ddd MMM DD YYYY, h:mm:ss A")}
                                    </span>
                                </div>
                                <div className="c-package__sw-row">
                                    <span className="c-package__sw-subtitle">Updated at:</span>
                                    <span className="c-package__sw-value" id={"package-" + packageName + "-updated-at-" + version.id.version.substring(0,8)}>
                                        {moment(version.updatedAt).format("ddd MMM DD YYYY, h:mm:ss A")}
                                    </span>
                                </div>
                                <div className="c-package__sw-row">
                                    <span className="c-package__sw-subtitle">Hash:</span>
                                    <span className="c-package__sw-value" id={"package-" + packageName + "-hash-" + version.id.version.substring(0,8)}>
                                        {version.packageHash}
                                    </span>
                                </div>
                                <div className="c-package__sw-row">
                                    <span className="c-package__sw-subtitle">Length:</span>
                                    <span className="c-package__sw-value" id={"package-" + packageName + "-target-length-" + version.id.version.substring(0,8)}>{version.targetLength}</span>
                                </div>
                            </span>
                        :
                            <span>
                                <div className="c-package__sw-row">
                                    <span className="c-package__sw-subtitle">Hash:</span>
                                    <span className="c-package__sw-value" id={"package-" + packageName + "-hash-" + version.id.version.substring(0,8)}>{version.packageHash}</span>
                                </div>
                                <div className="c-package__sw-row">
                                    <span className="c-package__sw-subtitle">Length:</span>
                                    <span className="c-package__sw-value" id={"package-" + packageName + "-target-length-" + version.id.version.substring(0,8)}>{version.targetLength}</span>
                                </div>
                            </span>
                        }
                    </div>
                    <div className="c-package__sw-wrapper">
                         <div className="c-package__hw-row">
                            Installed on <span id={"package-" + packageName + "-installed-on-ecus-count-" + version.id.version.substring(0,8)}>{version.installedOnEcus}</span> ECU(s)
                        </div>
                    </div>
                    <div className="c-package__sw-wrapper">
                        <div className="c-package__hw-row">
                            <div className="c-package__subheading">
                                Hardware ids:
                            </div>
                            <div className="c-package__hw-value">
                                {_.map(version.hardwareIds, (hardwareId, index) => {
                                    return (
                                        <span className="app-label" key={index} id={"package-" + packageName + '-app-label-' + version.id.version.substring(0,8)}>
                                            {hardwareId}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    {version.targetFormat ?
                        <div className="c-package__sw-wrapper">
                            <div className="c-package__hw-row">
                                <div className="c-package__sw-subtitle">
                                    Format:
                                </div>
                                <div className="c-package__hw-value">
                                    <span className="app-label" id={"package-" + packageName + "-app-format-" + version.id.version.substring(0,8)}>
                                        {version.targetFormat}
                                    </span>
                                </div>
                            </div>
                           
                        </div>
                    :
                        null
                    }
                </div>
                <div className="c-package__inner-box" >
                    <div className="c-package__comment">
                        <div className="c-package__heading">
                            Comment
                        </div>
                        {version.comment}
                    </div>
                    {alphaPlusEnabled ?
                        <div className="c-package__manager">
                             <div className="c-package__heading">
                                Dependencies
                             </div>
                             <div className="c-package__manager-content">

                                {versionCompatibilityData && versionCompatibilityData.required.length ?
                                <div className="c-package__relations" id="required">
                                    <div className="c-package__heading">
                                        Required
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
                             </div>                            
                        </div>
                    :
                        null
                    }
                </div>
                <div className="dots" onClick={this.toggleSubmenu}>
                    <span></span>
                    <span></span>
                    <span></span>

                    <Dropdown show={this.showSubmenu} hideHandler={() => {this.showSubmenu = false}}>
                        <li className="package-dropdown-item">
                            <a className="package-dropdown-item" href="#" id="edit-comment"
                               onClick={showEditComment.bind(this, version.filepath, version.comment)}>
                                Edit comment
                            </a>
                        </li>
                        {alphaPlusEnabled ?
                            <li className="package-dropdown-item">
                                <a className="package-dropdown-item" href="#" id="show-dependencies"
                                   onClick={showDependenciesManager.bind(this, version)}>
                                    Edit dependencies
                                </a>
                            </li>
                        :
                            null
                        }
                    </Dropdown>
                </div>
            </span>
        );
        return (
            <span>
                <li className="c-package__version-item"
                    data-installed={version.installedOnEcus}
                    style={borderStyle}
                    id={"package-" + packageName + "-version"}>
                    {directorBlock}
                </li>
            </span>
        );
    }
}

ListItemVersion.propTypes = {
    version: PropTypes.object.isRequired,
    packagesStore: PropTypes.object.isRequired
}

export default ListItemVersion;