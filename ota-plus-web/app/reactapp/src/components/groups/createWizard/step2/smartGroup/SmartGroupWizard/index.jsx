import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Input } from 'antd';
import {
  FieldLabel,
  NameFieldWrapper,
} from './styled';
import { GROUP_DATA_TYPE_NAME } from '../../../../../../constants/groupConstants';
import SmartFilters from '../../SmartFilters';
import { ExternalLink } from '../../../../../../partials';
import { URL_CONFIGURING_DEVICE, URL_CUSTOM_DEVICE_FIELDS } from '../../../../../../constants/urlConstants';
import { sendAction } from '../../../../../../helpers/analyticsHelper';
import {
  OTA_DEVICES_CONFIGURE_READ_MORE,
  OTA_DEVICES_SMART_CUSTOM_READ_MORE
} from '../../../../../../constants/analyticsActions';

const SmartGroupWizard = ({ onStep2DataSelect }) => {
  const { t } = useTranslation();

  return (
    <div id="smart-create-step2">
      <p>
        {t('groups.creating.smart-group.description-1')}
        <ExternalLink
          id="cdf-link"
          url={URL_CUSTOM_DEVICE_FIELDS}
          onClick={() => sendAction(OTA_DEVICES_SMART_CUSTOM_READ_MORE)}
        >
          {t('groups.creating.smart-group.description-url-1')}
        </ExternalLink>
        {t('groups.creating.smart-group.description-dot')}
        {' '}
        {t('groups.creating.smart-group.description-2')}
        <ExternalLink
          id="dev-docs-link"
          url={URL_CONFIGURING_DEVICE}
          onClick={() => sendAction(OTA_DEVICES_CONFIGURE_READ_MORE)}
        >
          {t('groups.creating.smart-group.description-url-2')}
        </ExternalLink>
        {t('groups.creating.smart-group.description-dot')}
      </p>
      <NameFieldWrapper>
        <FieldLabel>{t('groups.creating.smart-group.labels.name')}</FieldLabel>
        <Input
          id="device-group-name"
          placeholder={t('groups.creating.smart-group.placeholders.name')}
          name="groupName"
          onChange={(event) => {
            onStep2DataSelect(GROUP_DATA_TYPE_NAME, event.target.value);
          }}
        />
      </NameFieldWrapper>
      <SmartFilters onStep2DataSelect={onStep2DataSelect} />
    </div>
  );
};

SmartGroupWizard.propTypes = {
  onStep2DataSelect: PropTypes.func,
};

export default SmartGroupWizard;
