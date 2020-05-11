import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';
import { ThemeProvider } from 'styled-components';
import theme from '../../../theme';
import stores from '../../../stores';
import Navbar from '..';
import AccountSidebar from '../../AccountSidebar';

function mountNavbar(features, props) {
  if (features) {
    stores.featuresStore.features = features;
  } else {
    stores.featuresStore.features = [];
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

jest.mock('../../../i18n');

describe('<Navbar />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mountNavbar();
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('renders correctly', () => {
    expect(wrapper.find('nav').length).toBe(1);
  });

  it('should display Avatar(account sidebar toggle) if uiUserProfileMenu is set to true', () => {
    expect(wrapper.exists(AccountSidebar)).toEqual(false);
    wrapper.unmount();
    wrapper = mountNavbar(null, { uiUserProfileMenu: true });
    expect(wrapper.exists(AccountSidebar)).toEqual(true);
  });
});
