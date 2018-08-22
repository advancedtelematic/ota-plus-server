import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import _ from 'underscore';
import { FormInput, FormTextarea, FormSelect, Loader, AsyncResponse } from '../../../../partials';

@inject("stores")
@observer
class UpdateList extends Component {
    @observable fromVersions = [];
    @observable toVersions = [];

    formatVersions = (type, name) => {
        const { packagesStore } = this.props.stores;
        const { preparedPackages } = packagesStore;
        let versions = null;
        _.each(preparedPackages, packs => {
            const found = _.find(packs, pack => pack.name === name);
            if(found) {
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
        if(type === 'from') {
            this.fromVersions = formattedData;
        } else {
            this.toVersions = formattedData;
        }
    }

    render() {
        const { wizardData } = this.props;
        const { packagesStore } = this.props.stores;        
        let packages = _.uniq(packagesStore.packages, (item) => { return item.id.name });
        packages = _.map(packagesStore.packages, (item) => {
            return {
                text: item.id.name,
                id: item.id.name,
                value: item.id.name,
                item
            };
        });
        const hardwareIds = wizardData[0].hardwareIds;
        return (
            packagesStore.packagesFetchAsync.isFetching ?
                <div className="wrapper-center">
                    <Loader/>
                </div>
            :
                _.map(hardwareIds, item => {
                    return (
                        <div className="update-block" key={item}>
                            <div className="row hardware-id">
                                <div className="col-xs-12">
                                    {item}
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
                                            id="available-packages"
                                            options={packages}
                                            label="Package"
                                            multiple={ false }
                                            wrapperWidth="100%"
                                            visibleFieldsCount={ 5 }
                                            appendMenuToBodyTag={ true }
                                            placeholder="Select from package"
                                            onChange={(value) => { this.formatVersions('from', value.id); onStep2DataSelect('fromPack', value.item) }}
                                        />
                                    </div>
                                    <div className="col-xs-6">
                                        <FormSelect
                                            id="available-packages"
                                            options={packages}
                                            label="Package"
                                            multiple={ false }
                                            wrapperWidth="100%"
                                            visibleFieldsCount={ 5 }
                                            appendMenuToBodyTag={ true }
                                            placeholder="Select to package"
                                            onChange={(value) => { this.formatVersions('to', value.id); onStep2DataSelect('toPack', value.item) }}
                                        />
                                    </div>
                                </Form>
                            </div>
                            <div className="row versions">
                                <Form>
                                    <div className=" col-xs-6">
                                        <FormSelect
                                            id="version-from"
                                            options={this.fromVersions}
                                            appendMenuToBodyTag={ true }
                                            label="Version"
                                            multiple={ false }
                                            placeholder="Select from version"
                                            visibleFieldsCount={ 5 }
                                            onChange={(value) => { onStep2DataSelect('fromVersion', value.version) }}
                                        />
                                    </div>
                                    <div className=" col-xs-6">
                                        <FormSelect
                                            id="version-to"
                                            options={this.toVersions}
                                            appendMenuToBodyTag={ true }
                                            label="Version"
                                            multiple={ false }
                                            placeholder="Select to version"
                                            visibleFieldsCount={ 5 }
                                            onChange={(value) => { onStep2DataSelect('toVersion', value.version) }} 
                                        />
                                    </div>
                                </Form>
                            </div>
                        </div>
                    );
                })     
        );
    }
}

UpdateList.propTypes = {
    stores: PropTypes.object,
}

export default UpdateList;
