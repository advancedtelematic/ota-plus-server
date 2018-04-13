import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { FlatButton, Avatar } from 'material-ui';
import serialize from 'form-serialize';
import { Loader, AsyncResponse, Form, FormInput } from '../../partials';
import { resetAsync } from '../../utils/Common';
import { AsyncStatusCallbackHandler } from '../../utils';

@observer
class EditProfile extends Component {
    @observable renameDisabled = true;
    @observable oldName = '';
    @observable newName = '';
    @observable newNameLength = 0;

    constructor(props) {
        super(props);
        this.changePassword = this.changePassword.bind(this);
        this.enableRename = this.enableRename.bind(this);
        this.cancelRename = this.cancelRename.bind(this);
        this.rename = this.rename.bind(this);
        this.focusTextInput = this.focusTextInput.bind(this);
        this.userTypesName = this.userTypesName.bind(this);
        this.keyPressed = this.keyPressed.bind(this);
        this.renameHandler = new AsyncStatusCallbackHandler(props.userStore, 'userUpdateAsync', this.handleResponse.bind(this));
    }
    componentWillReceiveProps(nextProps) {
        const { userStore } = nextProps;
        if(userStore.user.fullName) {
            this.renameDisabled = true;
            this.oldName = userStore.user.fullName;
            this.newName = userStore.user.fullName;
            this.newNameLength = userStore.user.fullName.length;
        }
    }
    componentWillUnmount() {
        const { userStore } = this.props;
        resetAsync(userStore.userUpdateAsync);
        resetAsync(userStore.userChangePasswordAsync);
        this.renameHandler();
    }
    changePassword(e) {
        if(e) e.preventDefault();
        this.props.userStore.changePassword();
    }
    enableRename(e) {
        if (this.renameDisabled) {
            this.renameDisabled = false;
            this.focusTextInput();
            e.target.classList.add('hide')
        }
    }
    cancelRename() {
        this.renameDisabled = true; 
        this.newName = this.oldName;
        this.newNameLength = this.oldName.length;
        this.focusTextInput();
        this.clickableArea.classList.remove('hide');
    }
    userTypesName(e) {
        this.newName = e.target.value;
        this.newNameLength = e.target.value.length;
    }
    keyPressed(e) {
        if(e.key === 'Enter') {
            this.rename();
        }
    }
    rename() {
        const { userStore } = this.props;
        this.clickableArea.classList.remove('hide');
        let data = {name: this.newName};
        this.props.userStore.updateUser(data);
    }
    handleResponse() {
        this.renameDisabled = true;
        this.oldName = this.newName;
        this.focusTextInput();
    }
    focusTextInput() {
        if (this.renameDisabled) {
            this.renameInput.setAttribute('disabled','true');
        } else {
            this.renameInput.removeAttribute('disabled');
            this.renameInput.focus();
        }
    }
    render() {
        const { userStore } = this.props;
        return (
            <div className="profile-container" id="edit-profile">
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
                        <div className="section-header">
                            <div className="column">
                            </div>
                            <div className="column name-header">
                                Name
                            </div>
                            <div className="column">
                                Mail
                            </div>
                            <div className="column">
                            </div>
                        </div>                        
                        <div className="user-info">
                            <div className="column">                                
                                {window.atsGarageTheme ?
                                    <Avatar
                                        src={userStore.user.picture ?
                                            userStore.user.picture
                                        :
                                            "/assets/img/icons/profile.png"
                                        }
                                        className="icon-profile"
                                        id="user-avatar"
                                    />
                                :
                                    <Avatar
                                        src="/assets/img/icons/Settings_Icon_big.svg"
                                        className="icon-profile"
                                        id="user-avatar"
                                    />   
                                }
                            </div>
                            <div className="column name" id="user-name">

                                <div className="rename-container">
                                    <div onClick={this.enableRename}
                                         ref={(clickableArea) => {this.clickableArea = clickableArea}}
                                         className="clickable-area"
                                         style={{width: '85%', height: '51px', position: 'absolute'}}/>

                                    <input type="text"
                                       ref={(input) => {this.renameInput = input}}
                                       disabled
                                       onKeyPress={this.keyPressed}
                                       value={this.newName} onChange={this.userTypesName} />

                                    {this.renameDisabled ?
                                        <img src="/assets/img/icons/black/edit_pencil.svg" className="edit" alt="Icon" style={{cursor: 'auto'}} />
                                    :
                                        <div className="icons">
                                            {this.newNameLength ?
                                                <img src="/assets/img/icons/black/tick.svg" className="rename" alt="Icon" onClick={this.rename} />
                                            :
                                                null
                                            }
                                            <img src="/assets/img/icons/close.svg" alt="Icon" className="cancel" onClick={this.cancelRename} />
                                        </div>
                                    }     
                                </div>
      
                            </div>
                            <div className="column email" id="user-email">
                                {userStore.user.email}
                            </div>
                            <div className="column">
                                <a href="#" className="add-button" id="change-password-link" onClick={this.changePassword}>
                                    Change password
                                </a>
                            </div>
                        </div>
                    </span>
                }
            </div>
        );
    }
}

EditProfile.propTypes = {
    userStore: PropTypes.object
};

export default EditProfile;