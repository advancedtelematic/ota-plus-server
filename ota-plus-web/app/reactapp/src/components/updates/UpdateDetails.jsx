import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { FormInput, FormTextarea, Loader } from '../../partials/index';
import _ from 'underscore';


@inject("stores")
@observer
class UpdateDetails extends Component {
    componentWillMount() {
        const { updatesStore } = this.props.stores;
        const { updateItem } = this.props;
        updatesStore.fetchUpdate(updateItem && updateItem.source && updateItem.source.id)
    }

    render() {
        const { updatesStore } = this.props.stores;
        const { updateItem, isEditable } = this.props;
        const mtuData = updatesStore.currentMtuData && updatesStore.currentMtuData.data;

        return (
            <div>
                <div className="row name-container">
                    <div className="col-xs-6">
                        <FormInput
                            label="Update Name"
                            placeholder="Name"
                            name="updateName"
                            id={ "update-name-" + updateItem.name }
                            defaultValue={ updateItem.name }
                            isEditable={ isEditable }
                        />
                    </div>
                    <div className="col-xs-6">
                        <FormTextarea
                            label="Description"
                            placeholder="Type here"
                            rows={ 5 }
                            name="updateDescription"
                            id={ "update-description" + updateItem.name }
                            defaultValue={ updateItem.description }
                            isEditable={ isEditable }
                        />
                    </div>
                </div>
                <div className="row targets-container">
                {
                    updatesStore.updatesFetchMtuIdAsync.isFetching ?
                        <div className="wrapper-center">
                            <Loader/>
                        </div>
                        :
                        mtuData ?
                            _.map(mtuData, (target, hardwareId) => {
                                const noInformation = "No information.";
                                const { target: fromPackage, checksum: fromVersion } = target.from;
                                const { target: toPackage, checksum: toVersion } = target.to;

                                return (
                                    <div className="col-xs-12" key={ hardwareId }>
                                        <label className="c-form__label">{ hardwareId }</label>
                                        <div className="col-xs-6">{ "From" }</div>
                                        <div className="col-xs-6">{ "To" }</div>
                                        <div className="col-xs-6">
                                            <FormInput
                                                label="Package"
                                                name="fromPackage"
                                                id="from-package"
                                                defaultValue={ fromPackage ? fromPackage : noInformation }
                                                isEditable={ isEditable }
                                            />
                                        </div>
                                        <div className="col-xs-6">
                                            <FormInput
                                                label="Package"
                                                name="toPackage"
                                                id="to-package"
                                                defaultValue={ toPackage ? toPackage : noInformation }
                                                isEditable={ isEditable }
                                            />
                                        </div>
                                        <div className="col-xs-6">
                                            <FormInput
                                                label="Version"
                                                name="fromVersion"
                                                id="from-version"
                                                defaultValue={ fromVersion ? fromVersion.hash : noInformation }
                                                isEditable={ isEditable }
                                            />
                                        </div>
                                        <div className="col-xs-6">
                                            <FormInput
                                                label="Package"
                                                name="toVersion"
                                                id="to-version"
                                                defaultValue={ toVersion ? toVersion.hash : noInformation }
                                                isEditable={ isEditable }
                                            />
                                        </div>
                                    </div>
                                )
                            })
                            :
                            updateItem.source &&
                            <div className="col-xs-12">
                                <FormInput
                                    label={ updateItem.source.id }
                                    name="fromPackage"
                                    id="from-package"
                                    defaultValue={ updateItem.source.sourceType }
                                    isEditable={ isEditable }
                                />
                                <div className="wrapper-center">
                                    <p>{ "No further information available." }</p>
                                </div>
                            </div>
                }
                </div>
            </div>
        );
    }
}

UpdateDetails.propTypes = {
    updateItem: PropTypes.object.isRequired,
    isEditable: PropTypes.bool,
};

export default UpdateDetails;
