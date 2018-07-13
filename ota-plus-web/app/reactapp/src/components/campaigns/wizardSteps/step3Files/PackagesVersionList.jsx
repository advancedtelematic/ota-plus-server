import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { SelectField, MenuItem } from 'material-ui';
import {Form, FormSelect, FormInput} from '../../../../partials/';
import _ from 'underscore';
import moment from 'moment';

@observer
class PackagesVersionList extends Component {
    @observable fromVersions = [];

    constructor(props) {
        super(props);
        this.formatFromVersions = this.formatFromVersions.bind(this);
        this.selectVersion = this.selectVersion.bind(this);
        this.selectHardwareId = this.selectHardwareId.bind(this);
    }
    formatFromVersions(pack) {
        let versions = pack.versions;
        this.fromVersions = versions.map((version) => {
            return {
                text: `${version.id.version} Created at: ${moment(version.createdAt).format("ddd MMM DD YYYY, h:mm:ss A")}`,
                id: version.id.version,
                value: version.filepath
            }
        });
    }
    selectVersion(data, obj, index, value) {
        data.filepath = obj ? obj.value : value;
        this.props.selectVersion(data);
    }
    selectHardwareId(data, obj) {
        data.hardwareId = obj.value ? obj.value : obj;
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
        }
        this.formatFromVersions(this.props.pack);
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
        const { pack, selectedVersions, hardwareStore} = this.props;
        let hardwareIds = hardwareStore.hardwareIds;
        let tufPackages = _.uniq(this.props.packagesStore.packages, (item) => { return item.id.name });
        tufPackages = _.map(tufPackages, (item) => {
            return {
                text: item.id.name,
                id: item.id.name,
                value: item.id.name
            }
        });
        let versions = _.map(pack.versions, (version) => {
            return {
                text: `${version.id.version} Created at: ${moment(version.createdAt).format("ddd MMM DD YYYY, h:mm:ss A")}`,
                id: version.id.version,
                value: version.filepath
            }
        });
        return (
            <div className="item director" id={"button-package-" + pack.packageName} title={pack.packageName} ref="item">
                <div className="select-container">
                    <span>
                        <div className="packages">
                            <Form
                                formWidth="100%"
                                flexDirection="row"
                            >
                                <div className="from">
                                    <FormSelect
                                        id="available-tuf-packages"
                                        options={tufPackages}
                                        label="From"
                                        multiple={false}
                                        wrapperWidth="100%"
                                        visibleFieldsCount={5}
                                        appendMenuToBodyTag={true}
                                        defaultValue={selectedVersions[pack.packageName] ? selectedVersions[pack.packageName].changedPackage.packageName : null }
                                        onChange={this.selectVersion.bind(this, {type: 'package', packageName: pack.packageName})}
                                        placeholder="Select from package"
                                    />
                                </div>
                                <div className="to">
                                    <FormInput
                                        label="To"
                                        name="package-to"
                                        isEditable={false}
                                        inputWidth="100%"
                                        defaultValue={pack.packageName}
                                        inDirector={true}
                                    />
                                </div>
                            </Form>
                        </div>
                        <div className="versions">
                            <Form
                                formWidth='100%'
                                flexDirection="row"
                            >
                                <div className="from">
                                    <FormSelect
                                        id="version-from"
                                        options={this.fromVersions}
                                        appendMenuToBodyTag={true}
                                        label="Version"
                                        multiple={false}
                                        defaultValue={selectedVersions[pack.packageName] ? selectedVersions[pack.packageName].fromFilepath : null}
                                        onChange={this.selectVersion.bind(this, {type: 'from', packageName: pack.packageName})}
                                        placeholder="Select from version"
                                        visibleFieldsCount={5}
                                    />
                                </div>
                                <div className="to">
                                    <FormSelect
                                        id="version-to"
                                        options={versions}
                                        appendMenuToBodyTag={true}
                                        label="Version"
                                        multiple={false}
                                        defaultValue={selectedVersions[pack.packageName] ? selectedVersions[pack.packageName].toFilepath : null}
                                        onChange={this.selectVersion.bind(this, {type: 'to', packageName: pack.packageName})}
                                        placeholder="Select to version"
                                        visibleFieldsCount={5}
                                    />
                                </div>
                            </Form>
                        </div>
                        <div className="hardware-id">
                            <Form>
                                <FormSelect
                                    id="hardware-ids-select-field"
                                    options={hardwareIds}
                                    label="On"
                                    multiple={false}
                                    visibleFieldsCount={hardwareIds.length < 4 && hardwareIds.length > 1 ? hardwareIds.length  : 4}
                                    appendMenuToBodyTag={true}
                                    defaultValue={selectedVersions[pack.packageName] ? selectedVersions[pack.packageName].hardwareId : null}
                                    onChange={this.selectHardwareId.bind(this, {type: 'hardwareId', packageName: pack.packageName})}
                                    placeholder="Select hardware ids"
                                />
                            </Form>
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