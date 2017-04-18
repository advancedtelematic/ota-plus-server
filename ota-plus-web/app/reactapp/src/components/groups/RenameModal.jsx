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
class RenameModal extends Component {
    @observable submitButtonDisabled = true;

    constructor(props) {
        super(props);
        this.renameHandler = new AsyncStatusCallbackHandler(props.groupsStore, 'groupsRenameAsync', this.handleResponse.bind(this));
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
    submitForm() {
        let data = serialize(document.querySelector('#group-rename-form'), { hash: true });
        this.props.groupsStore.renameGroup(this.props.groupId, data.groupName);
    }
    handleResponse() {
        let data = serialize(document.querySelector('#group-rename-form'), { hash: true });
        this.props.groupsStore._updateGroupData(this.props.groupId, data);
        this.props.hide();
    }
    render() {
        const { shown, hide, groupId, groupsStore } = this.props;
        const group = groupId ? groupsStore._getGroup(groupId) : null;
        const form = (
            group ?
                <Form
                    onValid={this.enableButton.bind(this)}
                    onInvalid={this.disableButton.bind(this)}
                    onValidSubmit={this.submitForm.bind(this)}
                    id="group-rename-form">
                    <AsyncResponse 
                        handledStatus="error"
                        action={groupsStore.groupsRenameAsync}
                        errorMsg={(groupsStore.groupsRenameAsync.data ? groupsStore.groupsRenameAsync.data.description : null)}
                    />
                    <div className="row">
                        <div className="col-xs-12">
                            <FormsyText
                                name="groupName"
                                value={group.groupName}
                                floatingLabelText="Group name"
                                className="input-wrapper"
                                disabled={groupsStore.groupsRenameAsync.isFetching}
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
                                    className="link-cancel">
                                    Cancel
                                </a>
                                <FlatButton
                                    label="Rename group"
                                    type="submit"
                                    className="btn-main"
                                    disabled={this.submitButtonDisabled || groupsStore.groupsRenameAsync.isFetching}
                                />
                            </div>
                        </div>
                    </div>
                </Form>
            :
                <span/>
        );
        return (
            <Modal 
                title="Rename group"
                className="rename-group-modal"
                content={form}
                shown={shown}
            />
        );
    }
}

RenameModal.propTypes = {
    shown: PropTypes.bool.isRequired,
    hide: PropTypes.func.isRequired,
    groupId: PropTypes.string,
    groupsStore: PropTypes.object.isRequired
}

export default RenameModal;