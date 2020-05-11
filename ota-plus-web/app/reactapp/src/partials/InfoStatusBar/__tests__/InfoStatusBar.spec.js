import React from 'react';
import { mount } from 'enzyme';
import { ThemeProvider } from 'styled-components';
import theme from '../../../theme';
import { INFO_STATUS_BAR_TYPE } from '../../../constants';
import { InfoStatusBar } from '..';
import {
  SOFTWARE_ICON_UPLOADING_STATUS_ERROR,
  SOFTWARE_ICON_UPLOADING_STATUS_SUCCESS
} from '../../../config';

const mockedProps = {
  onClose: jest.fn(),
  text: 'text',
  type: INFO_STATUS_BAR_TYPE.SUCCESS
};

function mountInfoStatusBar(props = mockedProps) {
  return mount(
    <ThemeProvider theme={theme}>
      <InfoStatusBar {...props} />
    </ThemeProvider>
  );
}

describe('<InfoStatusBar />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mountInfoStatusBar();
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('should mount', () => {
    expect(wrapper.find('InfoStatusBar')).toHaveLength(1);
  });

  it('should have proper tags', () => {
    expect(wrapper.exists('#info-status-bar-container')).toEqual(true);
    expect(wrapper.exists('#info-status-bar-icon')).toEqual(true);
    expect(wrapper.exists('#info-status-bar-text')).toEqual(true);
    expect(wrapper.exists('#info-status-bar-icon-close')).toEqual(true);
  });

  it('should not have close option', () => {
    wrapper = mountInfoStatusBar({
      onClose: undefined,
      text: 'text',
      type: INFO_STATUS_BAR_TYPE.SUCCESS
    });
    expect(wrapper.exists('#info-status-bar-icon-close')).toEqual(false);
  });

  it('should call close function on click', () => {
    expect(wrapper.exists('#info-status-bar-icon-close')).toEqual(true);
    wrapper.find('#info-status-bar-icon-close').first().simulate('click');
    expect(mockedProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('should have icon success', () => {
    expect(wrapper.find('#info-status-bar-icon').first().prop('src')).toBe(SOFTWARE_ICON_UPLOADING_STATUS_SUCCESS);
  });

  it('should have icon error', () => {
    wrapper = mountInfoStatusBar({
      text: 'text',
      type: INFO_STATUS_BAR_TYPE.ERROR
    });
    expect(wrapper.find('#info-status-bar-icon').first().prop('src')).toBe(SOFTWARE_ICON_UPLOADING_STATUS_ERROR);
  });
});
