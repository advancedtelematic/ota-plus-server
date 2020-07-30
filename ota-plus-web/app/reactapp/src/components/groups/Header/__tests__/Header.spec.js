/* eslint-disable no-param-reassign */
import React from 'react';
import { mount } from 'enzyme';
import Header from '..';
import { Provider } from 'mobx-react';
import { ThemeProvider } from 'styled-components';
import theme from '../../../../theme';
import DevicesStore from '../../../../stores/DevicesStore';
import GroupsStore from '../../../../stores/GroupsStore';

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
  groupsStore: new GroupsStore(),
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
  const mockRenameCustomDeviceField = jest.fn((oldName, newName, onFinished) => {
    onFinished();
  });
  const mockDeleteCustomDeviceField = jest.fn((name, onFinished) => {
    onFinished();
  });
  const mockFetchExpressionForSelectedGroup = jest.fn();

  const props = {
    showCreateGroupModal: mockShowCreateGroupModal,
    uploadDeviceCustomFields: mockUploadDeviceCustomFields
  };
  mockedStores.devicesStore.customDeviceFields = [{ tagId: 'TRIM LEVEL' }, { tagId: 'COUNTRY' }];
  mockedStores.devicesStore.renameCustomDeviceField = mockRenameCustomDeviceField;
  mockedStores.devicesStore.deleteCustomDeviceField = mockDeleteCustomDeviceField;
  mockedStores.groupsStore.fetchExpressionForSelectedGroup = mockFetchExpressionForSelectedGroup;
  mockedStores.groupsStore.selectedGroup = { isSmart: false };
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

  it('should call expressions', () => {
    mockedStores.groupsStore.selectedGroup = { isSmart: true };
    wrapper.find('#groups-cogwheel').simulate('click');
    wrapper.find('#edit-name-btn').first().simulate('click');
    wrapper.find('#cdf-name-input').find('input').simulate('change', { target: { value: 'Newname' } });
    wrapper.find('#save-name-btn').simulate('click');
    expect(mockFetchExpressionForSelectedGroup).toHaveBeenCalled();
  });

  it('should show delete warning modal', () => {
    mockedStores.groupsStore.selectedGroup = { isSmart: true };
    wrapper.find('#groups-cogwheel').simulate('click');
    console.log('wrapper.debug(): ', wrapper.debug());
    wrapper.find('#delete-name-btn-COUNTRY').first().simulate('click');
    expect(wrapper.exists('#warning-modal')).toBe(true);
  });

  // it('should call delete function in device store', () => {
  //   wrapper.find('#groups-cogwheel').simulate('click');
  //   wrapper.find('#delete-name-btn-COUNTRY').first().simulate('click');
  //   wrapper.find('#warning-confirm-btn').first().simulate('click');
  //   expect(mockDeleteCustomDeviceField).toHaveBeenCalled();
  // });
});
