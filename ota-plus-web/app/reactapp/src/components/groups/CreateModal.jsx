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
        this.renameHandler = new AsyncStatusCallbackHandler(props.groupsStore, 'groupsRenameAsync', this.handleRenameResponse.bind(this));
    }
    componentWillMount() {
        const { action = 'create' } = this.props;
        if(action === 'rename') { 
            this.enableButton();
        }
    }
    componentWillUnmount() {
        this.createHandler();
        this.renameHandler();
    }
    enableButton() {
        this.submitButtonDisabled = false;
    }
    disableButton() {
        this.submitButtonDisabled = true;
    }
    submitForm(e) {
        if(e) e.preventDefault();
        const {action = 'create', groupsStore} = this.props;
        let data = serialize(document.querySelector('#group-create-form'), { hash: true });
        if (action === 'rename') {
            this.props.groupsStore.renameGroup(groupsStore.selectedGroup.id, data.groupName);
        } else {
            this.props.groupsStore.createGroup(data.groupName);
        }
    }
    handleResponse() {
        let data = serialize(document.querySelector('#group-create-form'), { hash: true });
        this.props.selectGroup({type: 'real', name: data.groupName, id: this.props.groupsStore.latestCreatedGroupId});
        this.props.groupsStore._prepareGroups();
        this.props.hide();
    }
    handleRenameResponse() {
        this.props.hide();
    }
    render() {
        const { action = 'create', shown, hide, groupsStore, modalTitle = 'Add new group', buttonText = 'Add' } = this.props;
        const form = (
            <Form                
                onSubmit={this.submitForm.bind(this)}
                id="group-create-form">
                <AsyncResponse 
                    handledStatus="error"
                    action={groupsStore.groupsCreateAsync}
                    errorMsg={(groupsStore.groupsCreateAsync.data ? groupsStore.groupsCreateAsync.data.description : null)}
                />
                <AsyncResponse 
                    handledStatus="error"
                    action={groupsStore.groupsRenameAsync}
                    errorMsg={(groupsStore.groupsRenameAsync.data ? groupsStore.groupsRenameAsync.data.description : null)}
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
                            defaultValue={action === 'rename' ? groupsStore.selectedGroup.name : ''}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <div className="body-actions">
                            <button
                                disabled={this.submitButtonDisabled || groupsStore.groupsCreateAsync.isFetching}
                                className="btn-primary"
                                id="add"
                            >
                                {buttonText}
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
                            {modalTitle}
                            <div className="top-actions flex-end">
                                <div className="modal-close" onClick={hide}>
                                    <img src="/assets/img/icons/close.svg" alt="Icon" />
                                </div>
                            </div>
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