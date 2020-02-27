import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useObserver } from 'mobx-react';
import { Title } from '..';
import Sidebar from '../Sidebar';
import { HELP_ICON_DARK } from '../../config';
import { URL_GET_STARTED, MAIL_SUPPORT, URL_DEV_GUIDE, URL_USER_GUIDE } from '../../constants/urlConstants';
import { sendAction } from '../../helpers/analyticsHelper';
import {
  OTA_NAV_GET_STARTED,
  OTA_NAV_DEV_GUIDE,
  OTA_NAV_USER_GUIDE,
  OTA_NAV_CONTACT
} from '../../constants/analyticsActions';
import {
  HelpIcon,
  LinksContainer,
  SidebarHeader,
  Support
} from './styled';
import { useStores } from '../../stores/hooks';

const ARROW_RIGHT = String.fromCharCode(8594);

function useStoreData() {
  const { stores } = useStores();
  return useObserver(() => ({
    features: stores.featuresStore.features
  }));
}

const HelpSidebar = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const { t } = useTranslation();
  const { features } = useStoreData();

  const links = [
    { actionType: OTA_NAV_GET_STARTED, name: 'get-started', to: URL_GET_STARTED },
    { actionType: OTA_NAV_DEV_GUIDE, name: 'developer-guide', to: URL_DEV_GUIDE },
    { actionType: OTA_NAV_USER_GUIDE, name: 'user-guide', to: URL_USER_GUIDE },
    { actionType: OTA_NAV_CONTACT, name: 'contact', to: MAIL_SUPPORT }
  ];

  const onClose = () => {
    setSidebarVisible(false);
  };

  const openSidebar = () => {
    setSidebarVisible(true);
  };

  const onClick = (actionType) => {
    sendAction(actionType);
  };

  const renderLinks = linkList => (
    linkList.map(({ actionType, name, to }) => (
      <a
        id={`help-sidebar-link-${name}`}
        href={to}
        key={name}
        rel="noopener noreferrer"
        target="_blank"
        onClick={() => onClick(actionType)}
      >
        {`${t(`help-sidebar.links.${name}`)} ${ARROW_RIGHT}`}
      </a>
    ))
  );

  return (
    <>
      <Support id="help-icon" onClick={openSidebar} isActive={isSidebarVisible} />
      <Sidebar onClose={onClose} visible={isSidebarVisible} features={features}>
        <SidebarHeader>
          <HelpIcon src={HELP_ICON_DARK} />
          <Title size="large">{t('help-sidebar.title')}</Title>
        </SidebarHeader>
        <LinksContainer>
          {renderLinks(links)}
        </LinksContainer>
      </Sidebar>
    </>
  );
};

export default HelpSidebar;
