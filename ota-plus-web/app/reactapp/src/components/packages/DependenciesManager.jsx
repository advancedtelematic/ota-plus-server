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
            name: props.activePackage.imageName,
            required: [],
            incompatibles: [],
        };
    }
    componentWillMount() {
        const { activePackage } = this.props;
        let pack = localStorage.getItem(activePackage.imageName);
        if(pack) {
            pack = JSON.parse(pack);
            this.obj = pack;
        }
    }
    addVersion(version) {
        const { activePackage, packagesStore } = this.props;
        if(_.indexOf(this.obj.required, version) > -1) {
            this.obj.incompatibles.push(version);
            this.obj.required.splice(_.indexOf(this.obj.required, version), 1);            
        } else if(_.indexOf(this.obj.incompatibles, version) > -1) {
            this.obj.incompatibles.splice(_.indexOf(this.obj.required, version), 1);
        } else {
            this.obj.required.push(version);
        }
        localStorage.setItem(activePackage.imageName, JSON.stringify(this.obj));
        packagesStore._handleCompatibles();
    }
    render() {
        const { shown, hide, packages, activePackage, packagesStore } = this.props;

        let requiredBy = [];
        _.each(packagesStore.compatibilityData, (data, index) => {
            let found = _.find(data.required, item => item === activePackage.imageName);
            if(found) {
                requiredBy.push(data.name);
            }
        });

        const content = (
            <span>
                <a href="#" id="close-manager" className="close-manager" title="Close sankey" onClick={hide.bind(this)}>
                    <img src="/assets/img/icons/white/cross.svg" alt="Icon" />
                </a>
                <div className="content">
                    <section className="head">
                        <div className="name">
                            Name
                        </div>
                        <div className="version">
                            Version
                        </div>
                    </section>
                    <section className="current-pack" id="current-pack">
                        <div className="name" id={"current-pack-" + activePackage.id.name}>
                            {activePackage.id.name}
                        </div>
                        <div className="version" id={"current-pack-" + activePackage.id.version}>
                            {activePackage.id.version}
                        </div>
                    </section>
                    <div className="other-packs-list" id="other-packs-list">
                        {_.map(packages, (packs, letter) => {
                            return _.map(packs, (pack, i) => {
                                return (
                                    pack.packageName !== activePackage.id.name ?
                                        <section className="other-pack" key={i}>
                                            <div className="name" id={"other-pack-" + pack.packageName}>
                                                {pack.packageName}
                                            </div>
                                            <div className="versions">
                                                {_.map(pack.versions, (version, index) => {
                                                    let versionString = version.imageName;
                                                    return (
                                                        version.id.version !== activePackage.id.version ?
                                                            <span className="item" key={index}>
                                                                <span className="value" id={"other-pack-" + version.id.version}>
                                                                    {version.id.version}
                                                                </span>
                                                                {this.obj.required.indexOf(versionString) > -1 ?
                                                                    <span className="label orange"
                                                                          id={"other-pack-mandatory-" + version.id.version}
                                                                          onClick={this.addVersion.bind(this, versionString)}>
                                                                          Mandatory
                                                                    </span>
                                                                : this.obj.incompatibles.indexOf(versionString) > -1 ?
                                                                    <span className="label red"
                                                                          id={"other-pack-incompatible-" + version.id.version}
                                                                          onClick={this.addVersion.bind(this, versionString)}>
                                                                          Not compatible
                                                                    </span>
                                                                : requiredBy.indexOf(versionString) > -1 ?
                                                                    <span className="label green"
                                                                          id={"other-pack-required-by-" + version.id.version}
                                                                          >
                                                                          Required by
                                                                    </span>
                                                                :
                                                                    <span className="label"
                                                                          id={"other-pack-not-selected-" + version.id.version}
                                                                          onClick={this.addVersion.bind(this, versionString)}>
                                                                    </span>
                                                                }                                                                
                                                            </span>
                                                        :
                                                            null
                                                    );
                                                })}
                                            </div>
                                        </section>
                                    :
                                        null
                                );
                            }); 
                        })}
                    </div>
                </div>
                <div className="footer">
                    <a href="#" onClick={hide.bind(this)} className="link-cancel" id="link-close">Close</a>
                </div>
            </span>
        );
        return (
            <Modal 
                title="Dependencies management"
                content={content}
                shown={shown}
                className="dependencies-manager-modal"
                hideOnClickOutside={true}
                onRequestClose={hide}
            />
        );
    }
}

export default DependenciesManager;