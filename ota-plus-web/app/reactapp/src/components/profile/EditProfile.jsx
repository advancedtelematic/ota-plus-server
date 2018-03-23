import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { FlatButton, Avatar } from 'material-ui';
import serialize from 'form-serialize';
import { Loader, AsyncResponse, Form, FormInput } from '../../partials';
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
    submitForm(e) {
        if(e) e.preventDefault();
        let data = serialize(document.querySelector('#user-update-form'), { hash: true })
        this.props.userStore.updateUser(data);
    }
    changePassword(e) {
        if(e) e.preventDefault();
        this.props.userStore.changePassword();
    }
    render() {
        const { userStore } = this.props;
        return (
            <main id="edit-profile">
                <div className="content">
                    <div className="subheader">
                        Personal information
                    </div>
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
                            <div className="inner-container">                            

                                <Form                
                                    onSubmit={this.submitForm.bind(this)}
                                    id="user-update-form">

                                    <div className="form-input-container">
                                        <FormInput
                                            onValid={this.enableButton.bind(this)}
                                            onInvalid={this.disableButton.bind(this)}
                                            name="name"
                                            className="input-wrapper"
                                            title={"Name"}
                                            label={"Name"}
                                            placeholder={"Name"}
                                            defaultValue={userStore.user.fullName}
                                            wrapperWidth={"50%"}
                                            id={"display-name"}
                                        />
                                    </div>
                                    <div className="form-input-container">
                                        <FormInput
                                            name="login"
                                            className="input-wrapper"
                                            title={"Login"}
                                            label={"Login"}
                                            placeholder={"Login"}
                                            defaultValue={userStore.user.email}
                                            isEditable={false}
                                            wrapperWidth={"50%"}
                                            id={"login"}
                                        />
                                    </div>
                                    <div className="form-input-container">
                                        <a href="#" className="add-button" onClick={this.changePassword} id="change-password">
                                            Change password
                                        </a>
                                    </div>
                                    <div className="form-submit-container">
                                         <button
                                            className="btn-primary"
                                            id="save-changes"
                                            disabled={this.submitButtonDisabled || userStore.userUpdateAsync.isFetching}
                                            id="save-changes"
                                        >
                                            Save changes
                                        </button>
                                    </div>
                                </Form>
                                
                            </div>
                        </span>
                    }
                </div>
            </main>
        );
    }
}

EditProfile.propTypes = {
    userStore: PropTypes.object
};

export default EditProfile;