import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import theme from '../../../../../theme';
import BuildTeam from '..';
import * as analyticsHelper from '../../../../../helpers/analyticsHelper';
import {
  OTA_HOME_ADD_MEMBER,
} from '../../../../../constants/analyticsActions';

function mountComponent(props) {
  return mount(
    <MemoryRouter>
      <ThemeProvider theme={theme}>
        <BuildTeam {...props} />
      </ThemeProvider>
    </MemoryRouter>
  );
}

describe('<BuildTeam />', () => {
  let wrapper;

  beforeEach(() => {
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
    expect(analyticsHelper.sendAction).toBeCalledWith(OTA_HOME_ADD_MEMBER);
  });
});
