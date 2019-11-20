import React from 'react';
import { mount } from 'enzyme';
import { ThemeProvider } from 'styled-components';
import theme from '../../../theme';
import { Footer } from '..';
import * as analyticsHelper from '../../../helpers/analyticsHelper';
import {
  OTA_FOOTER_CONTACT,
  OTA_FOOTER_PRIVACY,
  OTA_FOOTER_TERMS
} from '../../../constants/analyticsActions';

function mountFooter(props) {
  return mount(
    <ThemeProvider theme={theme}>
      <Footer {...props} />
    </ThemeProvider>
  );
}

const EXTERNAL_LINK_COUNT = 3;

describe('<Footer />', () => {
  let wrapper;

  beforeEach(() => {
    const props = {
      url: URL
    };
    wrapper = mountFooter(props);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('should mount', () => {
    expect(wrapper.find('Footer')).toHaveLength(1);
  });

  it('should have app footer tag', () => {
    expect(wrapper.exists('#app-footer')).toEqual(true);
  });

  it('should have proper ExternalLink count', () => {
    expect(wrapper.find('ExternalLink')).toHaveLength(EXTERNAL_LINK_COUNT);
  });

  it('should call sendAction', () => {
    analyticsHelper.sendAction = jest.fn();
    wrapper.find('ExternalLink').forEach((node) => {
      node.simulate('click');
    });
    expect(analyticsHelper.sendAction).toBeCalledWith(OTA_FOOTER_TERMS);
    expect(analyticsHelper.sendAction).toBeCalledWith(OTA_FOOTER_PRIVACY);
    expect(analyticsHelper.sendAction).toBeCalledWith(OTA_FOOTER_CONTACT);
    expect(analyticsHelper.sendAction).toHaveBeenCalledTimes(EXTERNAL_LINK_COUNT);
  });

  it('should open each link in new tab', () => {
    wrapper.find('a').forEach((node) => {
      expect(node.props().target).toEqual('_blank');
    });
  });

  it('should have language tag', () => {
    expect(wrapper.exists('#footer-language-tag')).toEqual(true);
  });

  it('should have Dropdown overlay', () => {
    const dropdownFirst = wrapper.find('Dropdown').first();
    expect(dropdownFirst.props().overlay).toBeDefined();
  });

  it('should have copyright tag', () => {
    expect(wrapper.exists('#footer-copyright-tag')).toEqual(true);
  });
});
