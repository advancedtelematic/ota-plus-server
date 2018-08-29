import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import _ from 'underscore';
import { FormSelect } from '../../../../partials';
import { Form } from 'formsy-react';
import moment from 'moment';

@inject("stores")
@observer
class UpdateDetailListItem extends Component {
    @observable fromVersions = [];
    @observable toVersions = [];

    formatVersions = (type, name) => {
        const { packagesStore } = this.props.stores;
        const { preparedPackages } = packagesStore;
        let versions = null;
        _.each(preparedPackages, packs => {
            const found = _.find(packs, pack => pack.name === name);
            if (found) {
                versions = found.versions;
            }
        });
        const formattedData = versions.map((version) => {
            return {
                text: `${version.id.version} Created at: ${moment(version.createdAt).format("ddd MMM DD YYYY, h:mm:ss A")}`,
                id: version.id.version,
                value: version.filepath,
                version
            }
        });
        if (type === 'from') {
            this.fromVersions = formattedData;
        } else {
            this.toVersions = formattedData;
        }
    };

    render() {
        const { item, wizardData, onStep2DataSelect } = this.props;
        const { packagesStore } = this.props.stores;
        let uniqPackages = _.uniq(packagesStore.packages, (item) => {
            return item.id.name
        });
        const packages = _.map(uniqPackages, (item) => {
            return {
                text: item.id.name,
                id: item.id.name,
                value: item.id.name,
                item
            };
        });
        return (
            <div className="update-block">
                <div className="row hardware-id">
                    <div className="col-xs-12">
                        { item }
                    </div>
                </div>
                <div className='row header'>
                    <div className=" col-xs-6">From</div>
                    <div className=" col-xs-6">To</div>
                </div>
                <div className="row packages">
                    <Form>
                        <div className="col-xs-6">
                            <FormSelect
                                id="select-package-from"
                                options={ packages }
                                label="Package"
                                multiple={ false }
                                wrapperWidth="100%"
                                visibleFieldsCount={ 5 }
                                appendMenuToBodyTag={ true }
                                placeholder="Select from package"
                                defaultValue={ wizardData[1].update[item] && wizardData[1].update[item].fromPack ? wizardData[1].update[item].fromPack.id.name : null }
                                onChange={ (value) => {
                                    this.formatVersions('from', value.id);
                                    onStep2DataSelect(item, 'fromPack', value.item)
                                } }
                            />
                        </div>
                        <div className="col-xs-6">
                            <FormSelect
                                id="select-package-to"
                                options={ packages }
                                label="Package"
                                multiple={ false }
                                wrapperWidth="100%"
                                visibleFieldsCount={ 5 }
                                appendMenuToBodyTag={ true }
                                placeholder="Select to package"
                                defaultValue={ wizardData[1].update[item] && wizardData[1].update[item].toPack ? wizardData[1].update[item].toPack.id.name : null }
                                onChange={ (value) => {
                                    this.formatVersions('to', value.id);
                                    onStep2DataSelect(item, 'toPack', value.item)
                                } }
                            />
                        </div>
                    </Form>
                </div>
                <div className="row versions">
                    <Form>
                        <div className=" col-xs-6">
                            <FormSelect
                                id="select-version-from"
                                options={ this.fromVersions }
                                appendMenuToBodyTag={ true }
                                label="Version"
                                multiple={ false }
                                placeholder="Select from version"
                                visibleFieldsCount={ 5 }
                                defaultValue={ wizardData[1].update[item] && wizardData[1].update[item].fromVersion ? wizardData[1].update[item].fromVersion.id.name : null }
                                onChange={ (value) => {
                                    onStep2DataSelect(item, 'fromVersion', value.version)
                                } }
                            />
                        </div>
                        <div className=" col-xs-6">
                            <FormSelect
                                id="select-version-to"
                                options={ this.toVersions }
                                appendMenuToBodyTag={ true }
                                label="Version"
                                multiple={ false }
                                placeholder="Select to version"
                                visibleFieldsCount={ 5 }
                                defaultValue={ wizardData[1].update[item] && wizardData[1].update[item].toVersion ? wizardData[1].update[item].toVersion.id.name : null }
                                onChange={ (value) => {
                                    onStep2DataSelect(item, 'toVersion', value.version)
                                } }
                            />
                        </div>
                    </Form>
                </div>
            </div>
        );
    }
}

UpdateDetailListItem.propTypes = {
    stores: PropTypes.object,
    item: PropTypes.object,
    wizardData: PropTypes.array,
    onStep2DataSelect: PropTypes.func,
};

export default UpdateDetailListItem;
