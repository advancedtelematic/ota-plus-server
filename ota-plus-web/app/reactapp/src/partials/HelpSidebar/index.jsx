import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Title } from '..';
import Sidebar from '../Sidebar';
import { HELP_ICON_DARK } from '../../config';
import { URL_GET_STARTED, URL_DOCS, MAIL_SUPPORT } from '../../constants/urlConstants';
import {
  HelpIcon,
  LinksContainer,
  SidebarHeader,
  Support
} from './styled';

const ARROW_RIGHT = String.fromCharCode(8594);

const renderLinks = (t, links) => (
  links.map(({ name, to }) => (
    <a
      id={`help-sidebar-link-${name}`}
      href={to}
      key={name}
      rel="noopener noreferrer"
      target="_blank"
    >
      {`${t(`help_sidebar.links.${name}`)} ${ARROW_RIGHT}`}
    </a>
  ))
);

const HelpSidebar = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const { t } = useTranslation();

  const links = [
    { name: 'get_started', to: URL_GET_STARTED },
    { name: 'docs', to: URL_DOCS },
    { name: 'contact', to: MAIL_SUPPORT }
  ];

  const onClose = () => {
    setSidebarVisible(false);
  };

  const openSidebar = () => {
    setSidebarVisible(true);
  };

  return (
    <>
      <Support id="help-icon" onClick={openSidebar} isActive={isSidebarVisible} />
      <Sidebar onClose={onClose} visible={isSidebarVisible}>
        <SidebarHeader>
          <HelpIcon src={HELP_ICON_DARK} />
          <Title size="large">{t('help_sidebar.title')}</Title>
        </SidebarHeader>
        <LinksContainer>
          {renderLinks(t, links)}
        </LinksContainer>
      </Sidebar>
    </>
  );
};

export default HelpSidebar;
