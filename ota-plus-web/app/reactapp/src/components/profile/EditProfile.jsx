import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Form } from 'formsy-react';
import { FormsyText } from 'formsy-material-ui/lib';
import { FlatButton, Avatar } from 'material-ui';
import serialize from 'form-serialize';
import { Loader, AsyncResponse } from '../../partials';
import { resetAsync } from '../../utils/Common';

@observer
class EditProfile extends Component {
    @observable submitButtonDisabled = true;

    constructor(props) {
        super(props);
        this.submitForm = this.submitForm.bind(this);
        this.changePassword = this.changePassword.bind(this);
    }
    componentWillUnmount() {
        const { userStore } = this.props;
        resetAsync(userStore.userUpdateAsync);
        resetAsync(userStore.userChangePasswordAsync);
    }
    enableButton() {
        this.submitButtonDisabled = false;
    }
    disableButton() {
        this.submitButtonDisabled = true;
    }
    submitForm() {
        let data = serialize(document.querySelector('#user-update-form'), { hash: true })
        this.props.userStore.updateUser(data);
    }
    changePassword() {
        this.props.userStore.changePassword();
    }
    render() {
        const { userStore } = this.props;
        return (
            <main id="edit-profile">
                <div className="title">
                    <img src="/assets/img/icons/edit_black.png" alt=""/>
                    Edit profile
                </div>

                <hr />

                <div className="panel panel-grey">
                    <div className="panel-heading">Personal information</div>
                    <div className="panel-body">
                        {!userStore.user.fullName && userStore.userFetchAsync.isFetching ? 
                            <div className="wrapper-center">
                                <Loader 
                                    className="dark"
                                />
                            </div>
                        :
                            <span>
                                <AsyncResponse 
                                    handledStatus="all"
                                    action={userStore.userUpdateAsync}
                                    errorMsg={(userStore.userUpdateAsync.data ? userStore.userUpdateAsync.data.description : null)}
                                    successMsg="Profile has been updated."
                                />
                                <AsyncResponse 
                                    handledStatus="all"
                                    action={userStore.userChangePasswordAsync}
                                    errorMsg={(userStore.userChangePasswordAsync.data ? userStore.userChangePasswordAsync.data.description : null)}
                                    successMsg="An email with password resetting instructions has been sent to your email account."
                                />
                                <Form
                                    onValid={this.enableButton.bind(this)}
                                    onInvalid={this.disableButton.bind(this)}
                                    onValidSubmit={this.submitForm}
                                    id="user-update-form">
                                    <FormsyText
                                        name="name"
                                        floatingLabelText="Display name"
                                        className="input-wrapper"
                                        underlineFocusStyle={!window.atsGarageTheme || window.otaPlusMode ? {borderColor: '#fa9872'} : {}}
                                        floatingLabelFocusStyle={!window.atsGarageTheme || window.otaPlusMode ? {color: '#fa9872'} : {}}
                                        value={userStore.user.fullName}
                                        updateImmediately
                                        required
                                    />

                                    <FormsyText
                                        name="login"
                                        floatingLabelText="Login"
                                        className="input-wrapper"
                                        underlineFocusStyle={!window.atsGarageTheme || window.otaPlusMode ? {borderColor: '#fa9872'} : {}}
                                        floatingLabelFocusStyle={!window.atsGarageTheme || window.otaPlusMode ? {color: '#fa9872'} : {}}
                                        value={userStore.user.email}
                                        updateImmediately
                                        disabled={true}
                                    />

                                    <FlatButton
                                        label="Update details"
                                        type="submit"
                                        className="btn-main"
                                        disabled={this.submitButtonDisabled || userStore.userUpdateAsync.isFetching}
                                    />
                                </Form>
                                <FlatButton
                                    label="Change password"
                                    type="button"
                                    className="btn-main"
                                    onClick={this.changePassword}
                                />
                            </span>
                        }
                    </div>
                </div>
            </main>
        );
    }
}

EditProfile.propTypes = {
    userStore: PropTypes.object
};

export default EditProfile;