import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'mobx-react';
import { ThemeProvider } from 'styled-components';
import DevicesStore from '../../../../stores/DevicesStore';
import theme from '../../../../theme';
import * as analyticsHelper from '../../../../helpers/analyticsHelper';
import CustomFieldsUploadModal from '../index';
import { UPLOADING_STATUS } from '../../../../constants';
import {
  OTA_DEVICES_CUSTOM_FAILED,
  OTA_DEVICES_CUSTOM_UPLOAD
} from '../../../../constants/analyticsActions';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: key => key.toUpperCase()
  }),
  withTranslation: () => y => y,
  initReactI18next: () => {}
}));

const mockedStores = {
  devicesStore: new DevicesStore(),
};

function mountComponent(props, stores = mockedStores) {
  return mount(
    <Provider stores={stores}>
      <ThemeProvider theme={theme}>
        <CustomFieldsUploadModal {...props} />
      </ThemeProvider>
    </Provider>
  );
}

describe('<CustomFieldsUploadModal />', () => {
  let wrapper;

  const mockHideFunc = jest.fn();
  const mockUploadCustomFields = jest.fn();
  analyticsHelper.sendAction = jest.fn();

  const props = { hide: mockHideFunc };

  beforeEach(() => {
    mockedStores.devicesStore.uploadCustomFields = mockUploadCustomFields;
    wrapper = mountComponent(props);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('renders correctly', () => {
    expect(wrapper.find('CustomFieldsUploadModal')).toHaveLength(1);
  });

  it('should disable upload button by default', () => {
    expect(wrapper.find('#devices-custom-fields-confirm-button').first().prop('disabled')).toEqual(true);
  });

  it('should close modal on x-icon click', () => {
    wrapper.find('#devices-custom-fields-close-icon').first().simulate('click');
    expect(mockHideFunc).toHaveBeenCalled();
  });

  it('should call uploadCustomFields function', () => {
    wrapper.find('#devices-custom-fields-file-input-hidden')
      .simulate('change', { target: { files: ['test'], value: 'test' } });
    expect(wrapper.find('#devices-custom-fields-confirm-button').first().prop('disabled')).toEqual(false);
    wrapper.find('#devices-custom-fields-confirm-button').first().simulate('click');
    expect(mockUploadCustomFields).toHaveBeenCalled();
  });

  it('should handle file removal', () => {
    wrapper.find('#devices-custom-fields-choose-file-button').first().simulate('click');
    wrapper.find('#devices-custom-fields-file-input-hidden')
      .simulate('change', { target: { files: ['test'], value: 'test' } });
    expect(wrapper.exists('#devices-custom-fields-attached-file-pill')).toEqual(true);
    wrapper.find('#devices-custom-fields-attached-file-pill').first().find('i').simulate('click');
    expect(wrapper.exists('#devices-custom-fields-attached-file-pill')).toEqual(false);
  });

  it('should display proper components for idle status', () => {
    expect(wrapper.exists('#devices-custom-fields-choose-file-button')).toEqual(true);
    expect(wrapper.exists('#devices-custom-fields-confirm-button')).toEqual(true);
    expect(wrapper.exists('#devices-custom-fields-cancel-button')).toEqual(true);
    expect(wrapper.exists('#devices-custom-fields-modal-info-status-bar')).toEqual(false);
  });

  it('should display proper components for malformed status', () => {
    mockedStores.devicesStore.uploadCustomFields = jest.fn((formData, onFinished) => {
      onFinished(UPLOADING_STATUS.MALFORMED);
    });
    wrapper = mountComponent(props);
    wrapper.find('#devices-custom-fields-choose-file-button').first().simulate('click');
    wrapper.find('#devices-custom-fields-file-input-hidden')
      .simulate('change', { target: { files: ['test'], value: 'test' } });
    expect(wrapper.find('#devices-custom-fields-confirm-button').first().prop('disabled')).toEqual(false);
    wrapper.find('#devices-custom-fields-confirm-button').first().simulate('click');
    expect(wrapper.exists('#devices-custom-fields-modal-info-status-bar')).toEqual(true);
  });

  it('should display proper components for success status', () => {
    mockedStores.devicesStore.uploadCustomFields = jest.fn((formData, onFinished) => {
      onFinished(UPLOADING_STATUS.SUCCESS);
    });
    wrapper = mountComponent(props);
    wrapper.find('#devices-custom-fields-choose-file-button').first().simulate('click');
    wrapper.find('#devices-custom-fields-file-input-hidden')
      .simulate('change', { target: { files: ['test'], value: 'test' } });
    expect(wrapper.find('#devices-custom-fields-confirm-button').first().prop('disabled')).toEqual(false);
    wrapper.find('#devices-custom-fields-confirm-button').first().simulate('click');
    expect(wrapper.exists('#devices-custom-fields-modal-info-status-bar')).toEqual(true);
  });

  it('should send analytics upload and failed actions', () => {
    mockedStores.devicesStore.uploadCustomFields = jest.fn((formData, onFinished) => {
      onFinished(UPLOADING_STATUS.ERROR);
    });
    wrapper = mountComponent(props);
    wrapper.find('#devices-custom-fields-choose-file-button').first().simulate('click');
    wrapper.find('#devices-custom-fields-file-input-hidden')
      .simulate('change', { target: { files: ['test'], value: 'test' } });
    expect(wrapper.find('#devices-custom-fields-confirm-button').first().prop('disabled')).toEqual(false);
    wrapper.find('#devices-custom-fields-confirm-button').first().simulate('click');
    expect(wrapper.exists('#devices-custom-fields-modal-info-status-bar')).toEqual(true);
    expect(analyticsHelper.sendAction).toBeCalledWith(OTA_DEVICES_CUSTOM_FAILED);
    expect(analyticsHelper.sendAction).toBeCalledWith(OTA_DEVICES_CUSTOM_UPLOAD);
  });
});
