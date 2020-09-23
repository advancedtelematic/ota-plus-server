/* eslint-disable no-param-reassign */
import React from 'react';
import { mount } from 'enzyme';
import CustomDeviceFieldsEditor from '..';
import { Provider } from 'mobx-react';
import { ThemeProvider } from 'styled-components';
import theme from '../../../../theme';
import DevicesStore from '../../../../stores/DevicesStore';
import UserStore from '../../../../stores/UserStore';
import { UI_FEATURES } from '../../../../config';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: key => key.toUpperCase()
  }),
  withTranslation: () => (Component) => {
    Component.defaultProps = { ...Component.defaultProps, t: () => '' };
    return Component;
  },
  initReactI18next: () => {}
}));

jest.mock('react-router-dom', () => ({
  useHistory: () => ({ history: { push: jest.fn() } }),
  withRouter: (component) => {
    component.defaultProps = {
      ...component.defaultProps,
      router: { pathname: 'mocked-path' }
    };
    return component;
  }
}));

const USER_UI_FEATURES = [
  {
    id: UI_FEATURES.EDIT_CUSTOM_FIELD_VALUE,
    isAllowed: true
  },
];

const mockedStores = {
  devicesStore: new DevicesStore(),
  userStore: new UserStore()
};

function mountComponent(props, stores = mockedStores) {
  return mount(
    <Provider stores={stores}>
      <ThemeProvider theme={theme}>
        <CustomDeviceFieldsEditor {...props} />
      </ThemeProvider>
    </Provider>
  );
}


describe('<CustomDeviceFieldsEditor />', () => {
  let wrapper;

  beforeEach(() => {
    mockedStores.devicesStore.deviceSpecificTags = [['TRIM LEVEL', 'Premium'], ['COUNTRY', 'Germany']];
    mockedStores.userStore.uiFeatures = USER_UI_FEATURES;
    wrapper = mountComponent({}, mockedStores);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('renders correctly', () => {
    expect(wrapper.find('CustomDeviceFieldsEditor')).toHaveLength(1);
  });

  it('renders empty view when there are none cdf available', () => {
    wrapper.unmount();
    mockedStores.devicesStore.deviceSpecificTags = [];
    wrapper = mountComponent();
    expect(wrapper.find('CustomDeviceFieldsEditor')).toHaveLength(1);
    expect(wrapper.exists('#upload-file-btn')).toBe(true);
  });

  it('toggles edit mode upon clicking edit field button', () => {
    wrapper.find('#edit-name-btn').first().simulate('click');
    expect(wrapper.exists('#cdf-name-input')).toBe(true);
    expect(wrapper.exists('#save-name-btn')).toBe(true);
    expect(wrapper.exists('#cdf-util-icon')).toBe(true);
  });

  it('handles field input change', () => {
    wrapper.find('#edit-name-btn').first().simulate('click');
    wrapper.find('#cdf-name-input').find('input').simulate('change', { target: { value: 'Newname' } });
    wrapper.find('#save-name-btn').simulate('click');
  });
});
