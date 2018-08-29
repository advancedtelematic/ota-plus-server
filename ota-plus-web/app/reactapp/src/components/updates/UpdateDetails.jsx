import React, { Component, PropTypes } from 'react';
import { observer, inject } from 'mobx-react';
import { FormInput, FormTextarea } from '../../partials/index';
import _ from 'underscore';


@inject("stores")
@observer
class UpdateDetails extends Component {

    render() {
        const { details, isEditable } = this.props;

        return (
            <div>
                <div className="row name-container">
                    <div className="col-xs-6">
                        <FormInput
                            label="Update Name"
                            placeholder="Name"
                            name="updateName"
                            id={ "update-name-" + details.name }
                            defaultValue={ details.name }
                            isEditable={ isEditable }
                        />
                    </div>
                    <div className="col-xs-6">
                        <FormTextarea
                            label="Description"
                            placeholder="Type here"
                            rows={ 5 }
                            name="updateDescription"
                            id={ "update-description" + details.name }
                            defaultValue={ details.description }
                            isEditable={ isEditable }
                        />
                    </div>
                </div>
                {
                    !details.targets ?
                        details.source &&
                        <div className="row source-container">
                            <div className="col-xs-12">
                                <label className="c-form__label">{ details.source.id }</label>
                                { "No source information available." }
                            </div>
                        </div>
                        :
                        <div className="row targets-container">
                        {
                            _.map(details.targets, (target, hardwareId) => {
                                return (
                                    <div className="col-xs-12">
                                        <label className="c-form__label">{ hardwareId }</label>
                                        <div className="col-xs-6">{ "From" }</div>
                                        <div className="col-xs-6">{ "To" }</div>
                                        <div className="col-xs-6">
                                            {
                                                target.fromPack &&
                                                <FormInput
                                                    label="Package"
                                                    name="fromPackage"
                                                    id="from-package"
                                                    defaultValue={ target.fromPack }
                                                    isEditable={ isEditable }
                                                />
                                            }
                                        </div>
                                        <div className="col-xs-6">
                                            {
                                                target.toPack &&
                                                <FormInput
                                                    label="Package"
                                                    name="toPackage"
                                                    id="to-package"
                                                    defaultValue={ target.toPack }
                                                    isEditable={ isEditable }
                                                />
                                            }
                                        </div>
                                        <div className="col-xs-6">
                                            {
                                                target.fromVersion &&
                                                <FormInput
                                                    label="Version"
                                                    name="fromVersion"
                                                    id="from-version"
                                                    defaultValue={ target.fromVersion }
                                                    isEditable={ isEditable }
                                                />
                                            }
                                        </div>
                                        <div className="col-xs-6">
                                            {
                                                target.toVersion &&
                                                <FormInput
                                                    label="Package"
                                                    name="toversion"
                                                    id="to-version"
                                                    defaultValue={ target.toVersion }
                                                    isEditable={ isEditable }
                                                />
                                            }
                                        </div>
                                    </div>
                                )
                            })
                        }
                        </div>
                }
            </div>
        );
    }
}

UpdateDetails.propTypes = {
    details: PropTypes.object.isRequired,
    isEditable: PropTypes.bool,
};

export default UpdateDetails;
