import React, { useState } from 'react';
import { useObserver } from 'mobx-react';
import { Drawer } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { makeAcronym } from '../../utils/stringUtils';
import { SIZES } from '../../constants/styleConstants';
import { Title } from '..';
import { useStores } from '../../stores/hooks';
import {
  Avatar,
  BetaTag,
  DrawerHeader,
  LinkContent,
  LinksContainer,
  OrganizationName,
  Signout,
  SignoutIcon
} from './styled';
import { FEATURES, SIGN_OUT_ICON } from '../../config';

const renderLinks = (t, links, onClick) => (
  links.map(({ name, to, isBeta }) => (
    <Link
      id={`account-sidebar-link-${name}`}
      to={to}
      key={to}
      onClick={onClick}
    >
      <LinkContent>
        <Title size="small">
          {t(`account-settings.links.${name}`)}
        </Title>
        {isBeta && <BetaTag>{t('miscellaneous.beta')}</BetaTag>}
      </LinkContent>
    </Link>
  ))
);

function useStoreData() {
  const { stores } = useStores();
  return useObserver(() => ({
    features: stores.featuresStore.features,
    user: stores.userStore.user,
    organizationName: stores.userStore.userOrganizationName
  }));
}

const AccountSidebar = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const { t } = useTranslation();
  const { features, organizationName, user } = useStoreData();

  const links = [];

  links.push({ name: 'profile', to: '/profile/edit', isBeta: false });
  if (features.includes(FEATURES.ORGANIZATIONS)) {
    links.push({ name: 'organization', to: '/profile/organization', isBeta: true });
  }
  links.push({ name: 'usage', to: '/profile/usage', isBeta: false });
  links.push({ name: 'keys', to: '/profile/access-keys', isBeta: false });
  links.push({ name: 'terms', to: '/policy', isBeta: false });

  const onClose = () => {
    setSidebarVisible(false);
  };

  const openSidebar = () => {
    setSidebarVisible(true);
  };

  const userName = user && user.fullName;
  const acronym = userName && makeAcronym(userName);

  return (
    <div>
      <Avatar id="sidebar-avatar" onClick={openSidebar} isActive={isSidebarVisible}>
        {acronym}
      </Avatar>
      <Drawer
        width={SIZES.SIDEBAR_WIDTH}
        maskStyle={{
          backgroundColor: 'transparent',
          top: `-${SIZES.NAVBAR_HEIGHT}`,
        }}
        style={{
          top: SIZES.NAVBAR_HEIGHT,
          maxHeight: `calc(100% - ${SIZES.NAVBAR_HEIGHT})`
        }}
        bodyStyle={{
          padding: 0
        }}
        closable={false}
        onClose={onClose}
        visible={isSidebarVisible}
      >
        <DrawerHeader>
          <Title size="large" id="sidebar-username">{userName}</Title>
          {features.includes(FEATURES.ORGANIZATIONS) && (
            <div id="sidebar-header-org">
              <span>{t('account-settings.label.organization')}</span>
              <OrganizationName>{organizationName}</OrganizationName>
              <BetaTag>{t('miscellaneous.beta')}</BetaTag>
            </div>
          )}
        </DrawerHeader>
        <LinksContainer>
          {renderLinks(t, links, onClose)}
        </LinksContainer>
        <a href="/logout" rel="noopener noreferrer" id="sidebar-signout">
          <Signout>
            <SignoutIcon src={SIGN_OUT_ICON} />
            <Title size="small" id="sidebar-signout-title">{t('account-settings.links.sign-out')}</Title>
          </Signout>
        </a>
      </Drawer>
    </div>
  );
};

export default AccountSidebar;
