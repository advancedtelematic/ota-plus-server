import React, { Component, PropTypes } from 'react';
import { observer, inject } from 'mobx-react';
import { AsyncResponse, Form, FormInput } from '../../../../partials';

const CreateStaticGroup = inject("stores")(observer(({stores, markStepAsFinished, markStepAsNotFinished}) => {
    const { groupsStore } = stores;
    return (
		<Form                
            id="static-group-create-form">
            <AsyncResponse 
                handledStatus="error"
                action={groupsStore.groupsCreateAsync}
                errorMsg={(groupsStore.groupsCreateAsync.data ? groupsStore.groupsCreateAsync.data.description : null)}
            />
            <div className="row">
                <div className="col-xs-10">
                    <div className="group-name-input">
                        <FormInput
                            name="groupName"
                            className="input-wrapper"
                            isEditable={!groupsStore.groupsCreateAsync.isFetching}
                            title={"Group Name"}
                            label={"Group Name"}
                            placeholder={"Name"}
                            onValid={() => { markStepAsFinished() }}
                            onInvalid={() => { markStepAsNotFinished() }}
                            statusIconShown={true}
                        />
                    </div>
                </div>
            </div>
        </Form>
    );
}));

CreateStaticGroup.propTypes = {
	stores: PropTypes.object
}

export default CreateStaticGroup;