/** @format */

import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useObserver } from 'mobx-react';
import { Input, Tooltip } from 'antd';
import { useStores } from '../../../stores/hooks';
import { Button, OTAModal } from '../../../partials';
import { ICON_GROUPS_DEVICES_CUSTOM_FIELDS_SETTINGS } from '../../../constants/iconsConstants';
import { CLOSE_MODAL_ICON, HELP_ICON_LIGHT, SAVE_ICON, WARNING_ICON_RED } from '../../../config';
import { CDFFooter, CDFList, CDFListHeader, InputWrapper, ModalTitleWrapper, ModalTitle } from './styled';
import { CUSTOM_DEVICE_FIELD_REGEX } from '../../../constants/regexPatterns';
import { sendAction } from '../../../helpers/analyticsHelper';
import { OTA_DEVICES_CUSTOM_RENAME } from '../../../constants/analyticsActions';

function useStoreData() {
  const { stores } = useStores();
  return useObserver(() => ({
    customDeviceFields: stores.devicesStore.customDeviceFields,
  }));
}

const Header = ({ showCreateGroupModal, uploadDeviceCustomFields }) => {
  const { t } = useTranslation();
  const [editingField, setEditingField] = useState({ isEditing: false, name: '' });
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [newFieldName, setNewFieldName] = useState('');
  const [error, setError] = useState(null);
  const { stores } = useStores();
  const { customDeviceFields } = useStoreData();

  const toggleRenameModalOpen = () => {
    setRenameModalOpen(val => !val);
  };

  const handleRenameField = (fieldName) => {
    setNewFieldName(fieldName);
    setEditingField(val => ({ isEditing: !val.isEditing, name: fieldName }));
  };

  const handleInputChange = (event) => {
    const { value } = event.target;
    if (value.toLowerCase() !== editingField.name.toLowerCase()
      && customDeviceFields.find(cdf => cdf.toLowerCase() === value.toLowerCase())) {
      setError(t('devices.custom-fields.rename-modal.errors.name-exists'));
    } else if (!value.match(CUSTOM_DEVICE_FIELD_REGEX)) {
      setError(t('devices.custom-fields.rename-modal.errors.invalid-format'));
    } else if (error) {
      setError(null);
    }
    setNewFieldName(event.target.value);
  };

  const handleSave = () => {
    if (!error) {
      stores.devicesStore.renameCustomDeviceField(editingField.name, newFieldName.trim());
      sendAction(OTA_DEVICES_CUSTOM_RENAME);
      setEditingField({ isEditing: false, name: '' });
    }
  };

  return (
    <div id="groups-panel-headers">
      <>
        <div className="groups-panel__header">
          <div className="groups-panel__title">
            <div>{t('devices.custom-fields.title')}</div>
            {customDeviceFields.length ? (
              <img
                id="groups-cogwheel"
                className="groups-panel__cogwheel"
                onClick={toggleRenameModalOpen}
                src={ICON_GROUPS_DEVICES_CUSTOM_FIELDS_SETTINGS}
              />
            ) : (
              <Tooltip title={t('devices.custom-fields.cogwheel-tooltip')}>
                <img
                  id="groups-cogwheel-disabled"
                  className="groups-panel__cogwheel groups-panel__cogwheel--disabled"
                  src={ICON_GROUPS_DEVICES_CUSTOM_FIELDS_SETTINGS}
                />
              </Tooltip>
            )}
          </div>
          <Button
            id="groups-panel-custom-fields-upload-button"
            onClick={uploadDeviceCustomFields}
            minwidth="100px"
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
      <OTAModal
        width="818px"
        title={(
          <ModalTitleWrapper>
            <ModalTitle>{t('devices.custom-fields.rename-modal.title')}</ModalTitle>
            <div className="modal-close" onClick={toggleRenameModalOpen}>
              <img src={CLOSE_MODAL_ICON} alt="Icon" />
            </div>
          </ModalTitleWrapper>
        )}
        content={(
          <>
            <div>
              <CDFListHeader>
                <span>{t('devices.custom-fields.rename-modal.list.header.title')}</span>
              </CDFListHeader>
              <CDFList isError={error}>
                {customDeviceFields.map(field => (
                  <div key={field} id={`cdf-${field}`}>
                    {editingField.isEditing && editingField.name === field ? (
                      <>
                        <InputWrapper>
                          <Input
                            id="cdf-name-input"
                            defaultValue={field}
                            onChange={handleInputChange}
                          />
                          <img
                            id="save-name-btn"
                            src={SAVE_ICON}
                            onClick={handleSave}
                          />
                        </InputWrapper>
                        <Tooltip title={error || t('devices.custom-fields.rename-modal.errors.invalid-format')}>
                          <div>
                            <img id="cdf-util-icon" src={error ? WARNING_ICON_RED : HELP_ICON_LIGHT} />
                          </div>
                        </Tooltip>
                      </>
                    ) : (
                      <>
                        <span id={`cdf-title-${field}`}>{field}</span>
                        <div id="edit-name-btn" className="cdf-edit-name" onClick={() => handleRenameField(field)} />
                      </>
                    )}
                  </div>
                ))}
              </CDFList>
            </div>
            <CDFFooter>
              <Button onClick={toggleRenameModalOpen} size="large" id="close-btn">
                {t('devices.custom-fields.rename-modal.close')}
              </Button>
            </CDFFooter>
          </>
        )}
        visible={renameModalOpen}
        className="cdf-rename-modal"
        hideOnClickOutside
        onRequestClose={toggleRenameModalOpen}
      />
    </div>
  );
};


Header.propTypes = {
  showCreateGroupModal: PropTypes.func.isRequired,
  uploadDeviceCustomFields: PropTypes.func.isRequired,
};

export default Header;
