import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { RECENTLY_CREATED_DATE_FORMAT } from '../../../constants/datesTimesConstants';
import { getFormattedDateTime } from '../../../helpers/datesTimesHelper';
import { EnvName, ListHeader, ListItem, ListStyled } from './styled';

const EnvironmentsList = ({ dataSource, onListItemClick }) => {
  const { t } = useTranslation();

  return (
    <ListStyled
      id="environments-list"
      dataSource={dataSource}
      header={(
        <ListHeader>
          <span>{t('profile.organization.list.headers.name')}</span>
          <span>{t('profile.organization.list.headers.id')}</span>
          <span>{t('profile.organization.list.headers.members')}</span>
          <span>{t('profile.organization.list.headers.created')}</span>
        </ListHeader>
      )}
      renderItem={({ name, namespace, memberCount, createdAt }) => (
        <ListItem id={namespace} key={namespace} onClick={() => onListItemClick(namespace)}>
          <EnvName>{name}</EnvName>
          <span>{namespace}</span>
          <span>{memberCount}</span>
          <span>{getFormattedDateTime(createdAt, RECENTLY_CREATED_DATE_FORMAT)}</span>
        </ListItem>
      )}
    />
  );
};

EnvironmentsList.propTypes = {
  dataSource: PropTypes.arrayOf(PropTypes.any),
  onListItemClick: PropTypes.func,
};

export default EnvironmentsList;
