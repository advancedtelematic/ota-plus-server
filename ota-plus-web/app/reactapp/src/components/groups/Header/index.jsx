/** @format */

import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useObserver } from 'mobx-react';
import { Input, Tooltip } from 'antd';
import { useStores } from '../../../stores/hooks';
import { Button, OTAModal, WarningModal } from '../../../partials';
import { ICON_GROUPS_DEVICES_CUSTOM_FIELDS_SETTINGS } from '../../../constants/iconsConstants';
import {
  CLOSE_MODAL_ICON,
  DEVICES_LIMIT_PER_PAGE,
  HELP_ICON_LIGHT,
  SAVE_ICON,
  WARNING_ICON_RED,
  UI_FEATURES,
  isFeatureEnabled
} from '../../../config';
import {
  ButtonsContainer,
  CDFFooter,
  CDFList,
  CDFListHeader,
  InputWrapper,
  ModalTitleWrapper,
  ModalTitle
} from './styled';
import { CUSTOM_DEVICE_FIELD_REGEX } from '../../../constants/regexPatterns';
import { sendAction } from '../../../helpers/analyticsHelper';
import { OTA_DEVICES_CUSTOM_RENAME, OTA_DEVICES_CUSTOM_DELETE } from '../../../constants/analyticsActions';
import { WARNING_MODAL_COLOR } from '../../../constants';
import { URL_CUSTOM_DEVICE_FIELDS_REMOVE } from '../../../constants/urlConstants';

function useStoreData() {
  const { stores } = useStores();
  return useObserver(() => ({
    customDeviceFields: stores.devicesStore.customDeviceFields,
    uiFeatures: stores.userStore.uiFeatures
  }));
}

const Header = ({ showCreateGroupModal, uploadDeviceCustomFields }) => {
  const { t } = useTranslation();
  const [editingField, setEditingField] = useState({ isEditing: false, name: '' });
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [newFieldName, setNewFieldName] = useState('');
  const [error, setError] = useState(null);
  const [displayDeleteMessage, setDisplayDeleteMessage] = useState(false);
  const [currentDeleteFieldName, setCurrentDeleteFieldName] = useState(false);
  const { stores } = useStores();
  const { customDeviceFields, uiFeatures } = useStoreData();

  const toggleRenameModalOpen = () => {
    setRenameModalOpen(val => !val);
  };

  const handleDeleteField = (fieldName) => {
    setDisplayDeleteMessage(true);
    setCurrentDeleteFieldName(fieldName);
  };

  const handleRenameField = (fieldName) => {
    setNewFieldName(fieldName);
    setEditingField(val => ({ isEditing: !val.isEditing, name: fieldName }));
  };

  const handleInputChange = (event) => {
    const { value } = event.target;
    if (value.toLowerCase() !== editingField.name.toLowerCase()
      && customDeviceFields.find(cdf => cdf.tagId.toLowerCase() === value.toLowerCase())) {
      setError(t('devices.custom-fields.rename-modal.errors.name-exists'));
    } else if (!value.match(CUSTOM_DEVICE_FIELD_REGEX)) {
      setError(t('devices.custom-fields.rename-modal.errors.invalid-format'));
    } else if (error) {
      setError(null);
    }
    setNewFieldName(event.target.value);
  };

  const updateSmartGroupData = () => {
    const group = stores.groupsStore.selectedGroup;
    if (group.isSmart) {
      const groupId = group.id || null;
      const ungrouped = group.ungrouped || null;
      stores.devicesStore.resetPageNumber();
      stores.devicesStore.fetchDevices(
        stores.devicesStore.devicesFilter, groupId, ungrouped, DEVICES_LIMIT_PER_PAGE, 0
      );
      stores.groupsStore.fetchExpressionForSelectedGroup(stores.groupsStore.selectedGroup.id);
    }
  };

  const deleteCustomField = () => {
    stores.devicesStore.deleteCustomDeviceField(currentDeleteFieldName, updateSmartGroupData);
    sendAction(OTA_DEVICES_CUSTOM_DELETE);
    setDisplayDeleteMessage(false);
  };

  const handleSave = () => {
    if (!error) {
      stores.devicesStore.renameCustomDeviceField(editingField.name, newFieldName.trim(), updateSmartGroupData);
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
          {isFeatureEnabled(uiFeatures, UI_FEATURES.UPLOAD_FILE_CUSTOM_FIELDS) && (
            <Button
              id="groups-panel-custom-fields-upload-button"
              onClick={uploadDeviceCustomFields}
              minwidth="100px"
            >
              <span>{t('devices.custom-fields.upload-button')}</span>
            </Button>
          )}
        </div>
        <div className="groups-panel__divider" />
      </>
      <div className="groups-panel__header">
        <div className="groups-panel__title">Groups</div>
        {isFeatureEnabled(uiFeatures, UI_FEATURES.CREATE_DEVICE_GROUP) && (
          <Button
            id="add-new-group"
            onClick={showCreateGroupModal}
          >
            <span>{t('groups.add_group')}</span>
          </Button>
        )}
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
                  <div key={field.tagId} id={`cdf-${field.tagId}`}>
                    {editingField.isEditing && editingField.name === field.tagId ? (
                      <>
                        <InputWrapper>
                          <Input
                            id="cdf-name-input"
                            defaultValue={field.tagId}
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
                        <span id={`cdf-title-${field.tagId}`}>{field.tagId}</span>
                        <ButtonsContainer>
                          {isFeatureEnabled(uiFeatures, UI_FEATURES.RENAME_CUSTOM_FIELD) && (
                            <div
                              id="edit-name-btn"
                              className="cdf-edit-name"
                              onClick={() => handleRenameField(field.tagId)}
                            />
                          )}
                          {isFeatureEnabled(uiFeatures, UI_FEATURES.DELETE_CUSTOM_FIELD) && (
                            <>
                              {field.isDelible
                                ? (
                                  <div
                                    id={`delete-name-btn-${field.tagId}`}
                                    className="cdf-delete-name"
                                    onClick={() => handleDeleteField(field.tagId)}
                                  />
                                ) : (
                                  <Tooltip title={t('devices.custom-fields.delete-modal.cannot')} placement="top">
                                    <div
                                      id={`delete-name-btn-disabled-${field.tagId}`}
                                      className="cdf-delete-name-disabled"
                                    />
                                  </Tooltip>
                                )}
                            </>
                          )}
                        </ButtonsContainer>
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
      {displayDeleteMessage && (
        <WarningModal
          id="cdf-delete-warning-modal"
          type={WARNING_MODAL_COLOR.DANGER}
          title={t('devices.custom-fields.delete-modal.title')}
          desc={t('devices.custom-fields.delete-modal.description')}
          readMore={{ title: t('devices.custom-fields.delete-modal.read-more'), url: URL_CUSTOM_DEVICE_FIELDS_REMOVE }}
          cancelButtonProps={{
            title: t('devices.custom-fields.delete-modal.cancel'),
          }}
          confirmButtonProps={{
            title: t('devices.custom-fields.delete-modal.confirm'),
            onClick: deleteCustomField
          }}
          onClose={() => {
            setDisplayDeleteMessage(false);
          }}
        />
      )}
    </div>
  );
};


Header.propTypes = {
  showCreateGroupModal: PropTypes.func.isRequired,
  uploadDeviceCustomFields: PropTypes.func.isRequired,
};

export default Header;
