import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'antd';
import {
  ButtonStyled,
  ButtonText,
  IconStyled,
  MenuIndicator,
  MenuItemGroupStyled,
  MenuItemStyled,
  MenuTextContainer,
  MenuTextName,
  MenuTextNamespace,
  MenuStyled,
} from './styled';

const ENVIRONMENTS_DEFAULT_NUMBER = 5;
const MENU_ITEM_HEIGHT = 58;

const environmentsMenu = (handleMenuClick, headerTitle, lightMode, environments, namespaceSelected) => (
  <MenuStyled
    id="environment-selector-menu"
    itemsheight={MENU_ITEM_HEIGHT * ENVIRONMENTS_DEFAULT_NUMBER}
    lightmode={lightMode ? 1 : 0}
    onClick={handleMenuClick}
    showscrolly={environments.length > ENVIRONMENTS_DEFAULT_NUMBER ? 1 : 0}
  >
    <MenuItemGroupStyled id="environment-selector-menu-header" lightmode={lightMode ? 1 : 0} title={headerTitle}>
      {environments.map((item, index) => (
        <MenuItemStyled
          id={`environment-selector-menu-item-${index}`}
          key={`${index}`}
          lightmode={lightMode ? 1 : 0}
        >
          <MenuIndicator id={`environment-selector-menu-indicator-${index}`} selected={item.namespace === namespaceSelected} />
          <MenuTextContainer id={`environment-selector-menu-text-container-${index}`}>
            <MenuTextName id={`environment-selector-menu-text-name-${index}`} lightMode={lightMode}>
              {item.name}
            </MenuTextName>
            <MenuTextNamespace id={`environment-selector-menu-text-namespace-${index}`} lightMode={lightMode}>
              {item.namespace}
            </MenuTextNamespace>
          </MenuTextContainer>
        </MenuItemStyled>
      ))}
    </MenuItemGroupStyled>
  </MenuStyled>
);

const EnvironmentsSelector = (props) => {
  const {
    handleMenuClick,
    headerTitle,
    lightMode,
    environments,
    userEnvironmentNamespace,
    userEnvironmentName
  } = props;
  const [menuVisible, setMenuVisible] = useState(false);
  return (
    <Dropdown
      id="app-subnavbar-environment-menu-dropdown"
      onVisibleChange={(visible) => {
        setMenuVisible(visible);
      }}
      overlay={environmentsMenu(handleMenuClick, headerTitle, lightMode, environments, userEnvironmentNamespace)}
    >
      <ButtonStyled id="app-subnavbar-environment-menu-button">
        <ButtonText id="app-subnavbar-environment-menu-button-text" lightMode={lightMode}>
          {userEnvironmentName}
        </ButtonText>
        <IconStyled
          id="app-subnavbar-environment-menu-icon"
          lightmode={lightMode ? 1 : 0}
          type={menuVisible ? 'up' : 'down'}
        />
      </ButtonStyled>
    </Dropdown>
  );
};

EnvironmentsSelector.propTypes = {
  handleMenuClick: PropTypes.func.isRequired,
  headerTitle: PropTypes.string.isRequired,
  lightMode: PropTypes.bool.isRequired,
  environments: PropTypes.arrayOf(PropTypes.shape({})),
  userEnvironmentNamespace: PropTypes.string.isRequired,
  userEnvironmentName: PropTypes.string.isRequired
};

export default EnvironmentsSelector;
