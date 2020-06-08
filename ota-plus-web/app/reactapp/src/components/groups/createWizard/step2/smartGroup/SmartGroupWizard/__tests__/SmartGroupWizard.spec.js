/* eslint-disable no-param-reassign */
import React from 'react';
import { mount } from 'enzyme';
import SmartGroupWizard from '..';
import { Provider } from 'mobx-react';
import { ThemeProvider } from 'styled-components';
import theme from '../../../../../../../theme';
import DevicesStore from '../../../../../../../stores/DevicesStore';
import GroupsStore from '../../../../../../../stores/GroupsStore';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: key => key.toUpperCase()
  }),
  withTranslation: () => (Component) => {
    Component.defaultProps = { ...Component.defaultProps, t: () => '' };
    return Component;
  },
  initReactI18next: () => {}
}));

const mockedStores = {
  devicesStore: new DevicesStore(),
  groupsStore: new GroupsStore(),
};

function mountComponent(props, stores = mockedStores) {
  return mount(
    <Provider stores={stores}>
      <ThemeProvider theme={theme}>
        <SmartGroupWizard {...props} />
      </ThemeProvider>
    </Provider>
  );
}

describe('<SmartGroupWizard />', () => {
  let wrapper;
  const mockOnStep2DataSelect = jest.fn();

  const props = { onStep2DataSelect: mockOnStep2DataSelect };
  beforeEach(() => {
    wrapper = mountComponent(props);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('renders correctly', () => {
    expect(wrapper.find('SmartGroupWizard')).toHaveLength(1);
  });

  it('should update device group name', () => {
    wrapper.find('#device-group-name').first().simulate('change', { target: { value: 'soft' } });
    expect(wrapper.find('#device-group-name').find('input').props().value).toBe('soft');
    expect(mockOnStep2DataSelect).toHaveBeenCalled();
  });
});
