import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Tooltip } from 'antd';
import { Button, PageHeader, Title } from '../../../partials';
import { ENVIRONMENTS_ICON, HELP_ICON_DARK } from '../../../config';
import { Box, Description, EnvIcon, HelpIcon, LinkPrimary, Subtitle, TextsWrapper } from './styled';
import ExternalLink from '../../../partials/ExternalLink';
import { sendAction } from '../../../helpers/analyticsHelper';
import { OTA_ENVIRONMENT_READ_MORE } from '../../../constants/analyticsActions';
import { URL_ENVIRONMENTS_READ_MORE } from '../../../constants/urlConstants';

const EnvironmentsHeader = ({ homeEnvName, onCreateEnvBtnClick, onHomeEnvClick }) => {
  const { t } = useTranslation();

  return (
    <PageHeader
      mainContent={(
        <>
          <EnvIcon src={ENVIRONMENTS_ICON} />
          <TextsWrapper>
            <Title size="large">{t('profile.organization.title')}</Title>
            <Subtitle>
              <span>
                {t('profile.organization.header.home-env-tip')}
                {homeEnvName && (
                  <>
                    <LinkPrimary id="home-env-link" onClick={onHomeEnvClick}>
                      {homeEnvName}
                    </LinkPrimary>
                    <Tooltip
                      title={t('profile.organization.header.home-env-tooltip')}
                      placement="right"
                      overlayClassName="env-tooltip"
                    >
                      <HelpIcon src={HELP_ICON_DARK} />
                    </Tooltip>
                  </>
                )}
              </span>
            </Subtitle>
            <Description id="profile-organization-header-description">
              {t('profile.organization.header.description')}
              {' '}
              <ExternalLink
                id="profile-organization-header-link"
                key="profile-organization-header-link"
                onClick={() => sendAction(OTA_ENVIRONMENT_READ_MORE)}
                url={URL_ENVIRONMENTS_READ_MORE}
                weight="regular"
              >
                {t('profile.organization.header.read-more')}
              </ExternalLink>
            </Description>
          </TextsWrapper>
        </>
      )}
      sideContent={(
        <Box>
          <Button
            htmlType="button"
            type="primary"
            light="true"
            id="button-create-env"
            size="large"
            onClick={onCreateEnvBtnClick}
          >
            {t('profile.organization.create-env')}
          </Button>
        </Box>
      )}
    />
  );
};

EnvironmentsHeader.propTypes = {
  homeEnvName: PropTypes.string,
  onCreateEnvBtnClick: PropTypes.func,
  onHomeEnvClick: PropTypes.func,
};

export default EnvironmentsHeader;
