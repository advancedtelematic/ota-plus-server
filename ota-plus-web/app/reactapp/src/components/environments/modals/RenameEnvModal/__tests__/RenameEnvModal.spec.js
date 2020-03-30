import React from 'react';
import { mount } from 'enzyme';
import RenameEnvModal from '..';
import { ThemeProvider } from 'styled-components';
import theme from '../../../../../theme';

function mountComponent(props) {
  return mount(
    <ThemeProvider theme={theme}>
      <RenameEnvModal {...props} />
    </ThemeProvider>
  );
}

describe('<RenameEnvModal />', () => {
  let wrapper;
  const onConfirmMock = jest.fn();
  const eventValid = {
    target: {
      value: 'New-env-name'
    }
  };

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
    expect(wrapper.find('RenameEnvModal')).toHaveLength(1);
  });

  it('should validate input', () => {
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
    expect(wrapper.find('input').props().value).toBe('New-env-name');
    expect(wrapper.exists('#error-msg')).toEqual(false);

    wrapper.find('input').simulate('change', eventTooLong);
    expect(wrapper.exists('#error-msg')).toEqual(true);

    wrapper.find('input').simulate('change', eventForbiddenChars);
    expect(wrapper.exists('#error-msg')).toEqual(true);
  });

  it('should call onConfirm on "Confirm" button click', () => {
    wrapper.find('input').simulate('change', eventValid);
    wrapper.find('#confirm-btn').first().simulate('click');
    expect(onConfirmMock).toHaveBeenCalledWith(eventValid.target.value);
  });
});
