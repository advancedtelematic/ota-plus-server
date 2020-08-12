import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import {
  BodyContainer,
  ContentBox,
  EcuReplacementContainer,
  Header,
  InfoBlock,
  ReplacedTag,
  Row,
  StatusBar,
  TopRow,
} from './styled';
import { COMPUTER_CHIP_ICON } from '../../../../config';
import { URL_ECU_REPLACEMENT } from '../../../../constants/urlConstants';
import { CopyableValue, ExternalLink } from '../../../../partials';
import { DEVICE_MTU_RECEIVED_AT } from '../../../../constants/datesTimesConstants';
import { getFormattedDateTime } from '../../../../helpers/datesTimesHelper';
import { sendAction } from '../../../../helpers/analyticsHelper';
import { OTA_DEVICE_HISTORY_REPLACEMENT_READ } from '../../../../constants/analyticsActions';

const EcuReplacementListItem = ({ item }) => {
  const { t } = useTranslation();

  useEffect(() => {
    sendAction(OTA_DEVICE_HISTORY_REPLACEMENT_READ);
  }, []);

  return (
    <EcuReplacementContainer>
      <Header>
        <img src={COMPUTER_CHIP_ICON} />
        <span>{t('devices.ddv.ecu-replace.title')}</span>
      </Header>
      <BodyContainer>
        <StatusBar>
          {t('devices.ddv.ecu-replace.status')}
          <ExternalLink weight="bold" url={URL_ECU_REPLACEMENT}>{t('devices.ddv.ecu-replace.read-more')}</ExternalLink>
        </StatusBar>
        <ContentBox>
          <TopRow>
            <ReplacedTag>{t('devices.ddv.ecu-replace.status-tag')}</ReplacedTag>
            <span>{getFormattedDateTime(item.eventTime, DEVICE_MTU_RECEIVED_AT)}</span>
          </TopRow>
          <Row>
            <InfoBlock>
              <div>{t('devices.ddv.ecu-replace.type.former')}</div>
              <div>{item.former.hardwareId}</div>
            </InfoBlock>
            <InfoBlock>
              <div>{t('devices.ddv.ecu-replace.type.current')}</div>
              <div>{item.current.hardwareId}</div>
            </InfoBlock>
          </Row>
          <Row>
            <CopyableValue title={t('devices.ddv.ecu-replace.id.former')} value={item.former.ecuId} />
            <CopyableValue title={t('devices.ddv.ecu-replace.id.current')} value={item.current.ecuId} />
          </Row>
        </ContentBox>
      </BodyContainer>
    </EcuReplacementContainer>
  );
};

EcuReplacementListItem.propTypes = {
  item: PropTypes.shape({}),
};

export default EcuReplacementListItem;
