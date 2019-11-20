/** @format */

import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useObserver } from 'mobx-react';
import { useTranslation } from 'react-i18next';
import { useStores } from '../../stores/hooks';
import { COLORS } from '../../constants/styleConstants';
import { FEATURES } from '../../config';
import {
  OTA_NAV_DEVICES,
  OTA_NAV_HOMEPAGE,
  OTA_NAV_SOFTWARE_VERSIONS,
  OTA_NAV_SOFTWARE_UPDATES,
  OTA_NAV_CAMPAIGNS,
  OTA_NAV_IMPACT
} from '../../constants/analyticsActions';
import AccountSidebar from '../AccountSidebar';
import HelpSidebar from '../HelpSidebar';
import {
  AppName,
  BetaTag,
  Li,
  Link,
  Logo,
  LogoContainer,
  NavContainer,
  SettingsContainer,
  Ul
} from './styled';
import { sendAction } from '../../helpers/analyticsHelper';

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
      publicLinks.push({ actionType: OTA_NAV_HOMEPAGE, name: t('navigation.home'), to: '/home', isBeta: true });
    }
    publicLinks.push({ name: t('navigation.dashboard'), to: '/', isBeta: false });
    publicLinks.push({ actionType: OTA_NAV_DEVICES, name: t('navigation.devices'), to: '/devices', isBeta: false });
    publicLinks.push({
      actionType: OTA_NAV_SOFTWARE_VERSIONS,
      name: t('navigation.softwares'),
      to: '/software-repository',
      isBeta: false
    });
    publicLinks.push({
      actionType: OTA_NAV_SOFTWARE_UPDATES,
      name: t('navigation.updates'),
      to: '/updates',
      isBeta: false
    });
    publicLinks.push(
      {
        actionType: OTA_NAV_CAMPAIGNS,
        name: t('navigation.campaigns'),
        to: '/campaigns',
        isBeta: false
      }
    );
    if (features.includes(FEATURES.IMPACT_ANALYSIS)) {
      publicLinks.push({
        actionType: OTA_NAV_IMPACT,
        name: t('navigation.impact-analysis'),
        to: '/impact-analysis',
        isBeta: false
      });
    }

    setLinks(publicLinks);
  }, [features]);

  const onClick = (actionType) => {
    if (actionType) {
      sendAction(actionType);
    }
  };

  const renderLinks = linkList => (
    linkList.map(({ actionType, isBeta, name, to }) => (
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
          onClick={() => onClick(actionType)}
        >
          {name}
          {isBeta && <BetaTag>{t('miscellaneous.beta')}</BetaTag>}
        </Link>
      </Li>
    ))
  );

  return (
    <NavContainer id="app-navbar">
      <LogoContainer>
        <Logo />
        <AppName>{t('navigation.app-name')}</AppName>
      </LogoContainer>
      <Ul>
        {renderLinks(links)}
      </Ul>
      <SettingsContainer>
        <HelpSidebar />
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
