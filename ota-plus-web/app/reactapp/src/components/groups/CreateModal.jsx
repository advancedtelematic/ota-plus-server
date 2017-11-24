import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Modal, AsyncResponse } from '../../partials';
import { Form } from 'formsy-react';
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
    submitForm() {
        let data = serialize(document.querySelector('#group-create-form'), { hash: true });
        this.props.groupsStore.createGroup(data.groupName);
    }
    handleResponse() {
        let data = serialize(document.querySelector('#group-create-form'), { hash: true });
        this.props.selectGroup({type: 'real', name: data.groupName, id: this.props.groupsStore.latestCreatedGroupId});
        this.props.devicesStore.fetchDevicesAfterGroupCreation();
        this.props.hide();
    }
    render() {
        const { shown, hide, groupsStore } = this.props;
        const form = (
            <Form
                onValid={this.enableButton.bind(this)}
                onInvalid={this.disableButton.bind(this)}
                onValidSubmit={this.submitForm.bind(this)}
                id="group-create-form">
                <AsyncResponse 
                    handledStatus="error"
                    action={groupsStore.groupsCreateAsync}
                    errorMsg={(groupsStore.groupsCreateAsync.data ? groupsStore.groupsCreateAsync.data.description : null)}
                />
                <div className="row">
                    <div className="col-xs-12">
                        <FormsyText
                            name="groupName"
                            floatingLabelText="Group name"
                            className="input-wrapper"
                            underlineFocusStyle={!window.atsGarageTheme || window.otaPlusMode ? {borderColor: '#fa9872'} : {}}
                            floatingLabelFocusStyle={!window.atsGarageTheme || window.otaPlusMode ? {color: '#fa9872'} : {}}
                            ref="groupName"
                            id="group-name"
                            disabled={groupsStore.groupsCreateAsync.isFetching}
                            validations={{minLength: 2}}
                            updateImmediately
                            required
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
                            <FlatButton
                                label="Add group"
                                type="submit"
                                className="btn-main"
                                id="add"
                                disabled={this.submitButtonDisabled || groupsStore.groupsCreateAsync.isFetching}
                            />
                        </div>
                    </div>
                </div>
            </Form>
        );
        return (
            <Modal 
                title="Add new group"
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