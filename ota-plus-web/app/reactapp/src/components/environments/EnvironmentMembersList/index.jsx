import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useObserver } from 'mobx-react';
import { Tooltip } from 'antd';
import { Form } from 'formsy-antd';
import { useStores } from '../../../stores/hooks';
import { Dropdown, SearchBar } from '../../../partials';
import {
  AccessManagerTag,
  FullRestrictionTag,
  ListHeader,
  ListItem,
  ListStyled,
  OwnerTag,
  LowImportanceText
} from './styled';
import { RECENTLY_CREATED_DATE_FORMAT } from '../../../constants/datesTimesConstants';
import { getFormattedDateTime } from '../../../helpers/datesTimesHelper';
import { DOOR_EXIT_ICON, TRASHBIN_ICON, DROPDOWN_TOGGLE_ICON, isFeatureEnabled, UI_FEATURES } from '../../../config';

const MANAGE_FEATURES_ACCESS_ID = 'manage_feature_access';

function useStoreData() {
  const { stores } = useStores();
  return useObserver(() => ({
    uiFeatures: stores.userStore.uiFeatures
  }));
}

const EnvironmentMembersList = ({
  currentEnvUIFeatures,
  envInfo,
  environmentMembers,
  onListItemClick,
  onRemoveBtnClick,
  selectedUserEmail,
  user
}) => {
  const { t } = useTranslation();
  const { uiFeatures } = useStoreData();
  const [selectedItemEmail, setSelectedItemEmail] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const { creatorEmail, isInitial } = envInfo;
  const canRemoveMembers = isFeatureEnabled(uiFeatures, UI_FEATURES.REMOVE_MEMBER);

  const toggleMenu = (email) => {
    setSelectedItemEmail(prevValue => prevValue ? '' : email);
  };

  const renderAccessTag = (userEmail) => {
    if (userEmail !== creatorEmail && currentEnvUIFeatures && currentEnvUIFeatures[userEmail]) {
      const selectedUserFeatures = Object
        .keys(currentEnvUIFeatures[userEmail])
        .map(key => currentEnvUIFeatures[userEmail][key]);
      if (selectedUserFeatures.find(el => el.id === MANAGE_FEATURES_ACCESS_ID).isAllowed) {
        return (
          <AccessManagerTag id="access-manager-tag">
            {t('profile.organization.members.access-manager')}
          </AccessManagerTag>
        );
      }
      if (selectedUserFeatures.every(el => el.isAllowed === false)) {
        return (
          <FullRestrictionTag id="full-restriction-tag">
            {t('profile.organization.members.full-restriction')}
          </FullRestrictionTag>
        );
      }
    }
    return null;
  };

  return (
    <ListStyled
      id="members-list"
      dataSource={environmentMembers.filter(el => el.email.match(searchValue))}
      header={(
        <ListHeader>
          <h2>{t('profile.organization.members')}</h2>
          <Form>
            <SearchBar
              placeholder={t('profile.organization.members.search-ph')}
              value={searchValue}
              changeAction={setSearchValue}
              id="members-search-bar"
            />
          </Form>
        </ListHeader>
      )}
      renderItem={({ email, addedAt }) => (
        <ListItem
          id={email}
          key={email}
          active={email === selectedUserEmail ? 1 : 0}
          onClick={() => onListItemClick({ email, addedAt })}
        >
          <div>
            {email}
            {renderAccessTag(email)}
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
          </div>
          <div>
            <LowImportanceText>{t('profile.organization.details.list.added')}</LowImportanceText>
            {' '}
            <span>{getFormattedDateTime(addedAt, RECENTLY_CREATED_DATE_FORMAT)}</span>
          </div>
          {selectedItemEmail === email && (
            <Dropdown hideSubmenu={() => toggleMenu(email)}>
              {email === user.email
                ? (
                  <li
                    id={`${email}-remove-btn`}
                    onClick={() => onRemoveBtnClick(email === user.email ? false : email)}
                  >
                    <img src={DOOR_EXIT_ICON} />
                    <span>{t('profile.organization.members.leave')}</span>
                  </li>
                ) : canRemoveMembers ? (
                  <li
                    id={`${email}-remove-btn`}
                    onClick={() => onRemoveBtnClick(email === user.email ? false : email)}
                  >
                    <img src={TRASHBIN_ICON} />
                    <span>{t('profile.organization.members.remove')}</span>
                  </li>
                ) : null}
            </Dropdown>
          )}
          {((envInfo && email !== creatorEmail) || !isInitial) && (
            <img id={`${email}-submenu-toggle`} src={DROPDOWN_TOGGLE_ICON} onClick={() => toggleMenu(email)} />
          )}
        </ListItem>
      )}
    />
  );
};

EnvironmentMembersList.propTypes = {
  currentEnvUIFeatures: PropTypes.shape({}),
  envInfo: PropTypes.shape({}),
  environmentMembers: PropTypes.arrayOf(PropTypes.shape({})),
  onListItemClick: PropTypes.func,
  onRemoveBtnClick: PropTypes.func,
  selectedUserEmail: PropTypes.string,
  user: PropTypes.shape({}),
};

export default EnvironmentMembersList;
