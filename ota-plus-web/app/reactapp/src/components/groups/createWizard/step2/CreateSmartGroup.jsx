import React from 'react';
import { AsyncResponse, Form, FormInput } from '../../../../partials';
import SmartFilters from './SmartFilters';
import { observer, inject } from 'mobx-react';

const CreateSmartGroup = inject("stores")(observer(({ markStepAsFinished, markStepAsNotFinished, stores, setFilter }) => {
    const { groupsStore } = stores;

    return (
        <Form
            id="smart-group-create-form">
            <AsyncResponse
                handledStatus="error"
                action={groupsStore.groupsCreateAsync}
                errorMsg={(groupsStore.groupsCreateAsync.data ? groupsStore.groupsCreateAsync.data.description : null)}
            />
            <div className="wizard__row-wrapper">
                <div className="row">
                    <div className="col-xs-12">
                        <FormInput
                            name="groupName"
                            className="input-wrapper"
                            id="smart-group-name"
                            title={"Name"}
                            label={"Name"}
                            placeholder={"Name"}
                            onValid={() => { markStepAsFinished() }}
                            onInvalid={() => { markStepAsNotFinished() }}
                            statusIconShown={true}
                        />
                    </div>
                </div>
            </div>
            <div className="wizard__row-wrapper">
                <div className="row">
                    <div className="col-xs-12">
                        <SmartFilters
                            layout={[1, 1, 3]}
                            setFilter={setFilter}
                        />
                    </div>
                </div>
            </div>
        </Form>
    );
}))

export default CreateSmartGroup;