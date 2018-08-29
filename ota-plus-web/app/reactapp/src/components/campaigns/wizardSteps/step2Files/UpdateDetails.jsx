import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import _ from 'underscore';
import { FormInput, FormTextarea, FormSelect, Loader, AsyncResponse } from '../../../../partials';


@inject("stores")
@observer
class UpdateDetails extends Component {

    render() {
        const {
            name,
            description,
            source,
        } = this.props.details;

        const { isEditable } = this.props;

        return (
            <div>
                <div className="row name-container">
                    <div className="col-xs-6">
                        <FormInput
                            label="Update Name"
                            placeholder="Name"
                            name="updateName"
                            id={ "update-name-" + name }
                            defaultValue={ name }
                            isEditable={ isEditable }
                        />
                    </div>
                    <div className="col-xs-6">
                        <FormTextarea
                            label="Description"
                            placeholder="Type here"
                            rows={ 5 }
                            name="updateDescription"
                            id={ "update-description" + name }
                            defaultValue={ description }
                            isEditable={ isEditable }
                        />
                    </div>
                </div>
                <div className="row source-container">
                    <div className="col-xs-12">
                        <label className="c-form__label">{ source.id }</label>
                    </div>
                    {
                        !(source && source.details)
                        && (
                            <div className="wrapper-center">
                                { "No source information available." }
                            </div>
                        )
                    }
                </div>
            </div>
        );
    }
}

UpdateDetails.propTypes = {
    details: PropTypes.object.isRequired,
    isEditable: PropTypes.bool,
};

export default UpdateDetails;
