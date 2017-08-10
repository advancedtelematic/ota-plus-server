import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { SelectField, MenuItem } from 'material-ui';
import _ from 'underscore';

@observer
class PackagesVersionList extends Component {

    constructor(props) {
        super(props);
        this.formatFromVersions = this.formatFromVersions.bind(this);
        this.selectVersion = this.selectVersion.bind(this);
        this.formatHardwareIds = this.formatHardwareIds.bind(this);
        this.selectHardwareId = this.selectHardwareId.bind(this);
    }
    formatFromVersions(pack) {
        let versions = pack.versions;
        return versions.map((version) => (
            <MenuItem
                key={version.id.version}
                insetChildren={true}
                checked={false}
                value={version.packageHash}
                primaryText={<span className='version-hash'>Version: {version.id.version}</span>}
                secondaryText={<span className='version-created-at'>Created at: {version.createdAt}</span>}
                id={"version-from-menu-item-" + version.id.version}
                className={"version-menu-item"}
            />
        ));
    }
    formatToVersions(pack) {
        let versions = pack.versions;
        return versions.map((version) => (
            <MenuItem
                key={version.id.version}
                insetChildren={true}
                checked={false}
                value={version.packageHash}
                primaryText={<span className='version-hash'>Version: {version.id.version}</span>}
                secondaryText={<span className='version-created-at'>Created at: {version.createdAt}</span>}
                id={"version-to-menu-item-" + version.id.version}
                className={"version-menu-item"}
            />
        ));
    }
    formatLegacyToVersions(pack) {
        let versions = pack.versions;
        return versions.map((version) => (
            <MenuItem
                key={version.id.version}
                insetChildren={true}
                checked={false}
                value={version.id.version}
                primaryText={<span className='version-hash'>Version: {version.id.version}</span>}
                secondaryText={<span className='version-created-at'>Created at: {version.createdAt}</span>}
                id={"version-to-menu-item-" + version.id.version}
                className={"version-menu-item"}
            />
        ));
    }
    formatHardwareIds() {
        let hardwareIds = this.props.hardwareStore.hardwareIds;
        return hardwareIds.map((id) => (
            <MenuItem
                key={id}
                insetChildren={true}
                checked={false}
                value={id}
                primaryText={id}
                id={"hardware-ids-select-menu-item-" + id}
            />
        ));
    }
    selectVersion(data, event, index, value) {
        data.version = value;
        this.props.selectVersion(data);
    }
    selectHardwareId(data, event, index, value) {
        data.hardwareId = value;
        this.props.selectVersion(data);
    }
    componentWillReceiveProps(nextProps) {
        let selectedVersions = nextProps.selectedVersions;

        if(this.props.pack.inDirector) {
            if(Object.keys(selectedVersions).length === nextProps.packsCount) {
                let shouldPass = true;
                let selectedHardwareIds = [];

                _.each(selectedVersions, (version, index) => {
                    selectedHardwareIds.push(version.hardwareId);
                    if(_.isNull(version.to) || _.isNull(version.from) || _.isNull(version.hardwareId)) {
                        shouldPass = false;
                    }                
                });

                let hardwareIdDuplicates = selectedHardwareIds.some((value, index)=>{
                    return selectedHardwareIds.indexOf(value) != index;
                });

                this.props.setHardwareIdDuplicates(hardwareIdDuplicates);

                if(shouldPass && !hardwareIdDuplicates)
                    this.props.markStepAsFinished();
                else
                    this.props.markStepAsNotFinished();
            }
            else {
                this.props.markStepAsNotFinished();
            }
        } else {
            if(Object.keys(selectedVersions).length && selectedVersions[this.props.pack.packageName].to) {
                this.props.markStepAsFinished();
            } else {
                this.props.markStepAsNotFinished();
            }
        }
    }
    render() {
        const { pack, selectedVersions} = this.props;
        return (
            <div className={"item" + (pack.inDirector ? " director" : " legacy")} id={"button-package-" + pack.packageName} title={pack.packageName} ref="item">
                <div className="info">
                    <span className="name">
                        {pack.packageName}
                    </span>
                    {pack.inDirector ?
                        <div className="in-director">
                            <img src="/assets/img/icons/black/lock.png" alt="Director" />
                        </div>
                    :
                        null
                    }
                </div>
                <div className="versions">
                    {pack.inDirector ?
                        <span>
                            <div className="from">
                                From: 
                                <SelectField
                                    id="version-from"
                                    multiple={false}
                                    onChange={this.selectVersion.bind(this, {type: 'from', packageName: pack.packageName})}
                                    hintText="Select from version"
                                    value={selectedVersions[pack.packageName] ? selectedVersions[pack.packageName].from : null}
                                    style={{display: 'block', width : '100%'}}
                                >
                                    {this.formatFromVersions(pack)}
                                </SelectField>
                            </div>
                            <div className="to">
                                To:
                                <SelectField
                                    id="version-to"
                                    multiple={false}
                                    onChange={this.selectVersion.bind(this, {type: 'to', packageName: pack.packageName})}
                                    hintText="Select to version"
                                    value={selectedVersions[pack.packageName] ? selectedVersions[pack.packageName].to : null}
                                    style={{display: 'block', width : '100%'}}
                                >
                                    {this.formatToVersions(pack)}
                                </SelectField>
                            </div>
                            <div className="hardware-id">
                                <SelectField
                                    id="hardware-ids-select-field"
                                    multiple={false}
                                    onChange={this.selectHardwareId.bind(this, {type: 'hardwareId', packageName: pack.packageName})}
                                    hintText="Select hardware ids"
                                    value={selectedVersions[pack.packageName] ? selectedVersions[pack.packageName].hardwareId : null}
                                >
                                    {this.formatHardwareIds()}
                                </SelectField>
                            </div>
                        </span>
                    :
                        <span>
                            <div className="to">
                                To:
                                <SelectField
                                    id="version-to"
                                    multiple={false}
                                    onChange={this.selectVersion.bind(this, {type: 'to', packageName: pack.packageName})}
                                    hintText="Select to version"
                                    value={selectedVersions[pack.packageName] ? selectedVersions[pack.packageName].to : null}
                                    style={{display: 'block', width : '100%'}}
                                >
                                    {this.formatLegacyToVersions(pack)}
                                </SelectField>
                            </div>
                        </span>
                    }
                </div>
            </div>
        );
    }
}

PackagesVersionList.propTypes = {
    pack: PropTypes.object.isRequired,
    hardwareStore: PropTypes.object.isRequired,
}

export default PackagesVersionList;