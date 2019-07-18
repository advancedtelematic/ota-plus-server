/** @format */

import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';

const Header = ({ showCreateGroupModal, t }) => (
  <div className="groups-panel__header">
    <div className="groups-panel__title">Groups</div>
    <a
      href="#"
      className="ant-btn ant-btn--sm ant-btn-outlined"
      id="add-new-group"
      onClick={showCreateGroupModal}
    >
      <span>{t('groups.add_group')}</span>
    </a>
  </div>
);

Header.propTypes = {
  showCreateGroupModal: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

export default withTranslation()(Header);
