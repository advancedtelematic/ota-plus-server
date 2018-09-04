import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Modal, AsyncResponse, Form, FormInput } from '../../partials';
import { FormsyText } from 'formsy-material-ui/lib';
import { FlatButton } from 'material-ui';
import serialize from 'form-serialize';
import { AsyncStatusCallbackHandler } from '../../utils';

@inject('stores')
@observer
class RenameModal extends Component {
    @observable submitButtonDisabled = true;

    constructor(props) {
        super(props);
        const { groupsStore } = props.stores;
        
        this.renameHandler = new AsyncStatusCallbackHandler(groupsStore, 'groupsRenameAsync', this.handleRenameResponse.bind(this));
    }
    componentWillMount() {
        this.enableButton();
    }
    componentWillUnmount() {
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
        const { groupsStore } = this.props.stores;
        let data = serialize(document.querySelector('#group-rename-form'), { hash: true });
        groupsStore.renameGroup(groupsStore.selectedGroup.id, data.groupName);
    }
    handleRenameResponse() {
        this.props.hide();
    }
    render() {
        const { action, shown, hide } = this.props;
        const { groupsStore } = this.props.stores;
        const form = (
            <Form                
                onSubmit={this.submitForm.bind(this)}
                id="group-rename-form">
                <AsyncResponse 
                    handledStatus="error"
                    action={groupsStore.groupsRenameAsync}
                    errorMsg={(groupsStore.groupsRenameAsync.data ? groupsStore.groupsRenameAsync.data.description : null)}
                />
                <div className="row">
                    <div className="col-xs-8">
                        <div className="group-name-input">
                            <FormInput
                                onValid={this.enableButton.bind(this)}
                                onInvalid={this.disableButton.bind(this)}
                                name="groupName"
                                className="input-wrapper"
                                isEditable={!groupsStore.groupsRenameAsync.isFetching}
                                title={"Group Name"}
                                label={"Group Name"}
                                placeholder={"Name"}
                                defaultValue={groupsStore.selectedGroup.groupName}
                            />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <div className="body-actions">
                            <button
                                disabled={this.submitButtonDisabled || groupsStore.groupsRenameAsync.isFetching}
                                className="btn-primary"
                                id="add"
                            >
                                Edit
                            </button>
                        </div>
                    </div>
                </div>
            </Form>
        );
        return (
            <Modal 
                title={
                    <div>
                        Edit name
                    </div>
                }
                topActions={
                    <div className="top-actions flex-end">
                        <div className="modal-close" onClick={hide}>
                            <img src="/assets/img/icons/close.svg" alt="Icon" />
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

RenameModal.propTypes = {
    shown: PropTypes.bool.isRequired,
    hide: PropTypes.func.isRequired,
    stores: PropTypes.object
}

export default RenameModal;