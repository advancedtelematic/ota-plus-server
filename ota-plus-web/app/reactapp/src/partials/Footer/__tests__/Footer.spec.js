import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount, shallow } from 'enzyme';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'mobx-react';
import theme from '../../../theme';
import { Footer } from '..';
import * as analyticsHelper from '../../../helpers/analyticsHelper';
import {
  OTA_FOOTER_CONTACT,
  OTA_FOOTER_LANGUAGES,
  OTA_FOOTER_PRIVACY,
  OTA_FOOTER_TERMS
} from '../../../constants/analyticsActions';
import { FEATURES } from '../../../config';
import FeaturesStore from '../../../stores/FeaturesStore';

const mockedProps = {
  url: URL
};

const mockedStores = {
  featuresStore: new FeaturesStore(),
};

function mountFooter(stores = mockedStores, props = mockedProps) {
  return mount(
    <Provider stores={stores}>
      <ThemeProvider theme={theme}>
        <Footer {...props} />
      </ThemeProvider>
    </Provider>
  );
}

const EXTERNAL_LINK_COUNT = 3;

jest.mock('../../../i18n');

describe('<Footer />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mountFooter();
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('should mount', () => {
    expect(wrapper.find('Footer')).toHaveLength(1);
  });

  it('should have app footer tag', () => {
    expect(wrapper.exists('#footer-container')).toEqual(true);
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

  it('should render language dropdown menu with one item', () => {
    const dropdown = wrapper.find('#footer-language-dropdown');
    const submenu = mount(<ThemeProvider theme={theme}><div>{dropdown.first().prop('overlay')}</div></ThemeProvider>);
    expect(submenu.exists('#footer-language-menu')).toEqual(true);
    expect(submenu.exists('#footer-language-menu-item-0')).toEqual(true);
    expect(submenu.exists('#footer-language-menu-item-1')).toEqual(false);
  });

  it('should render language dropdown menu with 2 items', () => {
    const stores = {
      featuresStore: new FeaturesStore(),
    };
    stores.featuresStore.features = [FEATURES.PSEUDO_LOCALISATION];
    wrapper = mountFooter(stores);
    const dropdown = wrapper.find('#footer-language-dropdown');
    const submenu = mount(<ThemeProvider theme={theme}><div>{dropdown.first().prop('overlay')}</div></ThemeProvider>);
    expect(submenu.exists('#footer-language-menu')).toEqual(true);
    expect(submenu.exists('#footer-language-menu-item-0')).toEqual(true);
    expect(submenu.exists('#footer-language-menu-item-1')).toEqual(true);
  });

  it('should click on language dropdown menu', () => {
    analyticsHelper.sendAction = jest.fn();
    const dropdown = wrapper.find('#footer-language-dropdown');
    const submenu = shallow(<div>{dropdown.first().prop('overlay')}</div>);
    expect(submenu.exists('#footer-language-menu')).toEqual(true);
    const languageMenu = submenu.find('#footer-language-menu');
    act(() => {
      languageMenu.simulate('click', { key: 0 });
    });
    expect(analyticsHelper.sendAction).toBeCalledWith(OTA_FOOTER_LANGUAGES);
  });
});
