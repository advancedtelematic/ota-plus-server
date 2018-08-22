import React, { Component, PropTypes } from 'react';
import { Form } from 'formsy-react';
import { FormInput, FormTextarea, Loader } from '../../../partials';
import { observer, inject } from 'mobx-react';
import { SelectableList } from '../../../partials/lists';

@inject("stores")
@observer
class Step1 extends Component {
    componentWillMount() {
        const { hardwareStore } = this.props.stores;
        hardwareStore.fetchHardwareIds();
    }
    render() {
        const { hardwareStore } = this.props.stores;
        const { wizardData, onStep1DataSelect } = this.props;
        return (
            <div className="update-modal">
                <Form
                    id="update-create-form"
                >
                    <div className="row name-container">
                        <div className="col-xs-6">
                            <FormInput
                                label="Update Name"
                                placeholder="Name"
                                name="updateName"
                                id="create-new-update-name"
                                defaultValue={wizardData[0].name}
                                onChange={(e) => { onStep1DataSelect('name', e.target.value) }}
                            />
                        </div>
                        <div className="col-xs-6">
                            <FormTextarea
                                label="Description"
                                placeholder="Type here"
                                rows={ 5 }
                                name="updateDescription"
                                id="create-new-update-description"
                                defaultValue={wizardData[0].description}
                                onChange={(e) => { onStep1DataSelect('description', e.target.value) }}
                            />
                        </div>
                    </div>

                    <div className="row hardware-container">
                        <div className="col-xs-12">
                            <div className="ids-list">
                                <label className="c-form__label">{ "Select Hardware ids" }</label>
                                    {hardwareStore.hardwareIdsFetchAsync.isFetching ?
                                        <div className="wrapper-center">
                                            <Loader/>
                                        </div>
                                    :
                                        <SelectableList
                                            items={hardwareStore.hardwareIds}
                                            selectedItems={wizardData[0].hardwareIds}
                                            onItemSelect={(item) => { onStep1DataSelect('hardwareId', item) }}
                                        />
                                    }
                            </div>
                        </div>
                    </div>
                </Form>
            </div>
        );
    }
}

export default Step1;