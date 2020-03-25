import React from 'react';
import { mount } from 'enzyme';
import EnvironmentDetailsHeader from '..';
import { ThemeProvider } from 'styled-components';
import theme from '../../../../theme';

const ENV_INFO = {
  createdAt: '2020-03-24T11:06:32Z',
  creatorEmail: 'owneremail',
  name: 'envname',
  namespace: 'envnamespace',
};

function mountComponent(props) {
  return mount(
    <ThemeProvider theme={theme}>
      <EnvironmentDetailsHeader {...props} />
    </ThemeProvider>
  );
}

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: key => key.toUpperCase()
  }),
  withTranslation: () => y => y,
  initReactI18next: () => {}
}));

describe('<EnvironmentDetailsHeader />', () => {
  let wrapper;

  const mockOnAddMemberBtnClick = jest.fn();
  const mockOnRenameBtnClick = jest.fn();

  beforeEach(() => {
    const props = {
      envInfo: ENV_INFO,
      onAddMemberBtnClick: mockOnAddMemberBtnClick,
      onRenameBtnClick: mockOnRenameBtnClick
    };
    wrapper = mountComponent(props);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('renders correctly', () => {
    expect(wrapper.find('EnvironmentDetailsHeader')).toHaveLength(1);
  });

  it('should call onRenameEnvBtnClick upon clicking "Add member" button', () => {
    wrapper.find('#btn-rename-env').first().simulate('click');
    expect(mockOnRenameBtnClick).toHaveBeenCalled();
  });

  it('should call onAddMemberBtnClick upon clicking "Add member" button', () => {
    wrapper.find('#btn-add-member').first().simulate('click');
    expect(mockOnAddMemberBtnClick).toHaveBeenCalled();
  });
});
