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
        const formattedData = versions && versions.map((version) => {
            return {
                text: version.id.version,
                id: version.id.version,
                value: version.id.version,
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
        const { update } = wizardData;
        const {
            fromPack,
            toPack,
            fromVersion,
            toVersion,
        } = !_.isEmpty(update) && _.isObject(update[item.name]) && update[item.name];

        let uniqPackages = _.uniq(packagesStore.packages, (item) => {
            return item.id.name
        });
        const packages = _.map(uniqPackages, (item) => {
            return {
                text: item.id.name,
                id: item.id.name,
                value: item.id.name,
                item,
            };
        });

        return (
            <div className="update-block">
                <div className="row hardware-id">
                    <div className="col-xs-12">
                        { item.name }
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
                                id={ `${item.name}-from-package` }
                                options={ packages }
                                label="Package"
                                multiple={ false }
                                wrapperWidth="100%"
                                visibleFieldsCount={ 5 }
                                appendMenuToBodyTag={ true }
                                placeholder="Select from package"
                                defaultValue={ fromPack && fromPack.id }
                                onChange={ (value) => {
                                    if (value) {
                                        this.formatVersions('from', value);
                                        onStep2DataSelect(item, 'fromPack', value);
                                    }
                                } }
                            />
                        </div>
                        <div className="col-xs-6">
                            <FormSelect
                                id={ `${item.name}-to-package` }
                                options={ packages }
                                label="Package"
                                multiple={ false }
                                wrapperWidth="100%"
                                visibleFieldsCount={ 5 }
                                appendMenuToBodyTag={ true }
                                placeholder="Select to package"
                                defaultValue={ toPack && toPack.id }
                                onChange={ (value) => {
                                    if (value) {
                                        this.formatVersions('to', value);
                                        onStep2DataSelect(item, 'toPack', value);
                                    }
                                } }
                            />
                        </div>
                    </Form>
                </div>
                <div className="row versions">
                    <Form>
                        <div className=" col-xs-6">
                            <FormSelect
                                id={ `${item.name}-from-version` }
                                options={ this.fromVersions }
                                appendMenuToBodyTag={ true }
                                label="Version"
                                multiple={ false }
                                placeholder="Select from version"
                                visibleFieldsCount={ 5 }
                                defaultValue={ fromVersion && fromVersion.id && fromVersion.id.version }
                                onChange={ (value) => {
                                    if (value) {
                                        onStep2DataSelect(item, 'fromVersion', value)
                                    }
                                } }
                            />
                        </div>
                        <div className=" col-xs-6">
                            <FormSelect
                                id={ `${item.name}-to-version` }
                                options={ this.toVersions }
                                appendMenuToBodyTag={ true }
                                label="Version"
                                multiple={ false }
                                placeholder="Select to version"
                                visibleFieldsCount={ 5 }
                                defaultValue={ toVersion && toVersion.id && toVersion.id.version }
                                onChange={ (value) => {
                                    if (value) {
                                        onStep2DataSelect(item, 'toVersion', value)
                                    }
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
    wizardData: PropTypes.object,
    onStep2DataSelect: PropTypes.func,
};

export default UpdateDetailListItem;
