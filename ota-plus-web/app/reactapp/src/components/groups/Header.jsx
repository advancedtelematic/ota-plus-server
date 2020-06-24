/** @format */

import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';
import Button from '../../partials/Button';
import { ICON_GROUPS_DEVICES_CUSTOM_FIELDS_SETTINGS } from '../../constants/iconsConstants';

const Header = ({ showCreateGroupModal, uploadDeviceCustomFields, t }) => (
  <div id="groups-panel-headers">
    <>
      <div className="groups-panel__header">
        <div className="groups-panel__title">{t('devices.custom-fields.title')}</div>
        <img
          src={ICON_GROUPS_DEVICES_CUSTOM_FIELDS_SETTINGS}
        />
        <Button
          id="groups-panel-custom-fields-upload-button"
          onClick={uploadDeviceCustomFields}
          minwidth={'100px'}
        >
          <span>{t('devices.custom-fields.upload-button')}</span>
        </Button>
      </div>
      <div className="groups-panel__divider" />
    </>
    <div className="groups-panel__header">
      <div className="groups-panel__title">Groups</div>
      <Button
        id="add-new-group"
        onClick={showCreateGroupModal}
      >
        <span>{t('groups.add_group')}</span>
      </Button>
    </div>
  </div>
);

Header.propTypes = {
  showCreateGroupModal: PropTypes.func.isRequired,
  uploadDeviceCustomFields: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

export default withTranslation()(Header);
