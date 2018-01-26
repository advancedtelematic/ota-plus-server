import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import _ from 'underscore';
import { Modal } from '../../partials';

@observer
class DependenciesManager extends Component {
    @observable required = [];
    @observable incompatibles = [];

    constructor(props) {
        super(props);
    }
    addVersion(version) {
        if(this.required.indexOf(version) > -1) {
            this.incompatibles.push(version);
            this.required.splice(this.required.indexOf(version), 1);
        } else if(this.incompatibles.indexOf(version) > -1) {
            this.incompatibles.splice(this.incompatibles.indexOf(version), 1);
        } else {
            this.required.push(version);
        }
    }
    componentWillUnmount() {
        if(this.required.length) {
            let currentRequired = JSON.parse(localStorage.getItem(this.props.activePackage.imageName + "-required"));
            if(currentRequired) {
                _.each(this.required, (item, i) => {
                    if(currentRequired.indexOf(item) === -1) {
                        currentRequired.push(item);
                    }
                });
                localStorage.setItem(this.props.activePackage.imageName + "-required", JSON.stringify(currentRequired));
            } else {
                localStorage.setItem(this.props.activePackage.imageName + "-required", JSON.stringify(this.required));
            }
        }
        if(this.incompatibles.length) {
            let currentIncompatibles = JSON.parse(localStorage.getItem(this.props.activePackage.imageName + "-incompatibles"));
            if(currentIncompatibles) {
                _.each(this.incompatibles, (item, i) => {
                    if(currentIncompatibles.indexOf(item) === -1) {
                        currentIncompatibles.push(item);
                    }
                });
                localStorage.setItem(this.props.activePackage.imageName + "-incompatibles", JSON.stringify(currentIncompatibles));
            } else {
                localStorage.setItem(this.props.activePackage.imageName + "-incompatibles", JSON.stringify(this.incompatibles));
            }
        }
    }
    render() {
        const { shown, hide, packages, activePackage } = this.props;
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
                    <section className="current-pack">
                        <div className="name">
                            {activePackage.id.name}
                        </div>
                        <div className="version">
                            {activePackage.id.version}
                        </div>
                    </section>
                    <div className="other-packs-list">
                        {_.map(packages, (packs, letter) => {
                            return _.map(packs, (pack, i) => {
                                return (
                                    pack.packageName === activePackage.id.name && pack.versions.length === 1 ?
                                        null
                                    :
                                        <section className="other-pack" key={i}>
                                            <div className="name">
                                                {pack.packageName}
                                            </div>
                                            <div className="versions">
                                                {_.map(pack.versions, (version, index) => {
                                                    let versionString = version.imageName;
                                                    return (
                                                        version.id.version !== activePackage.id.version ?
                                                            <span className="item" key={index}>
                                                                <span 
                                                                    className={"circle" + (this.required.indexOf(versionString) > -1 ? " green" : this.incompatibles.indexOf(versionString) > -1 ? " red" : "")} 
                                                                    onClick={this.addVersion.bind(this, versionString)}>
                                                                </span>
                                                                <span className="value">
                                                                    {version.id.version}
                                                                </span>
                                                            </span>
                                                        :
                                                            null
                                                    );
                                                })}
                                            </div>
                                        </section>
                                );
                            }); 
                        })}
                    </div>                    
                </div>
                <div className="footer">
                    <a href="#" onClick={hide.bind(this)} className="link-cancel">Close</a>
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