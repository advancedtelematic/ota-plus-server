/** @format */

import React, { Component } from 'react';
import { Button } from 'antd';
import { Form } from 'formsy-antd';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import isEmail from 'validator/lib/isEmail';
import { SearchBar } from '../../partials';

@inject('stores')
@observer
class ProfileOrganization extends Component {
  static propTypes = {
    stores: PropTypes.shape({ userStore: PropTypes.shape({}).isRequired }).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      userEmail: '',
      userEmailValid: false
    };
  }

  componentDidMount() {
    const { stores } = this.props;
    const { userStore } = stores;
    userStore.getOrganizationUsers();
  }

  addRegisteredUser = (event) => {
    event.preventDefault();
    const { userEmail } = this.state;
    if (isEmail(userEmail)) {
      const { stores } = this.props;
      const { userStore } = stores;
      userStore.addUserToOrganization(userEmail);
    }
  };

  userEmailChangeCallback = (value) => {
    this.setState({ userEmail: value, userEmailValid: isEmail(value) });
  };

  render() {
    const { userEmail, userEmailValid } = this.state;
    const { stores } = this.props;
    const { userStore } = stores;
    const namespace = userStore.userOrganizationNamespace;
    const organizations = userStore.userOrganizations;
    const organizationUsers = userStore.userOrganizationUsers;
    return (
      <div className="profile-container" id="profile-organization">
        <span>
          <div className="description">
            Allow existing users to access the elements in the selected organization.
          </div>
          <div className="section-header">
            <div className="column name-header">Organization Name</div>
            <div className="column id-header">Organization ID</div>
          </div>
          {organizations.map(item => (
            <div className="organization-info" key={`organization-info-${item.namespace}`}>
              <div className={`column name ${item.namespace === namespace ? 'selected' : ''}`} id="organization-name">
                <div
                  className={`dot ${item.namespace !== namespace ? 'disabled' : 'selected'}`}
                  id={`organization-checkbox-${item.namespace.toLowerCase()}`}
                />
                {item.name}
              </div>
              <div className="column id" id="organization-id">
                {item.namespace}
              </div>
            </div>
          ))}
          <span>
            <div className="section-header adding-user">
              <div className="column name-header">Add registered user</div>
            </div>
            <div className="description">
              People you add here must have an OTA Connect account. If you are unsure check with that person first.
            </div>
            <div className="adding-user-content">
              <Form className="adding-user-form" id="add-registered-user-form">
                <SearchBar
                  additionalClassName="white dark-border"
                  changeAction={this.userEmailChangeCallback}
                  id="add-registered-user-search-bar"
                  placeholder={'Add by email address'}
                  value={userEmail}
                />
              </Form>
              <Button
                htmlType="button"
                className="ant-btn ant-btn-add-registered-user"
                disabled={!userEmailValid}
                id="button-add-registered-user"
                onClick={this.addRegisteredUser}
              >
                {'Add registered user'}
              </Button>
            </div>
          </span>
          <span>
            <div className="section-header adding-user">
              <div className="column name-header">Added users</div>
            </div>
            <div className="description">
              People in this list can collaborate on campaigns with other members in the organization.
            </div>
            {organizationUsers.map((item, index) => (
              <div className="organization-info" key={`organization-info-user-${index}`}>
                <div className="column name" id="organization-name">
                  {item}
                </div>
              </div>
            ))}
          </span>
        </span>
      </div>
    );
  }
}

export default ProfileOrganization;
