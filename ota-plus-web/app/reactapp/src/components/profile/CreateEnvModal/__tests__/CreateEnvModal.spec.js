import React from 'react';
import { mount } from 'enzyme';
import CreateEnvModal from '..';
import { ThemeProvider } from 'styled-components';
import theme from '../../../../theme';

function mountComponent(props) {
  return mount(
    <ThemeProvider theme={theme}>
      <CreateEnvModal {...props} />
    </ThemeProvider>
  );
}

describe('<CreateEnvModal />', () => {
  let wrapper;
  const onConfirmMock = jest.fn();

  beforeEach(() => {
    const props = {
      onClose: () => {},
      onConfirm: onConfirmMock
    };
    wrapper = mountComponent(props);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('renders correctly', () => {
    expect(wrapper.find('CreateEnvModal')).toHaveLength(1);
  });

  it('should validate input', () => {
    const eventValid = {
      target: {
        value: 'New env name'
      }
    };
    const eventTooLong = {
      target: {
        value: 'Too long long long long long new env name'
      }
    };
    const eventForbiddenChars = {
      target: {
        value: 'New+ env& name',
      }
    };
    wrapper.find('input').simulate('change', eventValid);
    expect(wrapper.find('input').props().value).toBe('New env name');
    expect(wrapper.exists('#error-msg')).toEqual(false);

    wrapper.find('input').simulate('change', eventTooLong);
    expect(wrapper.exists('#error-msg')).toEqual(true);

    wrapper.find('input').simulate('change', eventForbiddenChars);
    expect(wrapper.exists('#error-msg')).toEqual(true);
  });

  it('should call onConfirm on Create button click', () => {
    wrapper.find('#create-btn').find('button').props().onClick();
    expect(onConfirmMock).toHaveBeenCalled();
  });
});
