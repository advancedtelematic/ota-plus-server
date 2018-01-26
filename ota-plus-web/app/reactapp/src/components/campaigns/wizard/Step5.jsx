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
        let requiredPackages = JSON.parse(localStorage.getItem(data.filepath + '-required'));
        let incompatiblePackages = JSON.parse(localStorage.getItem(data.filepath + '-incompatibles'));
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
                        childRequiredVersion: childPack.id.version
                    };
                    this.addBlock(obj);
                }
            });
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
                    id={"version-from-menu-item-" + version.id.version}
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
        return (
            <div className="content">
                {this.isLoading ?
                    <div className="wrapper-center">
                        <Loader />
                    </div>
                :
                    this.blocks.length ? 
                        _.map(this.blocks, (block, index) => {
                            return (
                                <section className="pair" key={index}>
                                    <div className="item">
                                        <div className="name">
                                            {block.parentPack}
                                        </div>
                                        <div className="version">
                                            <SelectField
                                                id="from-pack-versions"
                                                multiple={false}
                                                onChange={this.onParentVersionChange.bind(this, {type: 'to', packageName: block.parentPack})}
                                                value={block.parentFilepath}
                                                style={{display: 'block', width : '100%'}}
                                                selectedMenuItemStyle={{color: '#000', fontWeight: 'bold'}}
                                            >
                                                {this.formatVersions(block.parentPack)}
                                            </SelectField>
                                        </div>
                                    </div>
                                    <div className="item">
                                        <div className="name">
                                            <div className="warning">
                                                {block.childPack}/{block.childRequiredVersion}
                                            </div>
                                            <div>
                                                is required
                                            </div>
                                        </div>
                                        <div className="version">
                                            <FlatButton
                                                label="Add to campaign"
                                                type="button"
                                                className="btn-main btn-small"
                                                onClick={addToCampaign.bind(this, block.childPack)}
                                            />
                                        </div>
                                    </div>
                                </section>
                            );
                        })
                    :
                        <div className="wrapper-center">
                            <img src="/assets/img/icons/green_tick.png" alt="Icon" style={{width: '50px'}} />
                        </div>
                }
            </div>
        );
    }
}

WizardStep5.propTypes = {
}

export default WizardStep5;