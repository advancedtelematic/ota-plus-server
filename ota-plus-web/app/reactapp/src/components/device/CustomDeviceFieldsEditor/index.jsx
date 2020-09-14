import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useObserver } from 'mobx-react';
import { useTranslation } from 'react-i18next';
import { Input, Tooltip } from 'antd';
import { useStores } from '../../../stores/hooks';
import { CDFList,
  CDFListHeader,
  Container,
  InputWrapper,
  NoCDFWrapper, NoCDFPrimaryText, NoCDFSecondaryText } from './styled';
import {
  CUSTOM_DEVICE_FIELDS_ICON,
  HELP_ICON_LIGHT,
  PLUS_ICON,
  SAVE_ICON,
  WARNING_ICON_RED,
  isFeatureEnabled,
  UI_FEATURES,
} from '../../../config';
import { CUSTOM_DEVICE_SPECIFIC_FIELD_REGEX } from '../../../constants/regexPatterns';
import { sendAction } from '../../../helpers/analyticsHelper';
import { OTA_DEVICE_CUSTOM_VALUE_EDIT } from '../../../constants/analyticsActions';
import { ExternalLink, Button } from '../../../partials';
import { APP_ROUTE_DEVICES, URL_CUSTOM_DEVICE_FIELDS } from '../../../constants/urlConstants';

const MAX_TOOLTIP_WIDTH = 200;

function useStoreData() {
  const { stores } = useStores();
  return useObserver(() => ({
    deviceSpecificTags: stores.devicesStore.deviceSpecificTags,
    uiFeatures: stores.userStore.uiFeatures
  }));
}

const CustomDeviceFieldsEditor = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [editingField, setEditingField] = useState({ isEditing: false, name: '' });
  const [newFieldName, setNewFieldName] = useState('');
  const [error, setError] = useState(null);
  const { stores } = useStores();
  const { deviceSpecificTags, uiFeatures } = useStoreData();

  const handleRenameField = (fieldName, value) => {
    setNewFieldName(value);
    setEditingField(val => ({ isEditing: !val.isEditing, name: fieldName }));
  };

  const handleInputChange = (event) => {
    const { value } = event.target;
    if (!value.match(CUSTOM_DEVICE_SPECIFIC_FIELD_REGEX)) {
      setError(t('devices.ddv.cdf-rename-error'));
    } else if (error) {
      setError(null);
    }
    setNewFieldName(event.target.value);
  };

  const handleSave = () => {
    const { devicesStore } = stores;
    if (!error) {
      devicesStore.renameDeviceSpecificTagValue(devicesStore.device.uuid, editingField.name, newFieldName.trim());
      sendAction(OTA_DEVICE_CUSTOM_VALUE_EDIT);
      setEditingField({ isEditing: false, name: '' });
    }
  };

  return (
    <Container>
      {deviceSpecificTags.length ? (
        <>
          <CDFListHeader>
            <span>{t('devices.ddv.cdf-list.header.title')}</span>
            <span>{t('devices.ddv.cdf-list.header.value')}</span>
          </CDFListHeader>
          <CDFList isError={error}>
            {deviceSpecificTags.map(([tagId, tagValue]) => (
              <div key={tagId} id={`cdf-${tagId}`}>
                <span id={`cdf-title-${tagId}`}>{tagId}</span>
                {editingField.isEditing && editingField.name === tagId ? (
                  <>
                    <InputWrapper>
                      <Input
                        id="cdf-name-input"
                        defaultValue={tagValue}
                        onChange={handleInputChange}
                      />
                      <img
                        id="save-name-btn"
                        src={SAVE_ICON}
                        onClick={handleSave}
                      />
                    </InputWrapper>
                    <Tooltip
                      overlayStyle={{ maxWidth: MAX_TOOLTIP_WIDTH }}
                      title={error || t('devices.ddv.cdf-rename-error')}
                    >
                      <div>
                        <img id="cdf-util-icon" src={error ? WARNING_ICON_RED : HELP_ICON_LIGHT} />
                      </div>
                    </Tooltip>
                  </>
                ) : (
                  <>
                    <span id={`cdf-value-${tagId}`}>{tagValue}</span>
                    {isFeatureEnabled(uiFeatures, UI_FEATURES.EDIT_CUSTOM_FIELD_VALUE) && (
                      <div
                        id="edit-name-btn"
                        className="cdf-edit-name"
                        onClick={() => handleRenameField(tagId, tagValue)}
                      />
                    )}
                  </>
                )}
              </div>
            ))}
          </CDFList>
        </>
      ) : (
        <NoCDFWrapper>
          <img src={CUSTOM_DEVICE_FIELDS_ICON} />
          <NoCDFPrimaryText>{t('devices.ddv.cdf-list.empty.text-1')}</NoCDFPrimaryText>
          <NoCDFSecondaryText>
            <span>{t('devices.ddv.cdf-list.empty.text-2')}</span>
            {' '}
            <ExternalLink
              id="cdf-read-more"
              weight="medium"
              url={URL_CUSTOM_DEVICE_FIELDS}
            >
              {t('devices.ddv.cdf-list.empty.read-more')}
            </ExternalLink>
          </NoCDFSecondaryText>
          <Button type="link" id="upload-file-btn" onClick={() => history.push(APP_ROUTE_DEVICES)}>
            <img src={PLUS_ICON} />
            {t('devices.ddv.cdf-list.empty.upload')}
          </Button>
        </NoCDFWrapper>
      )}
    </Container>
  );
};

export default CustomDeviceFieldsEditor;
