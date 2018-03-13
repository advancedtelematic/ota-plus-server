import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { SelectField, MenuItem } from 'material-ui';
import _ from 'underscore';
import moment from 'moment';

@observer
class PackagesVersionList extends Component {
    @observable fromVersions = [];

    constructor(props) {
        super(props);
        this.formatFromVersions = this.formatFromVersions.bind(this);
        this.formatToVersions = this.formatToVersions.bind(this);
        this.selectVersion = this.selectVersion.bind(this);
        this.formatHardwareIds = this.formatHardwareIds.bind(this);
        this.selectHardwareId = this.selectHardwareId.bind(this);
        this.formatTufPackages = this.formatTufPackages.bind(this);
    }
    formatTufPackages() {
        let tufPackages = _.uniq(this.props.packagesStore.packages, (item) => { return item.id.name });
        return tufPackages.map((pack) => (
            <MenuItem
                key={pack.filepath}
                insetChildren={true}
                checked={false}
                value={pack.id.name}
                primaryText={<span className='pack-name'>{pack.id.name}</span>}
                id={"tuf-package-item-" + pack.id.name}
                className={"version-menu-item"}
            />
        ));
    }
    formatFromVersions(pack) {
        let versions = pack.versions;
        let fromVersions = versions.map((version) => (
            <MenuItem
                key={version.filepath}
                insetChildren={true}
                checked={false}
                value={version.filepath}
                primaryText={<span className='version-hash'>{version.id.version}</span>}
                secondaryText={<span className='version-created-at'>Created at: {moment(version.createdAt).format("ddd MMM DD YYYY, h:mm:ss A")}</span>}
                id={"version-from-menu-item-" + version.id.version}
                className={"version-menu-item"}
            />
        ));
        this.fromVersions = fromVersions;
    }
    formatToVersions(pack) {
        let versions = pack.versions;
        return versions.map((version) => (
            <MenuItem
                key={version.filepath}
                insetChildren={true}
                checked={false}
                value={version.filepath}
                primaryText={<span className='version-hash'>{version.id.version}</span>}
                secondaryText={<span className='version-created-at'>Created at: {moment(version.createdAt).format("ddd MMM DD YYYY, h:mm:ss A")}</span>}
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
        data.filepath = value;
        this.props.selectVersion(data);
    }
    selectHardwareId(data, event, index, value) {
        data.hardwareId = value;
        this.props.selectVersion(data);
    }
    componentWillMount() {
        this.props.markStepAsNotFinished();

        if(_.isUndefined(this.props.selectedVersions[this.props.pack.packageName])) {
            let packageName = this.props.pack.packageName;
            let data = {
                type: 'package',
                packageName: packageName
            };
            this.selectVersion(data, null, null, packageName);
            this.formatFromVersions(this.props.pack);
        }
    }
    componentWillReceiveProps(nextProps) {
        let selectedVersions = nextProps.selectedVersions;

        if(!_.isEmpty(selectedVersions[this.props.pack.packageName].changedPackage)) {
            this.formatFromVersions(selectedVersions[this.props.pack.packageName].changedPackage);
        }

        let packsToValidate = {};
        _.each(selectedVersions, (version, packageName) => {
            _.each(this.props.rawSelectedPacks, (pack, i) => {
                if(packageName === pack.packageName) {
                    packsToValidate[packageName] = version;
                }
            });
        });

        let allSelectedKeys = Object.keys(selectedVersions);
        let validateKeys = Object.keys(packsToValidate);
        let differentKeys = _.difference(allSelectedKeys, validateKeys);
        this.props.removeSelectedPacksByKeys(differentKeys);
        if(Object.keys(packsToValidate).length === nextProps.packsCount) {
            let shouldPass = true;
            let selectedHardwareIds = [];
            _.each(packsToValidate, (version, index) => {
                if(!version.disableValidation) {
                    selectedHardwareIds.push(version.hardwareId);
                    if(_.isNull(version.hardwareId)) {
                        shouldPass = false;
                    }
                }
                if(_.isNull(version.to) || _.isNull(version.from)) {
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
    }
    render() {
        const { pack, selectedVersions} = this.props;
        return (
            <div className="item director" id={"button-package-" + pack.packageName} title={pack.packageName} ref="item">
                <div className="select-container">
                    <span>
                        <div className="packages">
                            <div className="from">
                                <div className="head">From:</div>
                                <SelectField
                                    id="available-tuf-packages"
                                    multiple={false}
                                    onChange={this.selectVersion.bind(this, {type: 'package', packageName: pack.packageName})}
                                    value={selectedVersions[pack.packageName] ? selectedVersions[pack.packageName].changedPackage.packageName : null }
                                    hintText="Select tuf package"
                                    title="Select from package"
                                    style={{display: 'block', width : '100%'}}
                                >
                                    {this.formatTufPackages()}
                                </SelectField>
                            </div>
                            <div className="to">
                                <div className="head">To:</div>
                                <div className="info">
                                    <span className="icon">
                                        <img src="/assets/img/icons/green_tick.png" alt="Icon" />
                                    </span>
                                    <span className="name">
                                        {pack.packageName}
                                    </span>
                                    <div className="in-director">
                                        <img src="/assets/img/icons/black/lock.svg" alt="Director" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="versions">
                            <div className="from">
                                <div className="head">Version:</div>
                                <SelectField
                                    id="version-from"
                                    multiple={false}
                                    onChange={this.selectVersion.bind(this, {type: 'from', packageName: pack.packageName})}
                                    hintText="Select from version"
                                    value={selectedVersions[pack.packageName] ? selectedVersions[pack.packageName].fromFilepath : null}
                                    title="Select from version"
                                    style={{display: 'block', width : '100%'}}
                                >
                                    {this.fromVersions}
                                </SelectField>
                            </div>
                            <div className="to">
                                <div className="head">Version:</div>
                                <SelectField
                                    id="version-to"
                                    multiple={false}
                                    onChange={this.selectVersion.bind(this, {type: 'to', packageName: pack.packageName})}
                                    hintText="Select to version"
                                    value={selectedVersions[pack.packageName] ? selectedVersions[pack.packageName].toFilepath : null}
                                    title="Select to version"
                                    style={{display: 'block', width : '100%'}}
                                >
                                    {this.formatToVersions(pack)}
                                </SelectField>
                            </div>
                        </div>
                        <div className="hardware-id">
                            <div className="head">On:</div>
                            <SelectField
                                id="hardware-ids-select-field"
                                multiple={false}
                                onChange={this.selectHardwareId.bind(this, {type: 'hardwareId', packageName: pack.packageName})}
                                hintText="Select hardware ids"
                                value={selectedVersions[pack.packageName] ? selectedVersions[pack.packageName].hardwareId : null}
                                title="Select hardware id"
                            >
                                {this.formatHardwareIds()}
                            </SelectField>
                        </div>
                    </span>
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