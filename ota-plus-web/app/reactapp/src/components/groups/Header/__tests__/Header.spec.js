/* eslint-disable no-param-reassign */
import React from 'react';
import { mount } from 'enzyme';
import Header from '..';
import { Provider } from 'mobx-react';
import { ThemeProvider } from 'styled-components';
import theme from '../../../../theme';
import DevicesStore from '../../../../stores/DevicesStore';

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

const mockedStores = {
  devicesStore: new DevicesStore(),
};

function mountComponent(props, stores = mockedStores) {
  return mount(
    <Provider stores={stores}>
      <ThemeProvider theme={theme}>
        <Header {...props} />
      </ThemeProvider>
    </Provider>
  );
}

describe('<Header />', () => {
  let wrapper;
  const mockShowCreateGroupModal = jest.fn();
  const mockUploadDeviceCustomFields = jest.fn();
  const mockRenameCustomDeviceField = jest.fn();

  const props = {
    showCreateGroupModal: mockShowCreateGroupModal,
    uploadDeviceCustomFields: mockUploadDeviceCustomFields
  };
  mockedStores.devicesStore.customDeviceFields = ['TRIM LEVEL', 'COUNTRY'];
  mockedStores.devicesStore.renameCustomDeviceField = mockRenameCustomDeviceField;
  beforeEach(() => {
    wrapper = mountComponent(props, mockedStores);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('renders correctly', () => {
    expect(wrapper.find('Header')).toHaveLength(1);
  });

  it('opens a modal upon clicking a cogwheel', () => {
    wrapper.find('#groups-cogwheel').simulate('click');
    expect(wrapper.exists('.cdf-rename-modal')).toBe(true);
  });

  it('toggles edit mode upon clicking edit field button', () => {
    wrapper.find('#groups-cogwheel').simulate('click');
    wrapper.find('#edit-name-btn').first().simulate('click');
    expect(wrapper.exists('#cdf-name-input')).toBe(true);
    expect(wrapper.exists('#save-name-btn')).toBe(true);
    expect(wrapper.exists('#cdf-util-icon')).toBe(true);
  });

  it('handles field input change', () => {
    wrapper.find('#groups-cogwheel').simulate('click');
    wrapper.find('#edit-name-btn').first().simulate('click');
    wrapper.find('#cdf-name-input').find('input').simulate('change', { target: { value: 'Newname' } });
    wrapper.find('#save-name-btn').simulate('click');
    expect(mockRenameCustomDeviceField).toHaveBeenCalled();
  });
});
