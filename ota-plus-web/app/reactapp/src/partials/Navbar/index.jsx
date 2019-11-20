/** @format */

import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useObserver } from 'mobx-react';
import { useTranslation } from 'react-i18next';
import { useStores } from '../../stores/hooks';
import { COLORS } from '../../constants/styleConstants';
import { FEATURES } from '../../config';
import AccountSidebar from '../AccountSidebar';
import {
  AppName,
  BetaTag,
  Li,
  Link,
  Logo,
  LogoContainer,
  NavContainer,
  SettingsContainer,
  Support,
  Ul
} from './styled';

const renderLinks = (t, links) => (
  links.map(({ isBeta, name, to }) => (
    <Li key={to}>
      <Link
        id={`navbar-link-${to.substring(1)}`}
        // exact should be set to 'true' for main link, otherwise it is always active
        exact={to === '/'}
        to={to}
        activeStyle={{
          boxShadow: `inset 0 -4px 0 0 ${COLORS.LIGHT_GREEN}`,
          backgroundColor: `${COLORS.SECONDARY_TRANSLUCENT}`,
          color: `${COLORS.WHITE}`
        }}
      >
        {name}
        {isBeta && <BetaTag>{t('miscellaneous.beta')}</BetaTag>}
      </Link>
    </Li>
  ))
);

function useFeatures() {
  const { stores } = useStores();
  return useObserver(() => ({
    features: stores.featuresStore.features
  }));
}

const Navbar = ({ uiUserProfileMenu }) => {
  const [links, setLinks] = useState([]);
  const { t } = useTranslation();
  const { features } = useFeatures();

  useEffect(() => {
    const publicLinks = [];

    if (features.includes(FEATURES.NEW_HOMEPAGE)) {
      publicLinks.push({ name: t('navigation.home'), to: '/home', isBeta: true });
    }
    publicLinks.push({ name: t('navigation.dashboard'), to: '/', isBeta: false });
    publicLinks.push({ name: t('navigation.devices'), to: '/devices', isBeta: false });
    publicLinks.push({ name: t('navigation.softwares'), to: '/software-repository', isBeta: false });
    publicLinks.push({ name: t('navigation.updates'), to: '/updates', isBeta: false });
    publicLinks.push({ name: t('navigation.campaigns'), to: '/campaigns', isBeta: false });
    if (features.includes(FEATURES.IMPACT_ANALYSIS)) {
      publicLinks.push({ name: t('navigation.impact_analysis'), to: '/impact-analysis', isBeta: false });
    }

    setLinks(publicLinks);
  }, [features]);

  return (
    <NavContainer id="app-navbar">
      <LogoContainer>
        <Logo />
        <AppName>{t('navigation.app_name')}</AppName>
      </LogoContainer>
      <Ul>
        {renderLinks(t, links)}
      </Ul>
      <SettingsContainer>
        <Support />
        {uiUserProfileMenu && (
          <AccountSidebar />
        )}
      </SettingsContainer>
    </NavContainer>
  );
};

Navbar.propTypes = {
  uiUserProfileMenu: PropTypes.bool,
};

export default Navbar;
