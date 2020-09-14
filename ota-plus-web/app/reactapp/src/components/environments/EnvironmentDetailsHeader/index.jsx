import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useObserver } from 'mobx-react';
import { useStores } from '../../../stores/hooks';
import { Button, CopyableValue, PageHeader, Title } from '../../../partials';
import { ButtonsWrapper, MainContent, Prefix, TextsWrapper } from './styled';
import { RECENTLY_CREATED_DATE_FORMAT } from '../../../constants/datesTimesConstants';
import { getFormattedDateTime } from '../../../helpers/datesTimesHelper';
import { isFeatureEnabled, UI_FEATURES } from '../../../config';

function useStoreData() {
  const { stores } = useStores();
  return useObserver(() => ({
    uiFeatures: stores.userStore.uiFeatures,
  }));
}

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
  const { uiFeatures } = useStoreData();

  return (
    <PageHeader
      mainContent={(
        <MainContent>
          {namespace && (
            <>
              <Title size="large">{name}</Title>
              <TextsWrapper>
                <div>
                  <Prefix>{t('profile.organization.details.id')}</Prefix>
                  <CopyableValue value={namespace} />
                </div>
                <div>
                  <Prefix>{t('profile.organization.details.created')}</Prefix>
                  <div>{getFormattedDateTime(createdAt, RECENTLY_CREATED_DATE_FORMAT)}</div>
                </div>
                <div>
                  <Prefix>{t('profile.organization.details.by')}</Prefix>
                  <div>{creatorEmail}</div>
                </div>
              </TextsWrapper>
            </>
          )}
        </MainContent>
      )}
      sideContent={(
        <ButtonsWrapper>
          {isFeatureEnabled(uiFeatures, UI_FEATURES.RENAME_ENV) && (
            <Button
              htmlType="button"
              light="true"
              id="btn-rename-env"
              size="large"
              onClick={onRenameBtnClick}
            >
              {t('profile.organization.details.rename')}
            </Button>
          )}
          {isFeatureEnabled(uiFeatures, UI_FEATURES.ADD_MEMBER) && (
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
          )}
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
