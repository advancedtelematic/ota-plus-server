import React from 'react';
import { Provider } from 'mobx-react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import UserStore from '../../../../../stores/UserStore';
import theme from '../../../../../theme';
import BuildTeam from '..';
import * as analyticsHelper from '../../../../../helpers/analyticsHelper';
import { OTA_HOME_ADD_MEMBERS } from '../../../../../constants/analyticsActions';

const mockedStores = {
  userStore: new UserStore(),
};

function mountComponent(stores = mockedStores) {
  return mount(
    <Provider stores={stores}>
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <BuildTeam />
        </ThemeProvider>
      </MemoryRouter>
    </Provider>
  );
}

jest.mock('../../../../../i18n');

describe('<BuildTeam />', () => {
  let wrapper;

  const mockGetOrganizationUsers = jest.fn();

  beforeEach(() => {
    mockedStores.userStore.getOrganizationUsers = mockGetOrganizationUsers;
    wrapper = mountComponent();
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('renders correctly', () => {
    expect(wrapper.find('BuildTeam')).toHaveLength(1);
  });

  it('should contain Add Member button', () => {
    expect(wrapper.exists('#build-team-add-btn')).toEqual(true);
  });

  it('should call sendAction upon clicking "Add Member" button', () => {
    analyticsHelper.sendAction = jest.fn();
    wrapper.find('#build-team-add-btn').first().simulate('click');
    expect(analyticsHelper.sendAction).toBeCalledWith(OTA_HOME_ADD_MEMBERS);
  });

  it('should fetch default environment members upon clicking "Add Member" button', () => {
    wrapper.find('#build-team-add-btn').first().simulate('click');
    expect(mockGetOrganizationUsers).toHaveBeenCalled();
  });
});
