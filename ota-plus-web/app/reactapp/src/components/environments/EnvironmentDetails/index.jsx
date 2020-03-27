/** @format */

import React, { Component } from 'react';
import { Divider, Tooltip } from 'antd';
import { Form } from 'formsy-antd';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import isEmail from 'validator/lib/isEmail';
import { withTranslation } from 'react-i18next';
import moment from 'moment';
import WarningModal from '../../profile/WarningModal';
import { Button, OperationCompletedInfo, SearchBar } from '../../../partials';
import { sendAction } from '../../../helpers/analyticsHelper';
import {
  OTA_ENVIRONMENT_ADD_MEMBER,
  OTA_ENVIRONMENT_REMOVE_MEMBER
} from '../../../constants/analyticsActions';
import { OwnerTag, RemoveButton } from '../../profile/ProfileOrganization/styled';
import { TRASHBIN_ICON } from '../../../config';
import { REMOVAL_MODAL_TYPE, WARNING_MODAL_COLOR } from '../../../constants';

@inject('stores')
@observer
class ProfileOrganization extends Component {
  static propTypes = {
    canEdit: PropTypes.bool.isRequired,
    namespace: PropTypes.string.isRequired,
    stores: PropTypes.shape({ userStore: PropTypes.shape({}).isRequired }).isRequired,
    t: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      removalModalOpenType: undefined,
      memberAddedAt: undefined,
      selectedUserEmail: '',
      userEmail: '',
      userEmailError: false,
    };
  }

  componentWillUnmount() {
    const { stores } = this.props;
    const { userStore } = stores;
    userStore.userOrganizationUsers = [];
  }

  addRegisteredUser = (event) => {
    event.preventDefault();
    const { userEmail } = this.state;
    if (isEmail(userEmail)) {
      const { stores } = this.props;
      const { userStore } = stores;
      const { userOrganizationNamespace } = userStore;
      userStore.addUserToOrganization(userEmail, userOrganizationNamespace).then(() => {
        this.setState({ memberAddedAt: moment().format(), userEmail: '' });
        sendAction(OTA_ENVIRONMENT_ADD_MEMBER);
      });
    } else {
      this.setState({ userEmailError: true });
    }
  };

  populateRemovalModal = (t) => {
    const { stores } = this.props;
    const { userStore } = stores;
    const { user } = userStore;
    const { removalModalOpenType, selectedUserEmail } = this.state;

    switch (removalModalOpenType) {
      case REMOVAL_MODAL_TYPE.SELF_REMOVAL:
        return {
          type: WARNING_MODAL_COLOR.DEFAULT,
          title: t('profile.organization.remove-modal.title.self'),
          desc: t('profile.organization.remove-modal.desc.self'),
          cancelButtonProps: {
            title: t('profile.organization.remove-modal.cancel'),
          },
          confirmButtonProps: {
            title: t('profile.organization.remove-modal.confirm.self'),
            onClick: () => this.handleMemberRemoval(user.email),
          },
          onClose: this.closeRemovalModal,
        };
      default:
        return {
          type: WARNING_MODAL_COLOR.DANGER,
          title: t('profile.organization.remove-modal.title'),
          desc: t('profile.organization.remove-modal.desc'),
          cancelButtonProps: {
            title: t('profile.organization.remove-modal.cancel'),
          },
          confirmButtonProps: {
            title: t('profile.organization.remove-modal.confirm'),
            onClick: () => this.handleMemberRemoval(selectedUserEmail),
          },
          onClose: this.closeRemovalModal,
        };
    }
  };

  userEmailChangeCallback = (value) => {
    this.setState({ userEmail: value, userEmailError: false });
  };

  openRemovalModal = (email) => {
    this.setState({ removalModalOpenType: REMOVAL_MODAL_TYPE.MEMBER_REMOVAL, selectedUserEmail: email });
  };

  openSelfRemovalModal = () => {
    this.setState({ removalModalOpenType: REMOVAL_MODAL_TYPE.SELF_REMOVAL });
  };

  closeRemovalModal = () => {
    this.setState({ removalModalOpenType: undefined });
  };

  handleMemberRemoval = (email) => {
    const { stores } = this.props;
    const { userStore } = stores;
    const { user, userOrganizationNamespace } = userStore;
    sendAction(OTA_ENVIRONMENT_REMOVE_MEMBER);
    if (user.email === email) {
      userStore.deleteMemberFromOrganization(email, true);
      this.setUserOrganization(user.profile.defaultNamespace);
    } else {
      userStore.deleteMemberFromOrganization(email, true, userOrganizationNamespace);
    }
    this.closeRemovalModal();
  };

  render() {
    const {
      memberAddedAt,
      removalModalOpenType,
      userEmail,
      userEmailError
    } = this.state;
    const { canEdit, namespace, stores, t } = this.props;
    const { userStore } = stores;
    const { currentOrganization, user } = userStore;
    const organizationUsers = userStore.userOrganizationUsers;
    const envOwnerEmail = Object.keys(currentOrganization).length && currentOrganization.creatorEmail;
    const isHomeEnv = namespace === user.profile.initialNamespace;

    return (
      <div id="page-profile">
        <div
          className="profile-container"
          id="profile-organization"
          style={{ minHeight: 'calc(100vh - 130px)', width: '100vw' }}
        >
          <>
            <span>
              <span>
                <div className="section-header adding-user">
                  <div className="column name-header">{t('profile.organization.members')}</div>
                </div>
                {canEdit && (
                  <>
                    <div className="anim-info-container member-adding">
                      <OperationCompletedInfo
                        info={t('profile.organization.member-added')}
                        trigger={
                        { createdAt: memberAddedAt }
                      }
                      />
                    </div>
                    <div className="description">
                      {t('profile.organization.members-description')}
                    </div>
                    <div className="adding-user-content">
                      <Form className="adding-user-form" id="add-registered-user-form">
                        <SearchBar
                          additionalClassName={`white ${userEmailError ? 'error-border' : 'dark-border'}`}
                          changeAction={this.userEmailChangeCallback}
                          id="add-registered-user-search-bar"
                          placeholder={t('profile.organization.add-registered-members-placeholder')}
                          value={userEmail}
                        />
                      </Form>
                      <Button
                        className="float-left"
                        htmlType="button"
                        type="primary"
                        light="true"
                        id="button-add-registered-user"
                        onClick={this.addRegisteredUser}
                      >
                        {t('profile.organization.add-registered-members')}
                      </Button>
                    </div>
                    <Divider type="horizontal" />
                  </>
                )}
              </span>
              <span>
                <div className={canEdit ? 'email-list' : ''}>
                  {organizationUsers.map(({ email }, index) => (
                    <div className="organization-info organization-info--space-between" key={`organization-info-user-${index}`}>
                      <div className="column name" id={email}>
                        {email}
                        {canEdit && email === envOwnerEmail && (isHomeEnv
                          ? (
                            <Tooltip placement="right" title={t('profile.organization.owner-tooltip')}>
                              <OwnerTag>{t('profile.organization.owner')}</OwnerTag>
                            </Tooltip>
                          )
                          : (
                            <Tooltip placement="right" title={t('profile.organization.creator-tooltip')}>
                              <OwnerTag>{t('profile.organization.creator')}</OwnerTag>
                            </Tooltip>
                          ))}
                      </div>
                      {canEdit && ((envOwnerEmail && email !== envOwnerEmail) || !isHomeEnv) && (
                        <RemoveButton
                          id={`${email}-remove-btn`}
                          onClick={() => email === user.email
                            ? this.openSelfRemovalModal()
                            : this.openRemovalModal(email)
                          }
                        >
                          <img src={TRASHBIN_ICON} />
                          <span>{t('profile.organization.members.remove')}</span>
                        </RemoveButton>
                      )}
                    </div>
                  ))}
                </div>
              </span>
            </span>
            {removalModalOpenType && (
              <WarningModal {...this.populateRemovalModal(t)} />
            )}
          </>
        </div>
      </div>
    );
  }
}

export default withTranslation()(ProfileOrganization);
