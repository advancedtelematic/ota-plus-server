import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Tooltip } from 'antd';
import { Button, PageHeader, Title } from '../../../partials';
import { ENVIRONMENTS_ICON, HELP_ICON_DARK } from '../../../config';
import { EnvIcon, HelpIcon, LinkPrimary, Subtitle, TextsWrapper } from './styled';

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
          </TextsWrapper>
        </>
      )}
      sideContent={(
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
