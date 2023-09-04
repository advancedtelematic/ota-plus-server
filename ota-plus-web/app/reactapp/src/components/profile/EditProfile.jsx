/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Avatar, Button } from 'antd';
import { withTranslation } from 'react-i18next';

import { Loader, AsyncResponse } from '../../partials';
import { resetAsync } from '../../utils/Common';
import { AsyncStatusCallbackHandler, MetaData } from '../../utils';
import { sendAction, setAnalyticsView } from '../../helpers/analyticsHelper';
import { OTA_PROFILE_RENAME } from '../../constants/analyticsActions';
import { ANALYTICS_VIEW_PROFILE } from '../../constants/analyticsViews';
import { assets, CANCEL_ICON_THIN, SETTINGS_ICON_BIG, TICK_ICON_BLACK } from '../../config';

@inject('stores')
@observer
class EditProfile extends Component {
  @observable renameDisabled = true;

  @observable oldName = '';

  @observable newName = '';

  @observable newNameLength = 0;

  changePasswordEnabled = false;

  constructor(props) {
    super(props);
    const { stores, t } = props;
    const { userStore } = stores;
    this.renameHandler = new AsyncStatusCallbackHandler(userStore, 'userUpdateAsync', this.handleResponse.bind(this));
    this.title = t('profile.title');
  }

  componentDidMount() {
    setAnalyticsView(ANALYTICS_VIEW_PROFILE);
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
    const { stores } = this.props;
    const { userStore } = stores;
    resetAsync(userStore.userUpdateAsync);
    resetAsync(userStore.userChangePasswordAsync);
    this.renameHandler();
  }

  changePassword = (e) => {
    if (e) e.preventDefault();
    const { stores } = this.props;
    const { userStore } = stores;
    userStore.changePassword();
  };

  enableRename = (e) => {
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

  userTypesName = (e) => {
    this.newName = e.target.value;
    this.newNameLength = e.target.value.length;
  };

  keyPressed = (e) => {
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
    sendAction(OTA_PROFILE_RENAME);
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
      <div className="profile-container" id="edit-profile">
        <MetaData title={this.title}>
          {!userStore.user.fullName && userStore.userFetchAsync.isFetching ? (
            <div className="wrapper-center">
              <Loader className="dark" />
            </div>
          ) : (
            <span>
              <AsyncResponse
                handledStatus="all"
                action={userStore.userUpdateAsync}
                errorMsg={userStore.userUpdateAsync.data ? userStore.userUpdateAsync.data.description : null}
                successMsg="Profile has been updated."
              />
              <AsyncResponse
                handledStatus="all"
                action={userStore.userChangePasswordAsync}
                errorMsg={
                  userStore.userChangePasswordAsync.data ? userStore.userChangePasswordAsync.data.description : null
                }
                successMsg="An email with password resetting instructions has been sent to your email account."
              />
              <div className="section-header">
                <div className="column" />
                <div className="column name-header">Name</div>
                <div className="column">Mail</div>
                <div className="column" />
              </div>
              <div className="user-info">
                <div className="column">
                  {window.atsGarageTheme ? (
                    <Avatar
                      src={userStore.user.picture ? userStore.user.picture : assets.DEFAULT_PROFILE_PICTURE}
                      className="icon-profile"
                      id="user-avatar"
                    />
                  ) : (
                    <Avatar src={SETTINGS_ICON_BIG} className="icon-profile" id="user-avatar" />
                  )}
                </div>
                <div className="column name" id="user-name">
                  <div className="rename-box">
                    <div
                      onClick={this.enableRename}
                      ref={(clickableArea) => {
                        this.clickableArea = clickableArea;
                      }}
                      className="rename-box__clickable-area"
                    />

                    <input
                      className="rename-box__input rename-box__input--black"
                      type="text"
                      ref={(input) => {
                        this.renameInput = input;
                      }}
                      disabled
                      onKeyPress={this.keyPressed}
                      value={this.newName ? this.newName : userStore.user.fullName}
                      onChange={this.userTypesName}
                    />

                    <div className="rename-box__actions rename-box__actions--big">
                      {this.renameDisabled ? (
                        <div className="rename-box__icon--edit edit">{'Rename'}</div>
                      ) : (
                        <span className="rename-box__user-actions">
                          {this.newNameLength ? (
                            <img
                              src={TICK_ICON_BLACK}
                              className="rename-box__icon rename-box__icon--save save"
                              alt="Icon"
                              onClick={this.rename}
                            />
                          ) : null}
                          <img
                            src={CANCEL_ICON_THIN}
                            alt="Icon"
                            className="rename-box__icon rename-box__icon--cancel cancel"
                            onClick={this.cancelRename}
                          />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="column email" id="user-email">
                  {userStore.user.email}
                </div>
                <div className="column">
                  {this.changePasswordEnabled && (
                  <Button
                    htmlType="button"
                    className="btn-link add-button"
                    id="change-password-link"
                    onClick={this.changePassword}
                  >
                        Change password
                  </Button>
                  )}
                </div>
              </div>
            </span>
          )}
        </MetaData>
      </div>
    );
  }
}

EditProfile.propTypes = {
  stores: PropTypes.shape({}),
  t: PropTypes.func.isRequired
};

export default withTranslation()(EditProfile);
