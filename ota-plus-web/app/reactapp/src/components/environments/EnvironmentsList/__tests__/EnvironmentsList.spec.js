import React from 'react';
import { mount } from 'enzyme';
import EnvironmentsList from '..';
import { ThemeProvider } from 'styled-components';
import theme from '../../../../theme';

const DATA_SOURCE = [
  {
    name: 'testName',
    namespace: 'dummynamespace',
    memberCount: 5,
    createdAt: '2020-03-24T11:06:32Z',
  }
];

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: key => key.toUpperCase()
  }),
  initReactI18next: () => {}
}));

function mountComponent(props) {
  return mount(
    <ThemeProvider theme={theme}>
      <EnvironmentsList {...props} />
    </ThemeProvider>
  );
}

describe('<EnvironmentsList />', () => {
  let wrapper;
  const onListItemClick = jest.fn();

  beforeEach(() => {
    const props = {
      dataSource: DATA_SOURCE,
      onListItemClick
    };
    wrapper = mountComponent(props);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('renders correctly', () => {
    expect(wrapper.find('EnvironmentsList')).toHaveLength(1);
  });

  it('should call onListItemClick on row click', () => {
    const testEntryNamespace = DATA_SOURCE[0].namespace;
    wrapper.find(`#${testEntryNamespace}`).first().simulate('click');
    expect(onListItemClick).toHaveBeenCalledTimes(1);
    expect(onListItemClick).toBeCalledWith(testEntryNamespace);
  });
});
