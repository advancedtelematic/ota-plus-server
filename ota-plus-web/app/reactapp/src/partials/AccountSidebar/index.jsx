import React, { useState } from 'react';
import { useObserver } from 'mobx-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { makeAcronym } from '../../utils/stringUtils';
import { Title } from '..';
import { useStores } from '../../stores/hooks';
import { FEATURES, ORGANIZATION_NAMESPACE_COOKIE, SIGN_OUT_ICON } from '../../config';
import { sendAction } from '../../helpers/analyticsHelper';
import {
  OTA_NAV_SIGNOUT,
  OTA_NAV_PROFILE,
  OTA_NAV_USAGE,
  OTA_NAV_CREDENTIALS,
  OTA_NAV_TERMS
} from '../../constants/analyticsActions';
import Sidebar from '../Sidebar';
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

  links.push({ actionType: OTA_NAV_PROFILE, name: 'profile', to: '/profile/edit', isBeta: false });
  if (features.includes(FEATURES.USAGE)) {
    links.push({ actionType: OTA_NAV_USAGE, name: 'usage', to: '/profile/usage', isBeta: false });
  }
  links.push({ actionType: OTA_NAV_CREDENTIALS, name: 'keys', to: '/profile/access-keys', isBeta: false });
  links.push({ actionType: OTA_NAV_TERMS, name: 'terms', to: '/policy', isBeta: false });

  const onClose = () => {
    setSidebarVisible(false);
  };

  const openSidebar = () => {
    setSidebarVisible(true);
  };

  const onClick = (actionType) => {
    if (isSidebarVisible) {
      setSidebarVisible(false);
      sendAction(actionType);
    }
  };

  const renderLinks = linkList => (
    linkList.map(({ actionType, name, to, isBeta }) => (
      <Link
        id={`account-sidebar-link-${name}`}
        to={to}
        key={to}
        onClick={() => onClick(actionType)}
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

  const userName = user && user.fullName;
  const acronym = userName && makeAcronym(userName);

  return (
    <div>
      <Avatar id="sidebar-avatar" onClick={openSidebar} isActive={isSidebarVisible}>
        {acronym}
      </Avatar>
      <Sidebar onClose={onClose} visible={isSidebarVisible}>
        <DrawerHeader>
          <Title size="large" id="sidebar-username">{userName}</Title>
          <div id="sidebar-header-org">
            <span>{t('account-settings.label.organization')}</span>
            <OrganizationName>{organizationName}</OrganizationName>
          </div>
        </DrawerHeader>
        <LinksContainer>
          {renderLinks(links)}
        </LinksContainer>
        <a
          href="/logout"
          rel="noopener noreferrer"
          id="sidebar-signout"
          onClick={() => {
            Cookies.remove(ORGANIZATION_NAMESPACE_COOKIE);
            sendAction(OTA_NAV_SIGNOUT);
          }}
        >
          <Signout>
            <SignoutIcon src={SIGN_OUT_ICON} />
            <Title size="small" id="sidebar-signout-title">{t('account-settings.links.sign-out')}</Title>
          </Signout>
        </a>
      </Sidebar>
    </div>
  );
};

export default AccountSidebar;
