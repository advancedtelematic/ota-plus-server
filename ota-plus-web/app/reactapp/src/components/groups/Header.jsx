/** @format */

import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';
import Button from '../../partials/Button';

const Header = ({ showCreateGroupModal, t }) => (
  <div className="groups-panel__header">
    <div className="groups-panel__title">Groups</div>
    <Button
      id="add-new-group"
      onClick={showCreateGroupModal}
    >
      <span>{t('groups.add_group')}</span>
    </Button>
  </div>
);

Header.propTypes = {
  showCreateGroupModal: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

export default withTranslation()(Header);
