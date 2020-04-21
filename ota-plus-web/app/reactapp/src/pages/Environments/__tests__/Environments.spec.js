import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'mobx-react';
import { ThemeProvider } from 'styled-components';
import Environments from '..';
import theme from '../../../theme';
import UserStore from '../../../stores/UserStore';

const ENVIRONMENTS = [{ name: 'ENV_1', namespace: 'NAMESPACE_1' }, { name: 'ENV_2', namespace: 'NAMESPACE_2' }];
const USER_ENVIRONMENT_NAMESPACE = 'NAMESPACE_1';
const USER_PROFILE = {
  initialNamespace: 'NAMESPACE_1',
  defaultNamespace: 'NAMESPACE_1',
  email: 'dummyemail@gmail.com'
};

jest.mock('../../../components/environments/EnvironmentDetails', () => () => <div id="details">Details</div>);

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
        <Environments />
      </ThemeProvider>
    </Provider>
  );
}

describe('<Environments />', () => {
  let wrapper;

  const mockCreateEnv = jest.fn();
  const mockGetOrganizations = jest.fn();
  const mockGetOrganizationUsers = jest.fn();

  beforeEach(() => {
    mockedStores.userStore.userOrganizationNamespace = USER_ENVIRONMENT_NAMESPACE;
    mockedStores.userStore.userOrganizations = ENVIRONMENTS;
    mockedStores.userStore.maxEnvReached = false;
    mockedStores.userStore.user.profile = USER_PROFILE;
    mockedStores.userStore.showEnvDetails = false;
    mockedStores.userStore.createEnvironment = mockCreateEnv;
    mockedStores.userStore.getOrganizations = mockGetOrganizations;
    mockedStores.userStore.getOrganizationUsers = mockGetOrganizationUsers;
    wrapper = mountComponent();
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('renders correctly', () => {
    expect(wrapper.find('Environments')).toHaveLength(1);
  });

  it('should fetch organizations info on mount', () => {
    expect(mockGetOrganizations).toHaveBeenCalled();
  });

  it('should display env details on env list row click', () => {
    wrapper.find(`#${USER_ENVIRONMENT_NAMESPACE}`).first().simulate('click');
    expect(mockGetOrganizationUsers).toHaveBeenCalled();
    expect(mockGetOrganizationUsers).toHaveBeenCalledWith(USER_ENVIRONMENT_NAMESPACE);
    expect(mockedStores.userStore.showEnvDetails).toEqual(true);
  });

  it('should display env details upon clicking header home env link', () => {
    expect(mockedStores.userStore.showEnvDetails).toEqual(false);
    wrapper.find('#home-env-link').first().simulate('click');
    expect(mockGetOrganizationUsers).toHaveBeenCalled();
    expect(mockGetOrganizationUsers).toHaveBeenCalledWith(USER_ENVIRONMENT_NAMESPACE);
    expect(mockedStores.userStore.showEnvDetails).toEqual(true);
  });

  it('should display warning modal when max env limit is reached', () => {
    expect(wrapper.exists('#max-env-modal')).toEqual(false);
    wrapper.unmount();
    mockedStores.userStore.maxEnvReached = true;
    wrapper = mountComponent();
    expect(wrapper.exists('#max-env-modal')).toEqual(true);
  });

  it('should allow user to close max env limit warning modal', () => {
    wrapper.unmount();
    mockedStores.userStore.maxEnvReached = true;
    wrapper = mountComponent();
    wrapper.find('#cancel-btn').first().simulate('click');
    expect(mockedStores.userStore.maxEnvReached).toEqual(false);
  });

  it('should handle create environment action', () => {
    expect(wrapper.exists('#create-env-modal')).toEqual(false);
    wrapper.find('#button-create-env').first().simulate('click');
    expect(wrapper.exists('#create-env-modal')).toEqual(true);
    const newEnvName = 'Test-env';
    wrapper.find('#name-input').find('input').simulate('change', { target: { value: newEnvName } });
    wrapper.find('#create-btn').first().simulate('click');
    expect(mockCreateEnv).toHaveBeenCalledWith(newEnvName);
    expect(wrapper.exists('#create-env-modal')).toEqual(false);
  });

  it('should reset create environment value', () => {
    mockedStores.userStore.environmentsCreateEnvironment = true;
    wrapper = mountComponent();
    expect(mockedStores.userStore.environmentsCreateEnvironment).toEqual(false);
  });
});
