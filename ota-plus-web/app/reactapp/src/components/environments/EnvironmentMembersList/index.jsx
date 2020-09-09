import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Tooltip } from 'antd';
import { Form } from 'formsy-antd';
import { Dropdown, SearchBar } from '../../../partials';
import { ListHeader, ListItem, ListStyled, OwnerTag, LowImportanceText } from './styled';
import { RECENTLY_CREATED_DATE_FORMAT } from '../../../constants/datesTimesConstants';
import { getFormattedDateTime } from '../../../helpers/datesTimesHelper';
import { DOOR_EXIT_ICON, TRASHBIN_ICON, DROPDOWN_TOGGLE_ICON } from '../../../config';

const EnvironmentMembersList = ({ envInfo, environmentMembers, onRemoveBtnClick, user }) => {
  const { t } = useTranslation();
  const [selectedItemEmail, setSelectedItemEmail] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const { creatorEmail, isInitial } = envInfo;

  const toggleMenu = (email) => {
    setSelectedItemEmail(prevValue => prevValue ? '' : email);
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
        <ListItem id={email} key={email}>
          <div>
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
          </div>
          <div>
            <LowImportanceText>{t('profile.organization.details.list.added')}</LowImportanceText>
            {' '}
            <span>{getFormattedDateTime(addedAt, RECENTLY_CREATED_DATE_FORMAT)}</span>
          </div>
          {selectedItemEmail === email && (
            <Dropdown hideSubmenu={() => toggleMenu(email)}>
              <li
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
              </li>
            </Dropdown>
          )}
          {((envInfo && email !== creatorEmail) || !isInitial) && (
            <img src={DROPDOWN_TOGGLE_ICON} onClick={() => toggleMenu(email)} />
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
