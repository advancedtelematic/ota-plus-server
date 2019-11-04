/** @format */

import React, { Component } from 'react';
import { Button, Divider, Radio } from 'antd';
import { Form } from 'formsy-antd';
import Cookies from 'js-cookie';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import isEmail from 'validator/lib/isEmail';
import { observe } from 'mobx';
import { withTranslation } from 'react-i18next';
import moment from 'moment';
import encodeUrl from 'encodeurl';

import EditOrganizationNameModal from './EditOrganizationNameModal';
import { Dropdown, OperationCompletedInfo, SearchBar } from '../../partials';
import { API_USER_ORGANIZATIONS_SWITCH_NAMESPACE, ORGANIZATION_NAMESPACE_COOKIE } from '../../config';
import { MetaData } from '../../utils';
import { sendAction } from '../../helpers/analyticsHelper';
import { OTA_ENVIRONMENT_SWITCH, OTA_ENVIRONMENT_ADD_MEMBER } from '../../constants/analyticsActions';

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
      memberAddedAt: undefined,
      menuEditShownIndex: -1,
      menuEditShowMenu: false,
      organization: undefined,
      organizationSelectedIndex: userStore.userOrganizations.findIndex(
        organization => organization.namespace === userStore.userOrganizationNamespace
      ),
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
    if (namespace) {
      const pathOrigin = window.location.origin;
      const subUrl = API_USER_ORGANIZATIONS_SWITCH_NAMESPACE.replace('$namespace', namespace);
      const redirectUrl = encodeUrl(`${pathOrigin}${subUrl}`);
      Cookies.set(ORGANIZATION_NAMESPACE_COOKIE, namespace);
      window.location.replace(redirectUrl);
    }
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

  render() {
    const {
      memberAddedAt,
      menuEditShownIndex,
      menuEditShowMenu,
      organization,
      organizationSelectedIndex,
      userEmail,
      userEmailError
    } = this.state;
    const { stores, t } = this.props;
    const { userStore } = stores;
    const namespace = userStore.userOrganizationNamespace;
    const organizations = userStore.userOrganizations;
    const organizationUsers = userStore.userOrganizationUsers;
    const userCurrentNamespace = Cookies.get(ORGANIZATION_NAMESPACE_COOKIE);
    return (
      <div className="profile-container" id="profile-organization">
        <MetaData title={this.title}>
          <span>
            <div className="section-header">
              <div className="column name-header">{t('profile.organization.name')}</div>
              <div className="column id-header">{t('profile.organization.id')}</div>
            </div>
            <div className="description">
              {t('profile.organization.name_description')}
            </div>
            {organizations.map((item, index) => (
              <div className="organization-info" key={`organization-info-${item.namespace}`}>
                <div className={`column name ${item.namespace === namespace ? 'selected' : ''}`} id="organization-name">
                  <Radio
                    checked={index === organizationSelectedIndex}
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
              <div className="section-header adding-user">
                <div className="column name-header">{t('profile.organization.members')}</div>
              </div>
              <div className="anim-info-container member-adding">
                <OperationCompletedInfo
                  info={t('profile.organization.member_added')}
                  trigger={
                    { createdAt: memberAddedAt }
                  }
                />
              </div>
              <div className="description">
                {t('profile.organization.members_description')}
              </div>
              <div className="adding-user-content">
                <Form className="adding-user-form" id="add-registered-user-form">
                  <SearchBar
                    additionalClassName={`white ${userEmailError ? 'error-border' : 'dark-border'}`}
                    changeAction={this.userEmailChangeCallback}
                    id="add-registered-user-search-bar"
                    placeholder={t('profile.organization.add_registered_members_placeholder')}
                    value={userEmail}
                  />
                </Form>
                <Button
                  htmlType="button"
                  className="ant-btn ant-btn-primary float-left"
                  id="button-add-registered-user"
                  onClick={this.addRegisteredUser}
                >
                  {t('profile.organization.add_registered_members')}
                </Button>
              </div>
            </span>
            <span>
              <Divider type="horizontal" />
              <div className="email-list">
                {organizationUsers.map((item, index) => (
                  <div className="organization-info" key={`organization-info-user-${index}`}>
                    <div className="column name" id="organization-name">
                      {item}
                    </div>
                  </div>
                ))}
              </div>
            </span>
          </span>
          {menuEditShowMenu && (
            <EditOrganizationNameModal
              modalTitle={(
                <div className="title">
                  {'Rename organization'}
                </div>
              )}
              shown={menuEditShowMenu}
              hide={this.hideOrganizationEditModal}
              organization={organization}
            />
          )}
        </MetaData>
      </div>
    );
  }
}

export default withTranslation()(ProfileOrganization);
