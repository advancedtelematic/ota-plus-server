import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'mobx-react';
import { ThemeProvider } from 'styled-components';
import EnvironmentDetails from '..';
import theme from '../../../../theme';
import UserStore from '../../../../stores/UserStore';
import * as analyticsHelper from '../../../../helpers/analyticsHelper';
import {
  OTA_ENVIRONMENT_ADD_MEMBER,
  OTA_ENVIRONMENT_RENAME,
} from '../../../../constants/analyticsActions';

const ENV_MEMBERS = [
  { email: 'owneremail', addedAt: '2020-03-23T08:29:56Z' },
  { email: 'memberemail', addedAt: '2020-03-24T13:52:22Z' }
];
const ENV_INFO = {
  namespace: 'NAMESPACE_1',
  name: 'env-1',
  isInitial: false,
  createdBy: 'HERE-fd-tr-er-8c19-ds',
  createdAt: '2020-03-23T08:29:55Z',
  creatorEmail: 'owneremail'
};
const USER = {
  email: 'owneremail',
  profile: {
    initialNamespace: 'NAMESPACE_1',
    defaultNamespace: 'NAMESPACE_1',
    email: 'owneremail'
  }
};

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: key => key.toUpperCase()
  }),
  withTranslation: () => y => y,
  initReactI18next: () => {}
}));

const mockedStores = {
  userStore: new UserStore(),
};

function mountComponent(stores = mockedStores) {
  return mount(
    <Provider stores={stores}>
      <ThemeProvider theme={theme}>
        <EnvironmentDetails />
      </ThemeProvider>
    </Provider>
  );
}

describe('<EnvironmentDetails />', () => {
  let wrapper;

  analyticsHelper.sendAction = jest.fn();

  const mockDeleteMemberFromOrganization = jest.fn();
  const mockEditOrganizationName = jest.fn();
  const mockAddUserToOrganization = jest.fn();

  beforeEach(() => {
    window.location.replace = jest.fn();
    mockedStores.userStore.currentOrganization = ENV_INFO;
    mockedStores.userStore.userOrganizationUsers = ENV_MEMBERS;
    mockedStores.userStore.user = USER;
    mockedStores.userStore.deleteMemberFromOrganization = mockDeleteMemberFromOrganization;
    mockedStores.userStore.editOrganizationName = mockEditOrganizationName;
    mockedStores.userStore.addUserToOrganization = mockAddUserToOrganization;
    wrapper = mountComponent();
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('renders correctly', () => {
    expect(wrapper.find('EnvironmentDetails')).toHaveLength(1);
  });

  it('should display "Add member" modal upon clicking corresponding button', () => {
    expect(wrapper.exists('#add-member-modal')).toEqual(false);
    wrapper.find('#btn-add-member').first().simulate('click');
    expect(wrapper.exists('#add-member-modal')).toEqual(true);
    wrapper.find('#cancel-btn').first().simulate('click');
    expect(wrapper.exists('#add-member-modal')).toEqual(false);
  });

  it('should display "Rename env" modal upon clicking corresponding button', () => {
    expect(wrapper.exists('#rename-env-modal')).toEqual(false);
    wrapper.find('#btn-rename-env').first().simulate('click');
    expect(wrapper.exists('#rename-env-modal')).toEqual(true);
    wrapper.find('#cancel-btn').first().simulate('click');
    expect(wrapper.exists('#rename-env-modal')).toEqual(false);
  });

  it('should display "Remove member" modal upon clicking corresponding button', () => {
    expect(wrapper.exists('#warning-modal')).toEqual(false);
    wrapper.find('#memberemail-remove-btn').first().simulate('click');
    expect(wrapper.exists('#warning-modal')).toEqual(true);
    wrapper.find('#cancel-btn').first().simulate('click');
    expect(wrapper.exists('#warning-modal')).toEqual(false);
  });

  it('should handle member removal', () => {
    // Remove member
    wrapper.find('#memberemail-remove-btn').first().simulate('click');
    wrapper.find('#confirm-btn').first().simulate('click');
    expect(mockDeleteMemberFromOrganization).toHaveBeenCalledWith('memberemail', true);
    expect(wrapper.exists('#warning-modal')).toEqual(false);

    // Leave environment
    wrapper.find('#owneremail-remove-btn').first().simulate('click');
    wrapper.find('#confirm-btn').first().simulate('click');
    expect(mockDeleteMemberFromOrganization).toHaveBeenCalledWith('owneremail', false);
    expect(wrapper.exists('#warning-modal')).toEqual(false);
  });

  it('should handle rename env action', () => {
    wrapper.find('#btn-rename-env').first().simulate('click');
    wrapper.find('input').simulate('change', { target: { value: 'New-env-name' } });
    wrapper.find('#confirm-btn').first().simulate('click');
    expect(mockEditOrganizationName).toHaveBeenCalledWith('New-env-name', ENV_INFO.namespace);
    expect(analyticsHelper.sendAction).toHaveBeenCalledWith(OTA_ENVIRONMENT_RENAME);
    expect(wrapper.exists('#rename-env-modal')).toEqual(false);
  });

  it('should handle add member action', () => {
    wrapper.find('#btn-add-member').first().simulate('click');
    wrapper.find('input').simulate('change', { target: { value: 'dummy@here.com' } });
    wrapper.find('#confirm-btn').first().simulate('click');
    expect(mockAddUserToOrganization).toHaveBeenCalledWith('dummy@here.com', ENV_INFO.namespace);
    expect(analyticsHelper.sendAction).toHaveBeenCalledWith(OTA_ENVIRONMENT_ADD_MEMBER);
    expect(wrapper.exists('#add-member-modal')).toEqual(false);
  });

  it('should reset adding member value', () => {
    mockedStores.userStore.environmentsAddMember = true;
    wrapper = mountComponent();
    expect(mockedStores.userStore.environmentsAddMember).toEqual(false);
  });
});
