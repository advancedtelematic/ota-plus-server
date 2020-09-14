import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';
import { ThemeProvider } from 'styled-components';
import theme from '../../../theme';
import stores from '../../../stores';
import AccountSidebar from '..';
import { LinkContent, Signout } from '../styled';
import { FEATURES } from '../../../config';

function mountComponent(features, props) {
  if (features) {
    stores.featuresStore.features = features;
  }
  stores.userStore.user.fullName = 'Hunter Newton';
  return mount(
    <MemoryRouter>
      <Provider stores={stores}>
        <ThemeProvider theme={theme}>
          <AccountSidebar {...props} />
        </ThemeProvider>
      </Provider>
    </MemoryRouter>
  );
}

jest.mock('../../../i18n');

describe('<AccountSidebar />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mountComponent();
  });

  it('renders correctly', () => {
    expect(wrapper.exists('#sidebar-avatar')).toEqual(true);
  });

  it('should display correct initials', () => {
    expect(wrapper.text()).toEqual('HN');
  });

  it('should display Account Sidebar when avatar is clicked', () => {
    expect(wrapper.exists('.ant-drawer-open')).toEqual(false);
    wrapper.find('#sidebar-avatar').first().simulate('click');
    expect(wrapper.exists('.ant-drawer-open')).toEqual(true);
  });

  it('should close Account Sidebar when user clicks elsewhere', () => {
    wrapper.find('#sidebar-avatar').first().simulate('click');
    expect(wrapper.exists('.ant-drawer-open')).toEqual(true);
    // Sidebar should close when user clicks anywhere on sidebar mask (navbar buttons are also affected)
    wrapper.find('.ant-drawer-mask').first().simulate('click');
    expect(wrapper.exists('.ant-drawer-open')).toEqual(false);
  });

  it('should display 2 links, sign-out link by default and without usage link', () => {
    const linksCount = 2;
    wrapper.find('#sidebar-avatar').first().simulate('click');
    expect(wrapper.find(LinkContent).length).toBe(linksCount);
    expect(wrapper.find(Signout).length).toBe(1);
    expect(wrapper.exists('#account-sidebar-link-usage')).toEqual(false);
  });

  it('should display 3 links, sign-out link by default and usage link', () => {
    wrapper = mountComponent([FEATURES.USAGE]);
    const linksCount = 3;
    wrapper.find('#sidebar-avatar').first().simulate('click');
    expect(wrapper.find(LinkContent).length).toBe(linksCount);
    expect(wrapper.find(Signout).length).toBe(1);
    expect(wrapper.exists('#account-sidebar-link-usage')).toEqual(true);
  });
});
