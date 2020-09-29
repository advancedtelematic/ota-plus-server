import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import {
  BodyContainer,
  ContentBox,
  EcuReplacementContainer,
  HalfBlock,
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

const EcuReplacementListItem = ({ item, success }) => {
  const { t } = useTranslation();

  useEffect(() => {
    sendAction(OTA_DEVICE_HISTORY_REPLACEMENT_READ);
  }, []);

  return (
    <EcuReplacementContainer success={success} id={`ecu-replacement-container${!success ? '-failure' : ''}`}>
      <Header>
        <img src={COMPUTER_CHIP_ICON} />
        <span>{t('devices.ddv.ecu-replace.title')}</span>
      </Header>
      <BodyContainer>
        <StatusBar>
          {t(success ? 'devices.ddv.ecu-replace.status' : 'devices.ddv.ecu-replace.status-failure')}
          <ExternalLink
            id="ecu-replacement-read-more"
            weight="bold"
            url={URL_ECU_REPLACEMENT}
          >
            {t('devices.ddv.ecu-replace.read-more')}

          </ExternalLink>
        </StatusBar>
        <ContentBox>
          <TopRow>
            <ReplacedTag>{t('devices.ddv.ecu-replace.status-tag')}</ReplacedTag>
            <span id={`ecu-replacement-timestamp${!success ? '-failure' : ''}`}>
              {getFormattedDateTime(item.eventTime, DEVICE_MTU_RECEIVED_AT)}
            </span>
          </TopRow>
          {success && (
            <>
              <Row>
                <InfoBlock>
                  <div>{t('devices.ddv.ecu-replace.type.former')}</div>
                  <div id="ecu-replacement-former-hwid">{item.former.hardwareId}</div>
                </InfoBlock>
                <InfoBlock>
                  <div>{t('devices.ddv.ecu-replace.type.current')}</div>
                  <div id="ecu-replacement-current-hwid">{item.current.hardwareId}</div>
                </InfoBlock>
              </Row>
              <Row>
                <HalfBlock id="ecu-replacement-former-ecuid">
                  <CopyableValue
                    title={t('devices.ddv.ecu-replace.id.former')}
                    value={item.former.ecuId}
                  />
                </HalfBlock>
                <HalfBlock id="ecu-replacement-current-ecuid">
                  <CopyableValue
                    title={t('devices.ddv.ecu-replace.id.current')}
                    value={item.current.ecuId}
                  />
                </HalfBlock>
              </Row>
            </>
          )}
        </ContentBox>
      </BodyContainer>
    </EcuReplacementContainer>
  );
};

EcuReplacementListItem.propTypes = {
  item: PropTypes.shape({}),
  success: PropTypes.bool.isRequired
};

export default EcuReplacementListItem;
