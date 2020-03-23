/** @format */

import React, { Component } from 'react';
import { Divider, Radio, Tooltip } from 'antd';
import { Form } from 'formsy-antd';
import Cookies from 'js-cookie';
import { observer, inject } from 'mobx-react';
import { observe } from 'mobx';
import PropTypes from 'prop-types';
import isEmail from 'validator/lib/isEmail';
import { withTranslation } from 'react-i18next';
import moment from 'moment';
import WarningModal from '../WarningModal';
import CreateEnvModal from '../CreateEnvModal';
import EditOrganizationNameModal from '../EditOrganizationNameModal';
import { Button, Dropdown, OperationCompletedInfo, SearchBar } from '../../../partials';
import { MetaData } from '../../../utils';
import { sendAction, setAnalyticsView } from '../../../helpers/analyticsHelper';
import {
  OTA_ENVIRONMENT_SWITCH,
  OTA_ENVIRONMENT_ADD_MEMBER,
  OTA_ENVIRONMENT_CREATE_ENV,
  OTA_ENVIRONMENT_REACH_MAX_ENV,
  OTA_ENVIRONMENT_REMOVE_MEMBER
} from '../../../constants/analyticsActions';
import { ANALYTICS_VIEW_ENVIRONMENTS } from '../../../constants/analyticsViews';
import { changeUserEnvironment } from '../../../helpers/environmentHelper';
import { CreateEnvButton, OwnerTag, RemoveButton } from './styled';
import {
  ORGANIZATION_NAMESPACE_COOKIE,
  TRASHBIN_ICON
} from '../../../config';
import { REMOVAL_MODAL_TYPE, WARNING_MODAL_COLOR } from '../../../constants';

@inject('stores')
@observer
class ProfileOrganization extends Component {
  static propTypes = {
    stores: PropTypes.shape({ userStore: PropTypes.shape({}).isRequired }).isRequired,
    t: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    const { stores, t } = props;
    const { userStore } = stores;
    this.state = {
      createEnvModalOpen: false,
      removalModalOpenType: undefined,
      memberAddedAt: undefined,
      menuEditShownIndex: -1,
      menuEditShowMenu: false,
      organization: undefined,
      organizationSelectedIndex: userStore.userOrganizations.findIndex(
        organization => organization.namespace === userStore.userOrganizationNamespace
      ),
      selectedUserEmail: '',
      userEmail: '',
      userEmailError: false,
    };
    this.userOrganizationNamespaceHandler = observe(userStore, (change) => {
      const { organizationSelectedIndex: stateOrganizationSelectedIndex } = this.state;
      if (change.name === 'userOrganizationNamespace' && stateOrganizationSelectedIndex === -1) {
        const organizationSelectedIndex = userStore.userOrganizations.findIndex(
          organization => organization.namespace === userStore.userOrganizationNamespace
        );
        this.setState({ organizationSelectedIndex });
      }
    });
    this.title = t('profile.organization.title');
  }

  componentDidMount() {
    const { stores } = this.props;
    const { userStore } = stores;
    userStore.getOrganizationUsers();
    userStore.getCurrentOrganization();
    setAnalyticsView(ANALYTICS_VIEW_ENVIRONMENTS);
  }

  componentWillUnmount() {
    this.userOrganizationNamespaceHandler();
  }

  addRegisteredUser = (event) => {
    event.preventDefault();
    const { userEmail } = this.state;
    if (isEmail(userEmail)) {
      const { stores } = this.props;
      const { userStore } = stores;
      userStore.addUserToOrganization(userEmail).then(() => {
        this.setState({ memberAddedAt: moment().format(), userEmail: '' });
        sendAction(OTA_ENVIRONMENT_ADD_MEMBER);
      });
    } else {
      this.setState({ userEmailError: true });
    }
  };

