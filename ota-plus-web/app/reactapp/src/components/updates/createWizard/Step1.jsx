import React, { Component } from 'react';
import { Form } from 'formsy-react';
import { FormInput, FormTextarea, Loader } from '../../../partials';
import { observer, inject } from 'mobx-react';
import { SelectableListItem } from '../../../partials/lists';
import _ from 'underscore';
import { _contains } from "../../../utils/Collection";

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

        let hardwareList = [];
        _.each(hardwareStore.hardwareIds, id => {
            hardwareList.push({
                type: 'hardware',
                name: id,
            });
        });

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
                                defaultValue={ wizardData.name }
                                onChange={ (e) => {
                                    onStep1DataSelect('name', e.target.value)
                                } }
                            />
                        </div>
                        <div className="col-xs-6">
                            <FormTextarea
                                label="Description"
                                placeholder="Type here"
                                rows={ 5 }
                                name="updateDescription"
                                id="create-new-update-description"
                                defaultValue={ wizardData.description }
                                onChange={ (e) => {
                                    onStep1DataSelect('description', e.target.value)
                                } }
                            />
                        </div>
                    </div>
                    <label className="c-form__label">{ "Select Hardware ids" }</label>
                    <div className="row hardware-container">
                        <div className="col-xs-12">
                            <div className="ids-list">
                                { hardwareStore.hardwareIdsFetchAsync.isFetching ?
                                    <div className="wrapper-center">
                                        <Loader/>
                                    </div>
                                    :
                                    _.map(hardwareList, item => {
                                        const { selectedHardwares } = wizardData;
                                        const selected = _contains(selectedHardwares, item);
                                        item.type = 'hardware';
                                        return (
                                            <SelectableListItem
                                                key={ item.name }
                                                item={ item }
                                                selected={ selected }
                                                onItemSelect={ (item) => {
                                                    onStep1DataSelect('hardwareId', item)
                                                } }
                                            />
                                        )
                                    })
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