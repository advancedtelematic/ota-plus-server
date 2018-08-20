import React, { Component, PropTypes } from 'react';
import { Form } from 'formsy-react';
import { FormInput, FormTextarea, FormSelect, Loader, AsyncResponse } from '../../../partials';
import { observer, inject } from 'mobx-react';
import _ from 'underscore';
import { observable } from 'mobx';
import moment from 'moment';

@inject("stores")
@observer
class Step2 extends Component {
    @observable fromVersions = [];
    @observable toVersions = [];

    componentWillMount() {
        const { packagesStore } = this.props.stores;
        packagesStore.fetchPackages();
    }
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
        const { wizardData, onStep2DataSelect } = this.props;
        const { packagesStore, updateStore } = this.props.stores;
        const packages = _.map(packagesStore.packages, (item) => {
            return {
                text: item.id.name,
                id: item.id.name,
                value: item.id.name,
                item
            };
        });
        return (
            <div className="update-modal">
                <AsyncResponse 
                    handledStatus="error"
                    action={updateStore.updatesCreateAsync}
                    errorMsg={(updateStore.updatesCreateAsync.data ? updateStore.updatesCreateAsync.data.description : null)}
                />
                <div className="row name-container">
                    <div className="col-xs-6">
                        <FormInput
                            label="Update Name"
                            defaultValue={wizardData[0].name}
                            name="updateName"
                            isEditable={ false }
                            id="create-new-update-name"

                        />
                    </div>
                    <div className="col-xs-6">
                        <FormTextarea
                            label="Description"
                            defaultValue={wizardData[0].description}
                            rows={ 5 }
                            isEditable={ false }
                            name="updateDescription"
                            id="create-new-update-description"
                        />
                    </div>
                </div>

                <div className="select-container clearfix">
                    <div className='row header'>
                        <div className=" col-xs-6">From</div>
                        <div className=" col-xs-6">To</div>
                    </div>
                    {packagesStore.packagesFetchAsync.isFetching ?
                        <div className="wrapper-center">
                            <Loader/>
                        </div>
                    :
                        <span>
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
                        </span>
                    }                    
                </div>
            </div>
        );
    }
}

export default Step2;