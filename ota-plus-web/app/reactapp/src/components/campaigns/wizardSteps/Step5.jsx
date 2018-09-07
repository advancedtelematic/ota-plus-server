import React, { Component, PropTypes } from 'react';
import { observer, inject } from 'mobx-react';
import { observable, extendObservable } from 'mobx';
import _ from 'underscore';
import { SelectField, MenuItem } from 'material-ui';
import { Loader, Form, FormSelect, FormInput } from '../../../partials';
import { FlatButton } from 'material-ui';

@inject('stores')
@observer
class WizardStep5 extends Component {
    @observable blocks = [];
    @observable isLoading = false;

    constructor(props) {
        super(props);
        this.addBlock = this.addBlock.bind(this);
        this.formatVersions = this.formatVersions.bind(this);
        this.getPackVersions = this.getPackVersions.bind(this);
        this.onParentVersionChange = this.onParentVersionChange.bind(this);
    }

    componentWillMount() {
        const { markStepAsFinished } = this.props;
        markStepAsFinished();
        /*let chosenVersions = wizardData[2].versions;
        _.each(chosenVersions, (values, packName) => {
            let obj = {
                packName: packName,
                filepath: values.toFilepath
            };
            this.checkVersion(obj);
        });*/
    }

    checkVersion(data) {
        const { wizardData } = this.props;
        const { packagesStore } = this.props.stores;

        let chosenVersions = wizardData[2].versions;
        let objWithRelations = JSON.parse(localStorage.getItem(data.filepath));
        if (objWithRelations) {
            let requiredPackages = objWithRelations.required;
            let incompatiblePackages = objWithRelations.incompatibles;
            if (requiredPackages) {
                _.each(requiredPackages, (filepath, index) => {
                    let skipAdd = false;
                    _.each(chosenVersions, (values, pName) => {
                        if (values.toFilepath === filepath) {
                            skipAdd = true;
                        }
                    });
                    if (!skipAdd) {
                        let childPack = _.find(packagesStore.packages, pack => pack.filepath === filepath);
                        let obj = {
                            parentPack: data.packName,
                            parentFilepath: data.filepath,
                            childPack: childPack.id.name,
                            childRequiredVersion: childPack.id.version,
                            isCompatible: true
                        };
                        this.addBlock(obj);
                    }
                });
            }
            if (incompatiblePackages) {
                _.each(incompatiblePackages, (filepath, index) => {
                    let isTryingToInstall = false;
                    _.each(chosenVersions, (values, pName) => {
                        if (values.toFilepath === filepath) {
                            isTryingToInstall = true;
                        }
                    });
                    if (isTryingToInstall) {
                        let childPack = _.find(packagesStore.packages, pack => pack.filepath === filepath);
                        let obj = {
                            parentPack: data.packName,
                            parentFilepath: data.filepath,
                            childPack: childPack.id.name,
                            childRequiredVersion: childPack.id.version,
                            isCompatible: false
                        };
                        this.addBlock(obj);
                    }
                });
            }
        }
        if (!this.blocks.length) {
            this.props.markStepAsFinished();
        }
    }

    addBlock(data) {
        let shouldAdd = true;
        _.each(this.blocks, block => {
            if (block.parentPack === data.childPack) {
                shouldAdd = false;
            }
        });
        if (shouldAdd) {
            this.blocks.push(data);
        }
    }

    getPackVersions(packName) {
        const { packagesStore } = this.props.stores;
        let versions = [];
        _.each(packagesStore.preparedPackages, (packs, letter) => {
            _.each(packs, (pack, i) => {
                if (pack.packageName === packName) {
                    versions = pack.versions;
                }
            });
        });
        return versions;
    }

    formatVersions(packName) {
        let versions = this.getPackVersions(packName).map((version) => {
            return {
                id: version.id.version,
                text: version.id.version,
                value: version.filepath
            }
        });
        return versions;
    }

