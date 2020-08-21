import React from 'react';
import { mount } from 'enzyme';
import EnvironmentsHeader from '..';
import { ThemeProvider } from 'styled-components';
import theme from '../../../../theme';

function mountComponent(props) {
  return mount(
    <ThemeProvider theme={theme}>
      <EnvironmentsHeader {...props} />
    </ThemeProvider>
  );
}

describe('<EnvironmentsHeader />', () => {
  let wrapper;

  beforeEach(() => {
    const props = {
      homeEnvName: 'Test environment',
      onCreateEnvBtnClick: () => {},
      onHomeEnvClick: () => {}
    };
    wrapper = mountComponent(props);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('renders correctly', () => {
    expect(wrapper.find('EnvironmentsHeader')).toHaveLength(1);
    expect(wrapper.exists('#home-env-link')).toEqual(true);
    expect(wrapper.exists('#button-create-env')).toEqual(true);
    expect(wrapper.exists('#profile-organization-header-description')).toEqual(true);
    expect(wrapper.exists('#profile-organization-header-link')).toEqual(true);
  });
});
