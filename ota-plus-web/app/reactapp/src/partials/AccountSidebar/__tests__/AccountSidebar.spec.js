import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';
import { ThemeProvider } from 'styled-components';
import theme from '../../../theme';
import stores from '../../../stores';
import AccountSidebar from '..';
import { LinkContent, Signout } from '../styled';

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

  it('should display 5 links and sign-out link by default', () => {
    const linksCount = 5;
    wrapper.find('#sidebar-avatar').first().simulate('click');
    expect(wrapper.find(LinkContent).length).toBe(linksCount);
    expect(wrapper.find(Signout).length).toBe(1);
  });
});
