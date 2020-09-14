import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'mobx-react';
import AddMemberModal from '..';
import { ThemeProvider } from 'styled-components';
import UserStore from '../../../../../stores/UserStore';
import theme from '../../../../../theme';

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

const mockedStores = {
  userStore: new UserStore(),
};

function mountComponent(props, stores = mockedStores) {
  return mount(
    <Provider stores={stores}>
      <ThemeProvider theme={theme}>
        <AddMemberModal {...props} />
      </ThemeProvider>
    </Provider>
  );
}

describe('<AddMemberModal />', () => {
  let wrapper;
  const onConfirmMock = jest.fn();
  const eventValid = {
    target: {
      value: 'dummy01@here.com'
    }
  };

  beforeEach(() => {
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => setTimeout(cb, 200));
    const props = {
      onClose: () => {},
      onConfirm: onConfirmMock
    };
    mockedStores.userStore.currentOrganization = ENV_INFO;
    mockedStores.userStore.userOrganizationUsers = ENV_MEMBERS;
    mockedStores.userStore.user = USER;
    wrapper = mountComponent(props);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('renders correctly', () => {
    expect(wrapper.find('AddMemberModal')).toHaveLength(1);
  });

  it('should validate input', () => {
    const eventInvalid = {
      target: {
        value: 'dummy01'
      }
    };
    wrapper.find('input').simulate('change', eventValid);
    expect(wrapper.find('input').props().value).toBe('dummy01@here.com');
    expect(wrapper.exists('#error-msg')).toEqual(false);

    wrapper.find('input').simulate('change', eventInvalid);
    expect(wrapper.exists('#error-msg')).toEqual(true);
  });

  it('should call onConfirm on Add button click', () => {
    wrapper.find('input').simulate('change', eventValid);
    wrapper.find('#confirm-btn').first().simulate('click');
    expect(onConfirmMock).toHaveBeenCalledWith(eventValid.target.value);
  });
});
