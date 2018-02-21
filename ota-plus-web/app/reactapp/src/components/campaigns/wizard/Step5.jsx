import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { observable, extendObservable } from 'mobx';
import _ from 'underscore';
import { SelectField, MenuItem } from 'material-ui';
import { Loader } from '../../../partials';
import { FlatButton } from 'material-ui';

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
        const { wizardData, packagesStore, markStepAsNotFinished } = this.props;
        markStepAsNotFinished();
        let chosenVersions = wizardData[2].versions;
        _.each(chosenVersions, (values, packName) => {
            let obj = {
                packName: packName,
                filepath: values.toFilepath
            };
            this.checkVersion(obj);
        });
    }
    checkVersion(data) {
        const { packagesStore, wizardData } = this.props;
        let chosenVersions = wizardData[2].versions;
        let objWithRelations = JSON.parse(localStorage.getItem(data.filepath));
        if(objWithRelations) {
            let requiredPackages = objWithRelations.required;
            let incompatiblePackages = objWithRelations.incompatibles;
            if(requiredPackages) {
                _.each(requiredPackages, (filepath, index) => {
                    let skipAdd = false;
                    _.each(chosenVersions, (values, pName) => {
                        if(values.toFilepath === filepath) {                        
                            skipAdd = true;
                        }
                    });
                    if(!skipAdd) {
                        let childPack = _.find(packagesStore.directorPackages, pack => pack.imageName === filepath);
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
            if(incompatiblePackages) {
                _.each(incompatiblePackages, (filepath, index) => {
                    let isTryingToInstall = false;
                    _.each(chosenVersions, (values, pName) => {
                        if(values.toFilepath === filepath) {                        
                            isTryingToInstall = true;
                        }
                    });
                    if(isTryingToInstall) {
                        let childPack = _.find(packagesStore.directorPackages, pack => pack.imageName === filepath);
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
        if(!this.blocks.length) {
            this.props.markStepAsFinished();
        }
    }
    addBlock(data) {
        this.blocks.push(data);
    }
    getPackVersions(packName) {
        const { packagesStore } = this.props;
        let versions = [];
        _.each(packagesStore.preparedPackages, (packs, letter) => {
            _.each(packs, (pack, i) => {
                if(pack.packageName === packName) {
                    versions = pack.versions;
                }
            });
        });
        return versions;
    }
    formatVersions(packName) {
        let versions = this.getPackVersions(packName);
        let menuItems = _.map(versions, (version, i) => {
            return (
                <MenuItem
                    key={version.id.version}
                    insetChildren={true}
                    checked={false}
                    value={version.imageName}
                    primaryText={<span className='version-hash' style={{
                        fontSize: '12px',
                    }}>{version.id.version}</span>}
                    id={"parent-pack-" + version.id.version}
                    className={"version-menu-item"}
                />
            );
        });
        return menuItems;
    }
    onParentVersionChange(data, event, index, filepath) {        
        data.imageName = filepath;
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
                {this.blocks.length ?
                    isOneIncompatible ?
                        <div className="top-alert danger" id="compatibility-issue">
                            <img src="/assets/img/icons/white/manager-danger.png" alt="Icon" />
                            Compatibility issue
                        </div>
                    :
                        <div className="top-alert warning" id="missing-dependencies">
                            <img src="/assets/img/icons/white/manager-warning.png" alt="Icon" />
                            Missing dependencies
                        </div>
                :
                    <div className="top-alert success" id="success">
                        <img src="/assets/img/icons/white/manager-success.png" alt="Icon" />
                        Dependencies check
                    </div>
                }
                {this.isLoading ?
                    <div className="wrapper-center">
                        <Loader />
                    </div>
                :
                    this.blocks.length ? 
                        <span>                            
                            {_.map(this.blocks, (block, index) => {
                                return (
                                    <section className="pair" key={index}>
                                        <div className="item">
                                            <div className="name">
                                                <div className="title">
                                                    Package:
                                                </div>
                                                <div className="value" id={"parent-pack-" + block.parentPack}>
                                                    {block.parentPack}
                                                </div>
                                            </div>
                                            <div className="version select">
                                                <div className="title">
                                                    Version:
                                                </div>
                                                <SelectField
                                                    id="from-pack-versions"
                                                    multiple={false}
                                                    onChange={this.onParentVersionChange.bind(this, {type: 'to', packageName: block.parentPack})}
                                                    value={block.parentFilepath}
                                                    style={{display: 'block', width: '100%', height: '30px'}}
                                                    iconStyle={{height: '30px', padding: 0}}
                                                    labelStyle={{height: '30px', lineHeight: '20px'}}
                                                    selectedMenuItemStyle={{color: '#000', fontWeight: 'bold'}}
                                                >
                                                    {this.formatVersions(block.parentPack)}
                                                </SelectField>
                                            </div>
                                        </div>
                                        {block.isCompatible ?
                                            <div className="status required" id="required">
                                                Requires:
                                            </div>
                                        :
                                            <div className="status incompatible" id="incompatible">
                                                Not compatible with:
                                            </div>
                                        }
                                        
                                        <div className="item">
                                            <div className="name">
                                                <div className="title">
                                                    Package:
                                                </div>
                                                <div className="value" id={"child-pack-" + block.parentPack}>
                                                    {block.childPack}
                                                </div>
                                            </div>
                                            <div className="version">
                                                <div className="title">
                                                    Version:
                                                </div>
                                                <div className="value" id={"child-pack-" + block.childRequiredVersion}>
                                                    {block.childRequiredVersion}                                                
                                                </div>
                                            </div>                                            
                                        </div>
                                        <div className="add">
                                            {block.isCompatible ?
                                                <FlatButton
                                                    label="Add to campaign"
                                                    type="button"
                                                    className="btn-main btn-small"
                                                    id="add-to-campaign"
                                                    onClick={addToCampaign.bind(this, block.childPack)}
                                                />
                                            :
                                                <FlatButton
                                                    label="Change version"
                                                    type="button"
                                                    className="btn-main btn-small"
                                                    id="change-version"
                                                    onClick={addToCampaign.bind(this, block.childPack)}
                                                />
                                            }
                                        </div>
                                        
                                    </section>
                                );
                            })}
                        </span>
                    :
                        <div className="wrapper-center">
                            <div className="step-pass" id="step-pass">
                                <img src="/assets/img/icons/manager-success.svg" alt="Icon" />
                                All dependencies compatible
                            </div>
                        </div>
                }
            </div>
        );
    }
}

WizardStep5.propTypes = {
}

export default WizardStep5;