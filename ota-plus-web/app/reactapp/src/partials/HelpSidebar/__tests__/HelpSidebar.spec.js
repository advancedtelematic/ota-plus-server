import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';
import { ThemeProvider } from 'styled-components';
import theme from '../../../theme';
import stores from '../../../stores';
import HelpSidebar from '..';
import * as analyticsHelper from '../../../helpers/analyticsHelper';
import { OTA_NAV_API_GUIDE } from '../../../constants/analyticsActions';

function mountComponent(props) {
  return mount(
    <MemoryRouter>
      <Provider stores={stores}>
        <ThemeProvider theme={theme}>
          <HelpSidebar {...props} />
        </ThemeProvider>
      </Provider>
    </MemoryRouter>
  );
}

jest.mock('../../../i18n');

describe('<HelpSidebar />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mountComponent();
  });

  it('renders correctly', () => {
    expect(wrapper.exists('#help-icon')).toEqual(true);
  });

  it('should display Help Sidebar when help icon is clicked', () => {
    expect(wrapper.exists('.ant-drawer-open')).toEqual(false);
    wrapper.find('#help-icon').first().simulate('click');
    expect(wrapper.exists('.ant-drawer-open')).toEqual(true);
  });

  it('should close Help Sidebar when user clicks elsewhere', () => {
    wrapper.find('#help-icon').first().simulate('click');
    expect(wrapper.exists('.ant-drawer-open')).toEqual(true);
    // Sidebar should close when user clicks anywhere on sidebar mask (navbar buttons are also affected)
    wrapper.find('.ant-drawer-mask').first().simulate('click');
    expect(wrapper.exists('.ant-drawer-open')).toEqual(false);
  });

  it('should display 6 links', () => {
    const linksCount = 6;
    wrapper.find('#help-icon').first().simulate('click');
    expect(wrapper.find('a').length).toBe(linksCount);
  });

  it('should open each link in new tab', () => {
    wrapper.find('#help-icon').first().simulate('click');
    wrapper.find('a').forEach((node) => {
      expect(node.props().target).toEqual('_blank');
    });
  });

  it('should call analytics action', () => {
    analyticsHelper.sendAction = jest.fn();
    wrapper.find('#help-icon').first().simulate('click');
    wrapper.find('#help-sidebar-beta-icon-api-guide').first().simulate('click');
    expect(analyticsHelper.sendAction).toBeCalledWith(OTA_NAV_API_GUIDE);
  });
});
