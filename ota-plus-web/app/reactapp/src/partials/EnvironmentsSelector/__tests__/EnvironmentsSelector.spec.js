import React from 'react';
import { mount } from 'enzyme';
import { ThemeProvider } from 'styled-components';
import { act } from 'react-dom/test-utils';
import EnvironmentsSelector from '../index';
import theme from '../../../theme';

const HEADER_TITLE = 'ENVIRONMENT';
const LIGHT_MODE = true;
const HANDLE_MENU_CLICK_FUNCTION = () => {};
const ENVIRONMENTS = [{ name: 'ENV_1', namespace: 'NAMESPACE_1' }, { name: 'ENV_2', namespace: 'NAMESPACE_2' }];
const USER_ENVIRONMENT_NAMESPACE = 'NAMESPACE_1';
const USER_ENVIRONMENT_NAME = 'ENV_1';

function mountEnvironmentsSelector(
  headerTitle = HEADER_TITLE,
  lightMode = LIGHT_MODE,
  handleMenuClick = HANDLE_MENU_CLICK_FUNCTION,
  environments = ENVIRONMENTS,
  userEnvironmentNamespace = USER_ENVIRONMENT_NAMESPACE,
  userEnvironmentName = USER_ENVIRONMENT_NAME
) {
  return mount(
    <ThemeProvider theme={theme}>
      <EnvironmentsSelector
        handleMenuClick={handleMenuClick}
        headerTitle={headerTitle}
        lightMode={lightMode}
        environments={environments}
        userEnvironmentNamespace={userEnvironmentNamespace}
        userEnvironmentName={userEnvironmentName}
      />
    </ThemeProvider>
  );
}

describe('<EnvironmentsSelector />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mountEnvironmentsSelector();
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('should mount', () => {
    expect(wrapper.find('EnvironmentsSelector')).toHaveLength(1);
    expect(wrapper.exists('app-subnavbar-environment-menu-dropdown')).toEqual(false);
    expect(wrapper.exists('app-subnavbar-environment-menu-button')).toEqual(false);
    expect(wrapper.exists('app-subnavbar-environment-menu-button-text')).toEqual(false);
    expect(wrapper.exists('app-subnavbar-environment-menu-icon')).toEqual(false);
    expect(wrapper.exists('#environment-selector-menu')).toEqual(false);
    expect(wrapper.exists('#environment-selector-menu-header')).toEqual(false);
  });

  it('should have light mode set to true', () => {
    expect(wrapper.find('#app-subnavbar-environment-menu-button-text').first().props().lightMode).toEqual(true);
    expect(wrapper.find('#app-subnavbar-environment-menu-icon').first().props().lightmode).toEqual(1);
  });

  it('should have light mode set to false', () => {
    wrapper = mountEnvironmentsSelector(HEADER_TITLE, false);
    expect(wrapper.find('#app-subnavbar-environment-menu-button-text').first().props().lightMode).toEqual(false);
    expect(wrapper.find('#app-subnavbar-environment-menu-icon').first().props().lightmode).toEqual(0);
  });

  it('should change menu icon type', async () => {
    expect(wrapper.find('#app-subnavbar-environment-menu-icon').at(0).props().type).toEqual('down');
    const dropdownMenu = wrapper.find('#app-subnavbar-environment-menu-dropdown').at(0);
    act(() => {
      dropdownMenu.props().onVisibleChange(true);
    });
    wrapper.update();
    expect(wrapper.find('#app-subnavbar-environment-menu-icon').at(0).props().type).toEqual('up');
  });

  it('should render dropdown menu', () => {
    const dropdownMenu = wrapper.find('#app-subnavbar-environment-menu-dropdown').at(0);
    const submenu = mount(
      <ThemeProvider theme={theme}><div>{dropdownMenu.first().prop('overlay')}</div></ThemeProvider>
    );
    expect(submenu.exists('#environment-selector-menu')).toEqual(true);
    expect(submenu.exists('#environment-selector-menu-header')).toEqual(true);

    expect(submenu.exists('#environment-selector-menu-item-1')).toEqual(true);
    expect(submenu.exists('#environment-selector-menu-indicator-1')).toEqual(true);
    expect(submenu.exists('#environment-selector-menu-text-container-1')).toEqual(true);
    expect(submenu.exists('#environment-selector-menu-text-name-1')).toEqual(true);
    expect(submenu.exists('#environment-selector-menu-text-namespace-1')).toEqual(true);
  });

  it('should click on menu item', () => {
    const handleMenuClick = jest.fn();
    wrapper = mountEnvironmentsSelector(HEADER_TITLE, LIGHT_MODE, handleMenuClick);
    const dropdownMenu = wrapper.find('#app-subnavbar-environment-menu-dropdown');
    const submenu = mount(
      <ThemeProvider theme={theme}><div>{dropdownMenu.first().prop('overlay')}</div></ThemeProvider>
    );
    expect(submenu.exists('#environment-selector-menu')).toEqual(true);
    const environmentsMenu = submenu.find('#environment-selector-menu').at(0);
    const params = { key: 0 };
    environmentsMenu.props().onClick(params);
    expect(handleMenuClick).toBeCalledWith(params);
    // expect(handleMenuClick).toBeCalledWith({});
  });
});
