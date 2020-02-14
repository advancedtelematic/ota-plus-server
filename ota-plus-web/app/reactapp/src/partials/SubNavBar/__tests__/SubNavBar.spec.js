
import React from 'react';
import { mount, shallow } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { Provider } from 'mobx-react';
import { ThemeProvider } from 'styled-components';
import FeaturesStore from '../../../stores/FeaturesStore';
import UserStore from '../../../stores/UserStore';
import theme from '../../../theme';
import SubNavBar from '../index';
import * as analyticsHelper from '../../../helpers/analyticsHelper';
import { OTA_NAV_ENV_SWITCH } from '../../../constants/analyticsActions';
import { FEATURES } from '../../../config';

const ENVIRONMENTS = [{ name: 'ENV_1', namespace: 'NAMESPACE_1' }, { name: 'ENV_2', namespace: 'NAMESPACE_2' }];
const USER_ENVIRONMENT_NAMESPACE = 'NAMESPACE_1';
const USER_ENVIRONMENT_NAME = 'ENV_1';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: key => key.toUpperCase()
  }),
  withTranslation: () => y => y
}));

const mockedStores = {
  featuresStore: new FeaturesStore(),
  userStore: new UserStore(),
};

function mountSubNavBar(stores = mockedStores) {
  return mount(
    <Provider stores={stores}>
      <ThemeProvider theme={theme}>
        <SubNavBar lightMode />
      </ThemeProvider>
    </Provider>
  );
}


describe('<SubNavBar />', () => {
  let wrapper;
  beforeEach(() => {
    mockedStores.featuresStore.features = [FEATURES.ORGANIZATIONS];
    mockedStores.userStore.userOrganizationName = USER_ENVIRONMENT_NAME;
    mockedStores.userStore.userOrganizationNamespace = USER_ENVIRONMENT_NAMESPACE;
    mockedStores.userStore.userOrganizations = ENVIRONMENTS;
    wrapper = mountSubNavBar();
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('should mount', () => {
    expect(wrapper.find('SubNavBar')).toHaveLength(1);
    expect(wrapper.exists('#app-subnavbar')).toEqual(true);
    expect(wrapper.exists('#app-subnavbar-environment-container')).toEqual(true);
    expect(wrapper.exists('#app-subnavbar-environment-selector')).toEqual(true);
  });

  it('should call sendAction with OTA_NAV_ENV_SWITCH', () => {
    analyticsHelper.sendAction = jest.fn();
    window.location.replace = jest.fn();
    const environmentsSelector = wrapper.find('#app-subnavbar-environment-selector');
    const submenu = shallow(<div>{environmentsSelector.children().first().prop('overlay')}</div>);
    expect(submenu.exists('#environment-selector-menu')).toEqual(true);
    const selectorMenu = submenu.find('#environment-selector-menu');
    act(() => {
      selectorMenu.simulate('click', { key: 1 });
    });
    expect(analyticsHelper.sendAction).toBeCalledWith(OTA_NAV_ENV_SWITCH);
    expect(analyticsHelper.sendAction).toHaveBeenCalledTimes(1);
  });

  it('should not call sendAction with OTA_NAV_ENV_SWITCH', () => {
    analyticsHelper.sendAction = jest.fn();
    const environmentsSelector = wrapper.find('#app-subnavbar-environment-selector');
    const submenu = shallow(<div>{environmentsSelector.children().first().prop('overlay')}</div>);
    expect(submenu.exists('#environment-selector-menu')).toEqual(true);
    const selectorMenu = submenu.find('#environment-selector-menu');
    act(() => {
      selectorMenu.simulate('click', { key: 0 });
    });
    expect(analyticsHelper.sendAction).toHaveBeenCalledTimes(0);
  });
});
