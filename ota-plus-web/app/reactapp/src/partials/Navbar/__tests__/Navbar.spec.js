import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';
import { ThemeProvider } from 'styled-components';
import theme from '../../../theme';
import stores from '../../../stores';
import Navbar from '..';
import { Avatar } from '../styled';
import { FEATURES } from '../../../config';

function mountNavbar(features, props) {
  if (features) {
    stores.featuresStore.features = features;
  }
  return mount(
    <MemoryRouter>
      <Provider stores={stores}>
        <ThemeProvider theme={theme}>
          <Navbar {...props} />
        </ThemeProvider>
      </Provider>
    </MemoryRouter>
  );
}

describe('<Navbar />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mountNavbar();
  });

  it('renders correctly', () => {
    expect(wrapper.find('nav').length).toBe(1);
  });

  it('displays Impact tab when feature flag is toggled', () => {
    expect(wrapper.exists('#navbar-link-impact-analysis')).toEqual(false);
    wrapper = mountNavbar([FEATURES.IMPACT_ANALYSIS]);
    expect(wrapper.exists('#navbar-link-impact-analysis')).toEqual(true);
  });

  it('displays Avatar(account settings toggle) if uiUserProfileMenu is set to true', () => {
    expect(wrapper.exists(Avatar)).toEqual(false);
    wrapper = mountNavbar(null, { uiUserProfileMenu: true });
    expect(wrapper.exists(Avatar)).toEqual(true);
  });
});
