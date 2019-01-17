/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Avatar, Button } from 'antd';

import { Loader, AsyncResponse } from '../../partials';
import { resetAsync } from '../../utils/Common';
import { AsyncStatusCallbackHandler } from '../../utils';

@inject('stores')
@observer
class EditProfile extends Component {
  @observable renameDisabled = true;
  @observable oldName = '';
  @observable newName = '';
  @observable newNameLength = 0;

  constructor(props) {
    super(props);
    const { userStore } = props.stores;
    this.renameHandler = new AsyncStatusCallbackHandler(userStore, 'userUpdateAsync', this.handleResponse.bind(this));
  }
  componentWillReceiveProps(nextProps) {
    const { userStore } = nextProps.stores;
    if (userStore.user.fullName) {
      this.renameDisabled = true;
      this.oldName = userStore.user.fullName;
      this.newName = userStore.user.fullName;
      this.newNameLength = userStore.user.fullName.length;
    }
  }
  componentWillUnmount() {
    const { userStore } = this.props.stores;
    resetAsync(userStore.userUpdateAsync);
    resetAsync(userStore.userChangePasswordAsync);
    this.renameHandler();
  }

  changePassword = e => {
    if (e) e.preventDefault();
    const { stores } = this.props;
    const { userStore } = stores;
    userStore.changePassword();
  };

  enableRename = e => {
    if (this.renameDisabled) {
      this.renameDisabled = false;
      this.focusTextInput();
      e.target.classList.add('hide');
    }
  };

  cancelRename = () => {
    this.renameDisabled = true;
    this.newName = this.oldName;
    this.newNameLength = this.oldName.length;
    this.focusTextInput();
    this.clickableArea.classList.remove('hide');
  };

  userTypesName = e => {
    this.newName = e.target.value;
    this.newNameLength = e.target.value.length;
  };

  keyPressed = e => {
    if (e.key === 'Enter') {
      this.rename();
    }
  };

  rename = () => {
    const { stores } = this.props;
    const { userStore } = stores;
    this.clickableArea.classList.remove('hide');
    const data = { name: this.newName };
    userStore.updateUser(data);
  };

  handleResponse = () => {
    this.renameDisabled = true;
    this.oldName = this.newName;
    this.focusTextInput();
  };

  focusTextInput = () => {
    if (this.renameDisabled) {
      this.renameInput.setAttribute('disabled', 'true');
    } else {
      this.renameInput.removeAttribute('disabled');
      this.renameInput.focus();
    }
  };

  render() {
    const { stores } = this.props;
    const { userStore } = stores;
    return (
      <div className='profile-container' id='edit-profile'>
        {!userStore.user.fullName && userStore.userFetchAsync.isFetching ? (
          <div className='wrapper-center'>
            <Loader className='dark' />
          </div>
        ) : (
          <span>
            <AsyncResponse
              handledStatus='all'
              action={userStore.userUpdateAsync}
              errorMsg={userStore.userUpdateAsync.data ? userStore.userUpdateAsync.data.description : null}
              successMsg='Profile has been updated.'
            />
            <AsyncResponse
              handledStatus='all'
              action={userStore.userChangePasswordAsync}
              errorMsg={userStore.userChangePasswordAsync.data ? userStore.userChangePasswordAsync.data.description : null}
              successMsg='An email with password resetting instructions has been sent to your email account.'
            />
            <div className='section-header'>
              <div className='column' />
              <div className='column name-header'>Name</div>
              <div className='column'>Mail</div>
              <div className='column' />
            </div>
            <div className='user-info'>
              <div className='column'>
                {window.atsGarageTheme ? (
                  <Avatar src={userStore.user.picture ? userStore.user.picture : '/assets/img/icons/profile.png'} className='icon-profile' id='user-avatar' />
                ) : (
                  <Avatar src='/assets/img/icons/Settings_Icon_big.svg' className='icon-profile' id='user-avatar' />
                )}
              </div>
              <div className='column name' id='user-name'>
                <div className='rename-box'>
                  <div
                    onClick={this.enableRename}
                    ref={clickableArea => {
                      this.clickableArea = clickableArea;
                    }}
                    className='rename-box__clickable-area'
                  />

                  <input
                    className='rename-box__input rename-box__input--black'
                    type='text'
                    ref={input => {
                      this.renameInput = input;
                    }}
                    disabled
                    onKeyPress={this.keyPressed}
                    value={this.newName ? this.newName : userStore.user.fullName}
                    onChange={this.userTypesName}
                  />

                  <div className='rename-box__actions rename-box__actions--big'>
                    {this.renameDisabled ? (
                      <img src='/assets/img/icons/black/edit_pencil.svg' className='rename-box__icon rename-box__icon--edit edit' alt='Icon' />
                    ) : (
                      <span className='rename-box__user-actions'>
                        {this.newNameLength ? <img src='/assets/img/icons/black/tick.svg' className='rename-box__icon rename-box__icon--save save' alt='Icon' onClick={this.rename} /> : null}
                        <img src='/assets/img/icons/black/cancel-thin.svg' alt='Icon' className='rename-box__icon rename-box__icon--cancel cancel' onClick={this.cancelRename} />
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className='column email' id='user-email'>
                {userStore.user.email}
              </div>
              <div className='column'>
                <Button htmlType='button' className='btn-link add-button' id='change-password-link' onClick={this.changePassword}>
                  Change password
                </Button>
              </div>
            </div>
          </span>
        )}
      </div>
    );
  }
}

export default EditProfile;
