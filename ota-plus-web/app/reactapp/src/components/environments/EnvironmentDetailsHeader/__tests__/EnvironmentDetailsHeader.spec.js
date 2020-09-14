import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'mobx-react';
import EnvironmentDetailsHeader from '..';
import { ThemeProvider } from 'styled-components';
import theme from '../../../../theme';
import UserStore from '../../../../stores/UserStore';
import { UI_FEATURES } from '../../../../config';

const ENV_INFO = {
  createdAt: '2020-03-24T11:06:32Z',
  creatorEmail: 'owneremail',
  name: 'envname',
  namespace: 'envnamespace',
};

const USER_UI_FEATURES = [
  {
    id: UI_FEATURES.RENAME_ENV,
    isAllowed: true
  },
  {
    id: UI_FEATURES.ADD_MEMBER,
    isAllowed: true
  },
];

const mockedStores = {
  userStore: new UserStore(),
};

function mountComponent(props, stores = mockedStores) {
  return mount(
    <Provider stores={stores}>
      <ThemeProvider theme={theme}>
        <EnvironmentDetailsHeader {...props} />
      </ThemeProvider>
    </Provider>
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
    mockedStores.userStore.uiFeatures = USER_UI_FEATURES;
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