  organizationChangeCallback = (event) => {
    const { value } = event.target;
    const { stores } = this.props;
    const { userStore } = stores;
    const { namespace } = userStore.userOrganizations[value];
    this.setUserOrganization(namespace);
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

  setUserOrganization = (namespace) => {
    changeUserEnvironment(namespace);
    sendAction(OTA_ENVIRONMENT_SWITCH);
  };

  userEmailChangeCallback = (value) => {
    this.setState({ userEmail: value, userEmailError: false });
  };

  showHideOrganizationEditMenu = (value) => {
    const { stores } = this.props;
    const { userStore } = stores;
    this.setState({ menuEditShownIndex: value });
    const newOrganization = userStore.userOrganizations[value];
    if (newOrganization) {
      this.setState({ menuEditShownIndex: value, organization: newOrganization });
    }
  };

  showOrganizationEditModal = (event) => {
    if (event) {
      event.preventDefault();
    }
    this.setState({ menuEditShowMenu: true });
  };

  hideOrganizationEditModal = () => {
    this.setState({ menuEditShowMenu: false });
  };

  openRemovalModal = (email) => {
    this.setState({ removalModalOpenType: REMOVAL_MODAL_TYPE.MEMBER_REMOVAL, selectedUserEmail: email });
  };

  openSelfRemovalModal = () => {
    this.setState({ removalModalOpenType: REMOVAL_MODAL_TYPE.SELF_REMOVAL });
  };

  toggleCreateEnvModal = () => {
    this.setState(({ createEnvModalOpen }) => ({ createEnvModalOpen: !createEnvModalOpen }));
  };

  closeRemovalModal = () => {
    this.setState({ removalModalOpenType: undefined });
  };

  closeMaxEnvModal = () => {
    const { stores } = this.props;
    const { userStore } = stores;
    userStore.maxEnvReached = false;
    sendAction(OTA_ENVIRONMENT_REACH_MAX_ENV);
  }

  handleCreateEnvironment = (envName) => {
    const { stores } = this.props;
    const { userStore } = stores;
    sendAction(OTA_ENVIRONMENT_CREATE_ENV);
    userStore.createEnvironment(envName);
    this.toggleCreateEnvModal();
  };

  handleMemberRemoval = (email) => {
    const { stores } = this.props;
    const { userStore } = stores;
    const { user } = userStore;
    sendAction(OTA_ENVIRONMENT_REMOVE_MEMBER);
    if (user.email === email) {
      userStore.deleteMemberFromOrganization(email);
      this.setUserOrganization(user.profile.defaultNamespace);
    } else {
      userStore.deleteMemberFromOrganization(email, true);
    }
    this.closeRemovalModal();
  };

  render() {
    const {
      createEnvModalOpen,
      memberAddedAt,
      menuEditShownIndex,
      menuEditShowMenu,
      organization,
      removalModalOpenType,
      userEmail,
      userEmailError
    } = this.state;
    const { stores, t } = this.props;
    const { userStore } = stores;
    const { currentOrganization, maxEnvReached, user } = userStore;
    const namespace = userStore.userOrganizationNamespace;
    const organizations = userStore.userOrganizations;
    const organizationUsers = userStore.userOrganizationUsers;
    const envOwnerEmail = Object.keys(currentOrganization).length && currentOrganization.creatorEmail;
    const isHomeEnv = currentOrganization.isInitial;

    const userCurrentNamespace = Cookies.get(ORGANIZATION_NAMESPACE_COOKIE);
    return (
      <div className="profile-container" id="profile-organization">
        <MetaData title={this.title}>
          <CreateEnvButton
            htmlType="button"
            type="primary"
            light="true"
            id="button-create-env"
            onClick={this.toggleCreateEnvModal}
          >
            {t('profile.organization.create-env')}
          </CreateEnvButton>
          <span>
            <div className="section-header">
              <div className="column name-header">{t('profile.organization.name')}</div>
              <div className="column id-header">{t('profile.organization.id')}</div>
            </div>
            <div className="description">
              {t('profile.organization.name-description')}
            </div>
            {organizations.map((item, index) => (
              <div className="organization-info" key={`organization-info-${item.namespace}`}>
                <div className={`column name ${item.namespace === namespace ? 'selected' : ''}`} id="organization-name">
                  <Radio
                    checked={item.namespace === namespace}
                    onChange={this.organizationChangeCallback}
                    value={index}
                  />
                  {item.name}
                </div>
                <div className="column id" id="organization-id">
                  {item.namespace}
                </div>
                {item.namespace === userCurrentNamespace && (
                  <div
                    className="dots relative organization"
                    id="device-actions"
                    onClick={() => this.showHideOrganizationEditMenu(index)}
                  >
                    <span />
                    <span />
                    <span />
                    {menuEditShownIndex === index && (
                      <Dropdown hideSubmenu={() => this.showHideOrganizationEditMenu(-1)} customClassName="relative">
                        <li className="device-dropdown-item">
                          <a className="device-dropdown-item" id="edit-device" onClick={this.showOrganizationEditModal}>
                            {t('profile.organization.rename')}
                          </a>
                        </li>
                      </Dropdown>
                    )}
                  </div>
                )}
              </div>
            ))}
            <span>
              <div className="section-header adding-user" style={{ marginTop: '40px' }}>
                <div className="column name-header">{t('profile.organization.members')}</div>
              </div>
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
            </span>
            <span>
              <Divider type="horizontal" />
              <div className="email-list">
                {organizationUsers.map(({ email }, index) => (
                  <div className="organization-info organization-info--space-between" key={`organization-info-user-${index}`}>
                    <div className="column name" id="organization-name">
                      {email}
                      {email === envOwnerEmail && (isHomeEnv
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
                    {((envOwnerEmail && email !== envOwnerEmail) || !isHomeEnv) && (
                      <RemoveButton
                        id="organization-remove-btn"
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
          {menuEditShowMenu && (
            <EditOrganizationNameModal
              modalTitle={(
                <div className="title">
                  {'Rename environment'}
                </div>
              )}
              shown={menuEditShowMenu}
              hide={this.hideOrganizationEditModal}
              organization={organization}
            />
          )}
          {removalModalOpenType && (
            <WarningModal {...this.populateRemovalModal(t)} />
          )}
          {createEnvModalOpen && (
            <CreateEnvModal onClose={this.toggleCreateEnvModal} onConfirm={this.handleCreateEnvironment} />
          )}
          {maxEnvReached && (
            <WarningModal
              type={WARNING_MODAL_COLOR.INFO}
              title={t('profile.organization.max-env-modal.title')}
              desc={t('profile.organization.max-env-modal.desc')}
              cancelButtonProps={{
                title: t('profile.organization.max-env-modal.close'),
              }}
              onClose={this.closeMaxEnvModal}
            />
          )}
        </MetaData>
      </div>
    );
  }
}

export default withTranslation()(ProfileOrganization);
