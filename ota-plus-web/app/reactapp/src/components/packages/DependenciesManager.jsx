import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import _ from 'underscore';
import { Modal } from '../../partials';

@observer
class DependenciesManager extends Component {
    @observable obj = {};

    constructor(props) {
        super(props);
        this.obj = {
            name: props.activePackage.filepath,
            required: [],
            incompatibles: [],
            requiredBy: []
        };
    }
    componentWillMount() {
        const { activePackage } = this.props;
        let pack = localStorage.getItem(activePackage.filepath);
        if(pack) {
            pack = JSON.parse(pack);
            this.obj = pack;
        }
    }
    getItemFromStorage(version) {
        return JSON.parse(localStorage.getItem(version));
    }
    addVersion(version) {
        const { activePackage, packagesStore } = this.props;

        let relatedItem = {
            name: version,
            required: [],
            incompatibles: [],
            requiredBy: []
        };

        if(_.indexOf(this.obj.required, version) > -1) {
            this.obj.incompatibles.push(version);
            this.obj.required.splice(_.indexOf(this.obj.required, version), 1);

            let itemFromStorage = this.getItemFromStorage(version);

            if(itemFromStorage) {
                itemFromStorage.incompatibles.push(activePackage.filepath);
                itemFromStorage.requiredBy.splice(_.indexOf(itemFromStorage.requiredBy, version), 1);
                localStorage.setItem(version, JSON.stringify(itemFromStorage));
            } else {
                relatedItem.incompatibles.push(activePackage.filepath);
                relatedItem.requiredBy.splice(_.indexOf(relatedItem.requiredBy, version), 1);
                localStorage.setItem(version, JSON.stringify(relatedItem));
            }

            localStorage.setItem(activePackage.filepath, JSON.stringify(this.obj));
        } else if(_.indexOf(this.obj.incompatibles, version) > -1) {
            this.obj.incompatibles.splice(_.indexOf(this.obj.incompatibles, version), 1);

            let itemFromStorage = this.getItemFromStorage(version);
            if(itemFromStorage) {
                itemFromStorage.incompatibles.splice(_.indexOf(itemFromStorage.incompatibles, activePackage.filepath), 1);
                localStorage.setItem(version, JSON.stringify(itemFromStorage));

                if(!itemFromStorage.incompatibles.length && !itemFromStorage.required.length && !itemFromStorage.requiredBy.length) {
                    localStorage.removeItem(version);
                }

            } else {
                relatedItem.incompatibles.splice(_.indexOf(relatedItem.incompatibles, version), 1);

                localStorage.setItem(activePackage.filepath, JSON.stringify(this.obj));
                localStorage.setItem(version, JSON.stringify(relatedItem));

                if(!relatedItem.incompatibles.length && !relatedItem.required.length && !relatedItem.requiredBy.length) {
                    localStorage.removeItem(version);
                }
            }

            if(!this.obj.incompatibles.length && !this.obj.required.length && !this.obj.requiredBy.length) {
                localStorage.removeItem(activePackage.filepath);
            } else {
                localStorage.setItem(activePackage.filepath, JSON.stringify(this.obj));
            }
        } else {
            this.obj.required.push(version);

            let itemFromStorage = this.getItemFromStorage(version);
            if(itemFromStorage) {
                itemFromStorage.requiredBy.push(activePackage.filepath);
                localStorage.setItem(version, JSON.stringify(itemFromStorage));
            } else {
                relatedItem.requiredBy.push(activePackage.filepath);
                localStorage.setItem(version, JSON.stringify(relatedItem));
            }

            localStorage.setItem(activePackage.filepath, JSON.stringify(this.obj));
        }
        
        packagesStore._handleCompatibles();
    }
    render() {
        const { shown, hide, packages, activePackage, packagesStore } = this.props;

        let requiredBy = [];
        _.each(packagesStore.compatibilityData, (data, index) => {
            let found = _.find(data.required, item => item === activePackage.filepath);
            if(found) {
                requiredBy.push(data.name);
            }
        });

        const content = (
            <span>                
                <div className="manager-modal__pack manager-modal__pack--selected" id="current-pack">
                    <div className="manager-modal__pack-name" id={"current-pack-" + activePackage.id.name}>
                        {activePackage.id.name}
                    </div>
                    <div className="manager-modal__pack-version" id={"current-pack-" + activePackage.id.version}>
                        {activePackage.id.version}
                    </div>
                </div>
                <div className="manager-modal__pack-list" id="other-packs-list">
                    {_.map(packages, (packs, letter) => {
                        return _.map(packs, (pack, i) => {
                            return (
                                pack.packageName !== activePackage.id.name ?
                                    <div className="manager-modal__pack" key={i}>
                                        <div className="manager-modal__pack-name manager-modal__pack-name--in-list" id={"other-pack-" + pack.packageName}>
                                            {pack.packageName}
                                        </div>
                                        <div className="manager-modal__pack-versions">
                                            {_.map(pack.versions, (version, index) => {
                                                let versionString = version.filepath;
                                                return (
                                                    version.id.version !== activePackage.id.version ?
                                                        <span className={`manager-modal__pack-item ${index % 2 === 0 ? '' : 'manager-modal__pack-item--odd'}`} key={index}>
                                                            <span className="manager-modal__pack-value"
                                                                  id={"other-pack-" + version.id.version}>
                                                                {version.id.version}
                                                            </span>
                                                            {this.obj.required.indexOf(versionString) > -1 ?
                                                                <span className="manager-modal__pack-status-title" id={"other-pack-mandatory-" + version.id.version}
                                                                      onClick={this.addVersion.bind(this, versionString)}>
                                                                    Mandatory
                                                                    <span className="manager-modal__pack-status manager-modal__pack-status--orange"/>
                                                                </span>
                                                                    : this.obj.incompatibles.indexOf(versionString) > -1 ?
                                                                <span className="manager-modal__pack-status-title" id={"other-pack-incompatible-" + version.id.version}
                                                                      onClick={this.addVersion.bind(this, versionString)}>
                                                                    Not compatible
                                                                    <span className="manager-modal__pack-status manager-modal__pack-status--red"/>
                                                                </span>
                                                                    : requiredBy.indexOf(versionString) > -1 ?
                                                                <span className="manager-modal__pack-status-title" id={"other-pack-required-by-" + version.id.version}>
                                                                    Required by
                                                                    <span className="manager-modal__pack-status manager-modal__pack-status--green"/>
                                                                </span>
                                                                    :
                                                                <span className="manager-modal__pack-status-title" id={"other-pack-not-selected-" + version.id.version}
                                                                      onClick={this.addVersion.bind(this, versionString)}>
                                                                    Edit
                                                                    <span className="manager-modal__pack-status manager-modal__pack-status--white"/>
                                                                </span>
                                                            }                                                                
                                                        </span>
                                                    :
                                                        null
                                                );
                                            })}
                                        </div>
                                    </div>
                                :
                                    null
                            );
                        }); 
                    })}
                </div>
            </span>
        );
        return (
            <Modal 
                title={"Dependencies management"}
                topActions={
                    <div className="top-actions flex-end">
                        <div className="modal-close" onClick={hide}>
                            <img src="/assets/img/icons/close.svg" alt="Icon" />
                        </div>
                    </div>
                }
                content={content}
                shown={shown}
                className="manager-modal"
                hideOnClickOutside={true}
                onRequestClose={hide}
            />
        );
    }
}

export default DependenciesManager;