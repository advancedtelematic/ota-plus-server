import React from 'react';
import { mount } from 'enzyme';
import AddSoftwareModal from '..';
import { Provider } from 'mobx-react';
import { ThemeProvider } from 'styled-components';
import theme from '../../../../theme';
import HardwareStore from '../../../../stores/HardwareStore';
import SoftwareStore from '../../../../stores/SoftwareStore';
import * as analyticsHelper from '../../../../helpers/analyticsHelper';
import { UPLOADING_STATUS } from '../../../../constants';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: key => key.toUpperCase()
  }),
  withTranslation: () => y => y,
  initReactI18next: () => {}
}));

const mockedStores = {
  hardwareStore: new HardwareStore(),
  softwareStore: new SoftwareStore()
};

function mountComponent(props, stores = mockedStores) {
  return mount(
    <Provider stores={stores}>
      <ThemeProvider theme={theme}>
        <AddSoftwareModal {...props} />
      </ThemeProvider>
    </Provider>
  );
}

describe('<AddSoftwareModal />', () => {
  let wrapper;

  const mockHideFunc = jest.fn();
  const mockCreatePackage = jest.fn();
  analyticsHelper.sendAction = jest.fn();

  const props = { hide: mockHideFunc };

  beforeEach(() => {
    mockedStores.hardwareStore.hardwareIds = ['hw-1', 'hw-2', 'hw-3'];
    mockedStores.softwareStore.createPackage = mockCreatePackage;
    wrapper = mountComponent(props);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('renders correctly', () => {
    expect(wrapper.find('AddSoftwareModal')).toHaveLength(1);
  });

  it('should disable upload button by default', () => {
    expect(wrapper.find('#confirm-btn').first().prop('disabled')).toEqual(true);
  });

  it('should close modal on x-icon click', () => {
    wrapper.find('#close-icon').first().simulate('click');
    expect(mockHideFunc).toHaveBeenCalled();
  });

  it('should validate form data', () => {
    wrapper.find('#add-new-software-name').first().simulate('change', { target: { value: 'soft' } });
    expect(wrapper.find('#add-new-software-name').find('input').props().value).toBe('soft');
    wrapper.find('#add-new-software-version').first().simulate('change', { target: { value: '2.0' } });
    expect(wrapper.find('#add-new-software-version').find('input').props().value).toBe('2.0');
    wrapper.find('#ecu-types-select').first().simulate('click');
    wrapper.find('.ant-select-dropdown').find('#hw-1-option').first().simulate('click');
    wrapper.find('#choose-software').first().simulate('click');
    wrapper.find('#file-input-hidden').simulate('change', { target: { files: ['test'], value: 'test' } });
    expect(wrapper.find('#confirm-btn').first().prop('disabled')).toEqual(false);
    wrapper.find('#confirm-btn').first().simulate('click');
    expect(mockCreatePackage).toHaveBeenCalled();
    expect(mockHideFunc).toHaveBeenCalled();
  });

  it('should handle ecu select/deselect', () => {
    wrapper.find('#ecu-types-select').first().simulate('click');
    expect(wrapper.exists('.ant-select-open')).toEqual(true);
    expect(wrapper.exists('.ant-select-dropdown')).toBe(true);
    wrapper.find('.ant-select-dropdown').first().simulate('click');
    wrapper.find('.ant-select-dropdown').find('#hw-1-option').first().simulate('click');
    wrapper.find('.ant-select-dropdown').find('#hw-2-option').first().simulate('click');
    expect(wrapper.exists('#hw-1-pill')).toBe(true);
    expect(wrapper.exists('#hw-2-pill')).toBe(true);
    wrapper.find('#hw-2-pill').find('i').first().simulate('click');
    expect(wrapper.exists('#hw-2-pill')).toBe(false);
  });

  it('should display error if file size is too big', () => {
    wrapper.find('#choose-software').first().simulate('click');
    wrapper.find('#file-input-hidden').simulate('change', { target: { files: [{ size: 3673274243 }], value: 'test' } });
    expect(wrapper.exists('#file-size-error')).toEqual(true);
  });

  it('should handle file removal', () => {
    wrapper.find('#choose-software').first().simulate('click');
    wrapper.find('#file-input-hidden').simulate('change', { target: { files: ['test'], value: 'test' } });
    expect(wrapper.exists('#attached-file-pill')).toEqual(true);
    wrapper.find('#attached-file-pill').first().find('i').simulate('click');
    expect(wrapper.exists('#attached-file-pill')).toEqual(false);
  });

  it('should display proper components for idle status', () => {
    expect(wrapper.exists('#sw-create-modal-info-status-bar')).toEqual(false);
    expect(wrapper.exists('#text-label-software-name')).toEqual(false);
    expect(wrapper.exists('#add-new-software-name')).toEqual(true);
    expect(wrapper.exists('#progress-bar')).toEqual(false);
  });

  it('should display proper components for in progress status', () => {
    wrapper.find('#add-new-software-name').first().simulate('change', { target: { value: 'soft' } });
    expect(wrapper.find('#add-new-software-name').find('input').props().value).toBe('soft');
    wrapper.find('#add-new-software-version').first().simulate('change', { target: { value: '2.0' } });
    expect(wrapper.find('#add-new-software-version').find('input').props().value).toBe('2.0');
    wrapper.find('#ecu-types-select').first().simulate('click');
    wrapper.find('.ant-select-dropdown').find('#hw-1-option').first().simulate('click');
    wrapper.find('#choose-software').first().simulate('click');
    wrapper.find('#file-input-hidden').simulate('change', { target: { files: ['test'], value: 'test' } });
    expect(wrapper.find('#confirm-btn').first().prop('disabled')).toEqual(false);
    wrapper.find('#confirm-btn').first().simulate('click');
    expect(wrapper.exists('#sw-create-modal-info-status-bar')).toEqual(false);
    expect(wrapper.exists('#text-label-software-name')).toEqual(true);
    expect(wrapper.exists('#add-new-software-name')).toEqual(false);
    expect(wrapper.exists('#progress-bar')).toEqual(true);
  });

  it('should display cancel message', () => {
    wrapper.find('#add-new-software-name').first().simulate('change', { target: { value: 'soft' } });
    expect(wrapper.find('#add-new-software-name').find('input').props().value).toBe('soft');
    wrapper.find('#add-new-software-version').first().simulate('change', { target: { value: '2.0' } });
    expect(wrapper.find('#add-new-software-version').find('input').props().value).toBe('2.0');
    wrapper.find('#ecu-types-select').first().simulate('click');
    wrapper.find('.ant-select-dropdown').find('#hw-1-option').first().simulate('click');
    wrapper.find('#choose-software').first().simulate('click');
    wrapper.find('#file-input-hidden').simulate('change', { target: { files: ['test'], value: 'test' } });
    expect(wrapper.find('#confirm-btn').first().prop('disabled')).toEqual(false);
    wrapper.find('#confirm-btn').first().simulate('click');
    wrapper.find('#cancel-btn').first().simulate('click');
    expect(wrapper.exists('#software-uploading-cancel-message')).toEqual(true);
  });

  it('should display proper components for cancel status and call cancel function', () => {
    const cancelFunction = jest.fn();
    mockedStores.softwareStore.packagesUploading = [
      {
        source: {
          cancel: cancelFunction
        }
      }
    ];
    wrapper = mountComponent(props);
    wrapper.find('#add-new-software-name').first().simulate('change', { target: { value: 'soft' } });
    expect(wrapper.find('#add-new-software-name').find('input').props().value).toBe('soft');
    wrapper.find('#add-new-software-version').first().simulate('change', { target: { value: '2.0' } });
    expect(wrapper.find('#add-new-software-version').find('input').props().value).toBe('2.0');
    wrapper.find('#ecu-types-select').first().simulate('click');
    wrapper.find('.ant-select-dropdown').find('#hw-1-option').first().simulate('click');
    wrapper.find('#choose-software').first().simulate('click');
    wrapper.find('#file-input-hidden').simulate('change', { target: { files: ['test'], value: 'test' } });
    expect(wrapper.find('#confirm-btn').first().prop('disabled')).toEqual(false);
    wrapper.find('#confirm-btn').first().simulate('click');
    wrapper.find('#cancel-btn').first().simulate('click');
    wrapper.find('#warning-confirm-btn').first().simulate('click');
    expect(wrapper.exists('#sw-create-modal-info-status-bar')).toEqual(true);
    expect(wrapper.exists('#text-label-software-name')).toEqual(false);
    expect(wrapper.exists('#add-new-software-name')).toEqual(true);
    expect(wrapper.exists('#progress-bar')).toEqual(false);
    expect(cancelFunction).toHaveBeenCalled();
  });

  it('should display proper components for success status', () => {
    mockedStores.softwareStore.createPackage = jest.fn((data, formData, hardwareIds, onUploadProgress, onFinished) => {
      onFinished(UPLOADING_STATUS.SUCCESS);
    });
    wrapper = mountComponent(props);
    wrapper.find('#add-new-software-name').first().simulate('change', { target: { value: 'soft' } });
    expect(wrapper.find('#add-new-software-name').find('input').props().value).toBe('soft');
    wrapper.find('#add-new-software-version').first().simulate('change', { target: { value: '2.0' } });
    expect(wrapper.find('#add-new-software-version').find('input').props().value).toBe('2.0');
    wrapper.find('#ecu-types-select').first().simulate('click');
    wrapper.find('.ant-select-dropdown').find('#hw-1-option').first().simulate('click');
    wrapper.find('#choose-software').first().simulate('click');
    wrapper.find('#file-input-hidden').simulate('change', { target: { files: ['test'], value: 'test' } });
    expect(wrapper.find('#confirm-btn').first().prop('disabled')).toEqual(false);
    wrapper.find('#confirm-btn').first().simulate('click');
    expect(wrapper.exists('#sw-create-modal-info-status-bar')).toEqual(true);
    expect(wrapper.exists('#text-label-software-name')).toEqual(true);
    expect(wrapper.exists('#add-new-software-name')).toEqual(false);
    expect(wrapper.exists('#progress-bar')).toEqual(false);
  });

  it('should display proper components for error status', () => {
    mockedStores.softwareStore.createPackage = jest.fn((data, formData, hardwareIds, onUploadProgress, onFinished) => {
      onFinished(UPLOADING_STATUS.ERROR);
    });
    wrapper = mountComponent(props);
    wrapper.find('#add-new-software-name').first().simulate('change', { target: { value: 'soft' } });
    expect(wrapper.find('#add-new-software-name').find('input').props().value).toBe('soft');
    wrapper.find('#add-new-software-version').first().simulate('change', { target: { value: '2.0' } });
    expect(wrapper.find('#add-new-software-version').find('input').props().value).toBe('2.0');
    wrapper.find('#ecu-types-select').first().simulate('click');
    wrapper.find('.ant-select-dropdown').find('#hw-1-option').first().simulate('click');
    wrapper.find('#choose-software').first().simulate('click');
    wrapper.find('#file-input-hidden').simulate('change', { target: { files: ['test'], value: 'test' } });
    expect(wrapper.find('#confirm-btn').first().prop('disabled')).toEqual(false);
    wrapper.find('#confirm-btn').first().simulate('click');
    expect(wrapper.exists('#sw-create-modal-info-status-bar')).toEqual(true);
    expect(wrapper.exists('#text-label-software-name')).toEqual(false);
    expect(wrapper.exists('#add-new-software-name')).toEqual(true);
    expect(wrapper.exists('#progress-bar')).toEqual(false);
  });

  it('should display proper progress bar', () => {
    const LOADED_DATA_SIZE = 500;
    const TOTAL_DATA_SIZE = 1000;
    const EXPECTED_PERCENTAGE = 50;
    mockedStores.softwareStore.createPackage = jest.fn((data, formData, hardwareIds, onUploadProgress) => {
      onUploadProgress(LOADED_DATA_SIZE, TOTAL_DATA_SIZE);
    });
    wrapper = mountComponent(props);
    wrapper.find('#add-new-software-name').first().simulate('change', { target: { value: 'soft' } });
    expect(wrapper.find('#add-new-software-name').find('input').props().value).toBe('soft');
    wrapper.find('#add-new-software-version').first().simulate('change', { target: { value: '2.0' } });
    expect(wrapper.find('#add-new-software-version').find('input').props().value).toBe('2.0');
    wrapper.find('#ecu-types-select').first().simulate('click');
    wrapper.find('.ant-select-dropdown').find('#hw-1-option').first().simulate('click');
    wrapper.find('#choose-software').first().simulate('click');
    wrapper.find('#file-input-hidden').simulate('change', { target: { files: ['test'], value: 'test' } });
    expect(wrapper.find('#confirm-btn').first().prop('disabled')).toEqual(false);
    wrapper.find('#confirm-btn').first().simulate('click');
    expect(wrapper.find('#progress-bar').first().prop('widthPercentage')).toEqual(EXPECTED_PERCENTAGE);
  });
});
