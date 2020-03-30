import React from 'react';
import { mount } from 'enzyme';
import EnvironmentMembersList from '..';
import { ThemeProvider } from 'styled-components';
import theme from '../../../../theme';

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

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: key => key.toUpperCase()
  }),
  withTranslation: () => y => y,
  initReactI18next: () => {}
}));

function mountComponent(props) {
  return mount(
    <ThemeProvider theme={theme}>
      <EnvironmentMembersList {...props} />
    </ThemeProvider>
  );
}

describe('<EnvironmentMembersList />', () => {
  let wrapper;

  const mockOnRemoveBtnClick = jest.fn();
  const props = {
    envInfo: ENV_INFO,
    environmentMembers: MEMBERS,
    onRemoveBtnClick: mockOnRemoveBtnClick,
    user,
  };

  beforeEach(() => {
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
    wrapper.find(`#${member.email}-remove-btn`).first().simulate('click');
    expect(mockOnRemoveBtnClick).toHaveBeenCalledWith(member.email);
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
