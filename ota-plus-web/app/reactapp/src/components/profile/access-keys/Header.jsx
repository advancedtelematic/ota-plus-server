/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Form } from 'formsy-antd';
import { withTranslation } from 'react-i18next';

import { Button, SubHeader, SearchBar } from '../../../partials';
import { sendAction } from '../../../helpers/analyticsHelper';
import { OTA_PROVISIONING_CREATE_SHARED_CREDENTIALS } from '../../../constants/analyticsActions';

@inject('stores')
@observer
class Header extends Component {
  render() {
    const { showCreateModal, provisioningFilter, changeFilter, stores, t } = this.props;
    const { provisioningStore } = stores;
    return (
      <SubHeader className={`${provisioningStore.preparedProvisioningKeys.length > 0 ? '' : 'flex-end'}`}>
        {provisioningStore.preparedProvisioningKeys.length > 0 && (
          <Form>
            <SearchBar
              value={provisioningFilter}
              changeAction={changeFilter}
              id="search-keys-input"
              additionalClassName="white"
            />
          </Form>
        )}
        <Button
          htmlType="button"
          id="button-add-new-key"
          onClick={(event) => {
            event.preventDefault();
            showCreateModal(event);
            sendAction(OTA_PROVISIONING_CREATE_SHARED_CREDENTIALS);
          }}
        >
          {t('profile.provisioning_keys.add_key')}
        </Button>
      </SubHeader>
    );
  }
}

Header.propTypes = {
  showCreateModal: PropTypes.func.isRequired,
  provisioningFilter: PropTypes.string,
  changeFilter: PropTypes.func,
  stores: PropTypes.shape({}),
  t: PropTypes.func.isRequired
};

export default withTranslation()(Header);
