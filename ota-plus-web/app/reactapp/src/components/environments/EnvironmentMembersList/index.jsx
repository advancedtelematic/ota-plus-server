import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Tooltip } from 'antd';
import { ListHeader, ListItem, ListStyled, OwnerTag, RemoveButton } from './styled';
import { RECENTLY_CREATED_DATE_FORMAT } from '../../../constants/datesTimesConstants';
import { getFormattedDateTime } from '../../../helpers/datesTimesHelper';
import { DOOR_EXIT_ICON, TRASHBIN_ICON } from '../../../config';

const EnvironmentMembersList = ({ envInfo, environmentMembers, onRemoveBtnClick, user }) => {
  const { t } = useTranslation();
  const { creatorEmail, isInitial } = envInfo;

  return (
    <ListStyled
      id="members-list"
      dataSource={environmentMembers}
      header={(
        <ListHeader>
          <span>{t('profile.organization.details.list.email')}</span>
          <span>{t('profile.organization.details.list.added')}</span>
        </ListHeader>
      )}
      renderItem={({ email, addedAt }) => (
        <ListItem id={email} key={email}>
          <span>
            {email}
            {email === creatorEmail && (isInitial
              ? (
                <Tooltip id="owner-tag" placement="right" title={t('profile.organization.owner-tooltip')}>
                  <OwnerTag>{t('profile.organization.owner')}</OwnerTag>
                </Tooltip>
              )
              : (
                <Tooltip id="creator-tag" placement="right" title={t('profile.organization.creator-tooltip')}>
                  <OwnerTag>{t('profile.organization.creator')}</OwnerTag>
                </Tooltip>
              ))}
          </span>
          <span>{getFormattedDateTime(addedAt, RECENTLY_CREATED_DATE_FORMAT)}</span>
          {((envInfo && email !== creatorEmail) || !isInitial) && (
            <RemoveButton
              id={`${email}-remove-btn`}
              onClick={() => onRemoveBtnClick(email === user.email ? false : email)}
            >
              {email === user.email
                ? (
                  <>
                    <img src={DOOR_EXIT_ICON} />
                    <span>{t('profile.organization.members.leave')}</span>
                  </>
                )
                : (
                  <>
                    <img src={TRASHBIN_ICON} />
                    <span>{t('profile.organization.members.remove')}</span>
                  </>
                )}
            </RemoveButton>
          )}
        </ListItem>
      )}
    />
  );
};

EnvironmentMembersList.propTypes = {
  envInfo: PropTypes.shape({}),
  environmentMembers: PropTypes.arrayOf(PropTypes.shape({})),
  onRemoveBtnClick: PropTypes.func,
  user: PropTypes.shape({}),
};

export default EnvironmentMembersList;
