import React from 'react';
import { mount } from 'enzyme';
import { ThemeProvider } from 'styled-components';
import theme from '../../../../../theme';
import DocsLinks from '../index';
import * as analyticsHelper from '../../../../../helpers/analyticsHelper';
import {
  OTA_HOME_READ_CAMPAIGN_EXAMPLES,
  OTA_HOME_READ_GROUP_EXAMPLES,
  OTA_HOME_READ_TROUBLESHOOT_EXAMPLES,
  OTA_HOME_READ_UPDATE_EXAMPLES
} from '../../../../../constants/analyticsActions';

function mountDocsLinks(props) {
  return mount(
    <ThemeProvider theme={theme}>
      <DocsLinks {...props} />
    </ThemeProvider>
  );
}

const EXTERNAL_LINK_COUNT = 4;

describe('<DocsLinks />', () => {
  let wrapper;

  beforeEach(() => {
    const props = {
      url: URL
    };
    wrapper = mountDocsLinks(props);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('should mount', () => {
    expect(wrapper.find('DocsLinks')).toHaveLength(1);
  });

  it('should have device groups tag', () => {
    expect(wrapper.exists('#docs-links-link-device-groups')).toEqual(true);
  });

  it('should have update software tag', () => {
    expect(wrapper.exists('#docs-links-link-update-software')).toEqual(true);
  });

  it('should have create campaigns tag', () => {
    expect(wrapper.exists('#docs-links-link-create-campaigns')).toEqual(true);
  });

  it('should have troubleshoot campaigns tag', () => {
    expect(wrapper.exists('#docs-links-link-troubleshoot-campaigns')).toEqual(true);
  });

  it('should have proper ExternalLink count', () => {
    expect(wrapper.find('ExternalLink')).toHaveLength(EXTERNAL_LINK_COUNT);
  });

  it('should call sendAction', () => {
    analyticsHelper.sendAction = jest.fn();
    wrapper.find('ExternalLink').forEach((node) => {
      node.simulate('click');
    });
    expect(analyticsHelper.sendAction).toBeCalledWith(OTA_HOME_READ_CAMPAIGN_EXAMPLES);
    expect(analyticsHelper.sendAction).toBeCalledWith(OTA_HOME_READ_GROUP_EXAMPLES);
    expect(analyticsHelper.sendAction).toBeCalledWith(OTA_HOME_READ_TROUBLESHOOT_EXAMPLES);
    expect(analyticsHelper.sendAction).toBeCalledWith(OTA_HOME_READ_UPDATE_EXAMPLES);
    expect(analyticsHelper.sendAction).toHaveBeenCalledTimes(EXTERNAL_LINK_COUNT);
  });

  it('should open each link in new tab', () => {
    wrapper.find('a').forEach((node) => {
      expect(node.props().target).toEqual('_blank');
    });
  });
});
