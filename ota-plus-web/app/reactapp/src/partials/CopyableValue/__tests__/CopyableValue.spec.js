import React from 'react';
import { mount } from 'enzyme';
import { ThemeProvider } from 'styled-components';
import theme from '../../../theme';
import CopyableValue from '../index';
import * as analyticsHelper from '../../../helpers/analyticsHelper';
import { OTA_DEVICE_ID_COPY_TO_CLIPBOARD } from '../../../constants/analyticsActions';

function mountCopyableValue(props) {
  return mount(
    <ThemeProvider theme={theme}>
      <CopyableValue {...props} />
    </ThemeProvider>
  );
}

const VALUE_ID = 'abcdef';

describe('<CopyableValue />', () => {
  let wrapper;
  analyticsHelper.sendAction = jest.fn();
  document.execCommand = jest.fn();
  window.prompt = () => {};

  beforeEach(() => {
    const props = {
      title: 'text',
      value: VALUE_ID
    };
    wrapper = mountCopyableValue(props);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('should mount', () => {
    expect(wrapper.find('CopyableValue')).toHaveLength(1);
  });

  it('should have proper tags', () => {
    expect(wrapper.exists('#copyable-value-container')).toEqual(true);
    expect(wrapper.exists('#copyable-value-title')).toEqual(true);
    expect(wrapper.exists('#copyable-value-value')).toEqual(true);
    expect(wrapper.exists('#copyable-value-icon')).toEqual(true);
  });

  it('should should send analytics action', () => {
    wrapper.find('#copyable-value-icon').first().simulate('click');
    expect(analyticsHelper.sendAction).toBeCalledWith(OTA_DEVICE_ID_COPY_TO_CLIPBOARD);
  });

  it('should copy to clipboard', () => {
    wrapper.find('#copyable-value-icon').first().simulate('click');
    expect(document.execCommand).toHaveBeenCalledWith('copy');
  });
});