    onParentVersionChange(data, event) {
        const filepath = event.target.value;
        data.filepath = filepath;
        this.props.selectVersion(data);

        let block = _.find(this.blocks, block => block.parentPack === data.packageName);
        block.parentFilepath = filepath;

        this.isLoading = true;
        this.blocks = [];
        let obj = {
            packName: data.packageName,
            filepath: filepath,
        };
        this.checkVersion(obj);

        let that = this;
        setTimeout(() => {
            that.isLoading = false;
        }, 500);
    }

    render() {
        const { addToCampaign } = this.props;
        let isOneIncompatible = _.find(this.blocks, block => !block.isCompatible);
        return (
            <div className="content">
                { this.blocks.length ?
                    isOneIncompatible ?
                        <div className="top-alert danger" id="compatibility-issue">
                            <img src="/assets/img/icons/white/manager-danger.png" alt="Icon"/>
                            Compatibility issue
                        </div>
                        :
                        <div className="top-alert warning" id="missing-dependencies">
                            <img src="/assets/img/icons/white/manager-warning.png" alt="Icon"/>
                            Missing dependencies
                        </div>
                    :
                    <div className="top-alert success" id="success">
                        <img src="/assets/img/icons/white/manager-success.png" alt="Icon"/>
                        Dependencies check
                    </div>
                }
                { this.isLoading ?
                    <div className="wrapper-center">
                        <Loader/>
                    </div>
                    :
                    this.blocks.length ?
                        <span>                            
                            { _.map(this.blocks, (block, index) => {
                                return (
                                    <section className="pair" key={ index }>
                                        <div className="item">
                                            <Form
                                                formWidth="100%"
                                                flexDirection="row"
                                                customStyles={ { justifyContent: 'space-between' } }
                                            >
                                                <FormInput
                                                    isEditable={ false }
                                                    defaultValue={ block.parentPack }
                                                    label="Package"
                                                    wrapperWidth="49%"
                                                />
                                                <FormSelect
                                                    id="from-pack-versions"
                                                    options={ this.formatVersions(block.parentPack) }
                                                    visibleFieldsCount={ this.formatVersions(block.parentPack).length }
                                                    label="Version"
                                                    wrapperWidth="49%"
                                                    defaultValue={ block.parentFilepath }
                                                    onChange={ this.onParentVersionChange.bind(this, {
                                                        type: 'to',
                                                        packageName: block.parentPack
                                                    }) }
                                                />
                                            </Form>
                                        </div>
                                        { block.isCompatible ?
                                            <div className="status required" id="required">
                                                Requires:
                                            </div>
                                            :
                                            <div className="status incompatible" id="incompatible">
                                                Not compatible with:
                                            </div>
                                        }

                                        <div className="item">
                                            <Form
                                                formWidth="100%"
                                                flexDirection="row"
                                                customStyles={ { justifyContent: 'space-between' } }
                                            >
                                                <FormInput
                                                    isEditable={ false }
                                                    defaultValue={ block.childPack }
                                                    label="Package"
                                                    wrapperWidth="49%"
                                                />
                                                <FormInput
                                                    isEditable={ false }
                                                    defaultValue={ block.childRequiredVersion }
                                                    label="Version"
                                                    wrapperWidth="49%"
                                                />
                                            </Form>
                                        </div>
                                        <div className="add">
                                            { block.isCompatible ?
                                                <a href="#" id="add-to-campaign" className="add-button light"
                                                   onClick={ addToCampaign.bind(this, block.childPack) }>
                                                    <span>
                                                    +
                                                    </span>
                                                    <span>
                                                        Add to campaign
                                                    </span>
                                                </a>
                                                :
                                                <a href="#" id="change-version" className="add-button light"
                                                   onClick={ addToCampaign.bind(this, block.childPack) }>
                                                    <span>
                                                    +
                                                    </span>
                                                    <span>
                                                        Change version
                                                    </span>
                                                </a>
                                            }
                                        </div>

                                    </section>
                                );
                            }) }
                        </span>
                        :
                        <div className="wrapper-center">
                            <div className="step-pass" id="step-pass">
                                <img src="/assets/img/icons/manager-success.svg" alt="Icon"/>
                                No dependency issues
                            </div>
                        </div>
                }
            </div>
        );
    }
}

WizardStep5.propTypes = {}

export default WizardStep5;