import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Modal, AsyncResponse, Form, FormInput } from '../../partials';
import { FormsyText } from 'formsy-material-ui/lib';
import { FlatButton } from 'material-ui';
import serialize from 'form-serialize';
import { AsyncStatusCallbackHandler } from '../../utils';

@observer
class CreateModal extends Component {
    @observable submitButtonDisabled = true;

    constructor(props) {
        super(props);
        this.createHandler = new AsyncStatusCallbackHandler(props.groupsStore, 'groupsCreateAsync', this.handleResponse.bind(this));
    }
    componentWillUnmount() {
        this.createHandler();
    }
    enableButton() {
        this.submitButtonDisabled = false;
    }
    disableButton() {
        this.submitButtonDisabled = true;
    }
    submitForm(e) {
        if(e) e.preventDefault();
        let data = serialize(document.querySelector('#group-create-form'), { hash: true });
        this.props.groupsStore.createGroup(data.groupName);
    }
    handleResponse() {
        let data = serialize(document.querySelector('#group-create-form'), { hash: true });
        this.props.selectGroup({type: 'real', name: data.groupName, id: this.props.groupsStore.latestCreatedGroupId});
        this.props.devicesStore.fetchDevices('', this.props.groupsStore.latestCreatedGroupId);
        this.props.hide();
    }
    render() {
        const { shown, hide, groupsStore } = this.props;
        const form = (
            <Form                
                onSubmit={this.submitForm.bind(this)}
                id="group-create-form">
                <AsyncResponse 
                    handledStatus="error"
                    action={groupsStore.groupsCreateAsync}
                    errorMsg={(groupsStore.groupsCreateAsync.data ? groupsStore.groupsCreateAsync.data.description : null)}
                />
                <div className="row">
                    <div className="col-xs-12">
                        <FormInput
                            onValid={this.enableButton.bind(this)}
                            onInvalid={this.disableButton.bind(this)}
                            name="groupName"
                            className="input-wrapper"
                            isEditable={!groupsStore.groupsCreateAsync.isFetching}
                            title={"Group Name"}
                            label={"Group Name"}
                            placeholder={"Name"}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <div className="body-actions">
                            <a href="#"
                                onClick={hide}
                                className="link-cancel"
                                id="cancel">
                                Cancel
                            </a>
                            <button
                                disabled={this.submitButtonDisabled || groupsStore.groupsCreateAsync.isFetching}
                                className="btn-primary"
                                id="add"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            </Form>
        );
        return (
            <Modal 
                title={
                    <div className="heading">
                        <div className="internal">
                            Add new group
                        </div>
                    </div>
                }
                className="create-group-modal"
                content={form}
                shown={shown}
            />
        );
    }
}

CreateModal.propTypes = {
    shown: PropTypes.bool.isRequired,
    hide: PropTypes.func.isRequired,
    groupsStore: PropTypes.object.isRequired,
    selectGroup: PropTypes.func.isRequired
}

export default CreateModal;