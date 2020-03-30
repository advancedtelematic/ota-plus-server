import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Button, PageHeader, Title } from '../../../partials';
import { ButtonsWrapper, MainContent, Prefix, TextsWrapper } from './styled';
import { RECENTLY_CREATED_DATE_FORMAT } from '../../../constants/datesTimesConstants';
import { getFormattedDateTime } from '../../../helpers/datesTimesHelper';

const EnvironmentDetailsHeader = ({
  envInfo: {
    createdAt,
    creatorEmail,
    name,
    namespace,
  },
  onAddMemberBtnClick,
  onRenameBtnClick
}) => {
  const { t } = useTranslation();

  return (
    <PageHeader
      mainContent={(
        <MainContent>
          {namespace && (
            <>
              <Title>{name}</Title>
              <TextsWrapper>
                <Prefix>{t('profile.organization.details.by')}</Prefix>
                <div>{namespace}</div>
                <Prefix>{t('profile.organization.details.created')}</Prefix>
                <div>{getFormattedDateTime(createdAt, RECENTLY_CREATED_DATE_FORMAT)}</div>
                <Prefix>{t('profile.organization.details.id')}</Prefix>
                <div>{creatorEmail}</div>
              </TextsWrapper>
            </>
          )}
        </MainContent>
      )}
      sideContent={(
        <ButtonsWrapper>
          <Button
            htmlType="button"
            light="true"
            id="btn-rename-env"
            size="large"
            onClick={onRenameBtnClick}
          >
            {t('profile.organization.details.rename')}
          </Button>
          <Button
            htmlType="button"
            type="primary"
            light="true"
            id="btn-add-member"
            size="large"
            onClick={onAddMemberBtnClick}
          >
            {t('profile.organization.details.add-member')}
          </Button>
        </ButtonsWrapper>
      )}
    />
  );
};

EnvironmentDetailsHeader.propTypes = {
  envInfo: PropTypes.shape({}),
  onAddMemberBtnClick: PropTypes.func,
  onRenameBtnClick: PropTypes.func
};

export default EnvironmentDetailsHeader;
