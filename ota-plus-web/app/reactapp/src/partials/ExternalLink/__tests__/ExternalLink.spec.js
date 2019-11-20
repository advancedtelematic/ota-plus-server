import React from 'react';
import { mount } from 'enzyme';
import ExternalLink from '..';
import { ThemeProvider } from 'styled-components';
import theme from '../../../theme';

function mountExternalLink(props) {
  return mount(
    <ThemeProvider theme={theme}>
      <ExternalLink {...props} />
    </ThemeProvider>
  );
}

const URL = 'https://here.com/';

describe('<ExternalLink />', () => {
  let wrapper;

  beforeEach(() => {
    const props = {
      url: URL
    };
    wrapper = mountExternalLink(props);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('should mount', () => {
    expect(wrapper.find('ExternalLink')).toHaveLength(1);
  });

  it('should have href', () => {
    expect(wrapper.find(`[href="${URL}"]`).length).toBe(1);
  });
});
