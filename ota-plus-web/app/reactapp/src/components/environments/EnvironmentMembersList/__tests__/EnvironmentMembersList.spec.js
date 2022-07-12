import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'mobx-react';
import EnvironmentMembersList from '..';
import { ThemeProvider } from 'styled-components';
import theme from '../../../../theme';
import UserStore from '../../../../stores/UserStore';
import { UI_FEATURES } from '../../../../config';

const ENV_INFO = {
  name: 'ENV_1',
  namespace: 'dummynamespace',
  creatorEmail: 'owneremail',
  isInitial: false
};

const MEMBERS = [
  {
    email: 'member1email',
    addedAt: '2020-03-24T11:06:32Z'
  },
  {
    email: 'owneremail',
    addedAt: '2020-03-24T11:22:32Z'
  },
  {
    email: 'member2email',
    addedAt: '2020-03-24T11:34:32Z'
  },
];

const user = { email: 'member1email' };

const USER_UI_FEATURES = [
  {
    id: UI_FEATURES.REMOVE_MEMBER,
    isAllowed: true
  },
  {
    id: UI_FEATURES.MANAGE_FEATURE_ACCESS,
    isAllowed: true
  }
];

const CURRENT_ENV_UI_FEATURES = {
  member1email: USER_UI_FEATURES
};

const mockedStores = {
  userStore: new UserStore(),
};

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: key => key.toUpperCase()
  }),
  withTranslation: () => y => y,
  initReactI18next: () => {}
}));

function mountComponent(props, stores = mockedStores) {
  return mount(
    <Provider stores={stores}>
      <ThemeProvider theme={theme}>
        <EnvironmentMembersList {...props} />
      </ThemeProvider>
    </Provider>
  );
}

describe('<EnvironmentMembersList />', () => {
  let wrapper;

  const mockOnListItemClick = jest.fn();
  const mockOnRemoveBtnClick = jest.fn();
  const props = {
    currentEnvUIFeatures: CURRENT_ENV_UI_FEATURES,
    envInfo: ENV_INFO,
    environmentMembers: MEMBERS,
    onListItemClick: mockOnListItemClick,
    onRemoveBtnClick: mockOnRemoveBtnClick,
    user,
  };

  beforeEach(() => {
    mockedStores.userStore.uiFeatures = USER_UI_FEATURES;
    wrapper = mountComponent(props);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('renders correctly', () => {
    expect(wrapper.find('EnvironmentMembersList')).toHaveLength(1);
    expect(wrapper.exists('#members-list')).toEqual(true);
  });

  it('should call onRemoveBtnClick upon clicking member "Remove" button accordingly', () => {
    const member = MEMBERS[2];
    wrapper.find(`#${member.email}-submenu-toggle`).first().simulate('click');
    wrapper.find(`#${member.email}-remove-btn`).first().simulate('click');
    expect(mockOnRemoveBtnClick).toHaveBeenCalledWith(member.email);
    wrapper.unmount();
    wrapper = mountComponent(props);
    wrapper.find(`#${user.email}-submenu-toggle`).first().simulate('click');
    wrapper.find(`#${user.email}-remove-btn`).first().simulate('click');
    expect(mockOnRemoveBtnClick).toHaveBeenCalledWith(false);
  });

  it('should render correct tag', () => {
    expect(wrapper.find('#owneremail').exists('#creator-tag')).toEqual(true);
    expect(wrapper.find('#owneremail').exists('#owner-tag')).toEqual(false);
    expect(wrapper.find('#member2email').exists('#creator-tag')).toEqual(false);
    expect(wrapper.find('#member2email').exists('#owner-tag')).toEqual(false);
    wrapper.unmount();
    ENV_INFO.isInitial = true;
    wrapper = mountComponent(props);
    expect(wrapper.find('#owneremail').exists('#creator-tag')).toEqual(false);
    expect(wrapper.find('#owneremail').exists('#owner-tag')).toEqual(true);
    expect(wrapper.find('#member2email').exists('#creator-tag')).toEqual(false);
    expect(wrapper.find('#member2email').exists('#owner-tag')).toEqual(false);
  });
});
