import React from 'react';
import { mount } from 'enzyme';
import AddMemberModal from '..';
import { ThemeProvider } from 'styled-components';
import theme from '../../../../../theme';

function mountComponent(props) {
  return mount(
    <ThemeProvider theme={theme}>
      <AddMemberModal {...props} />
    </ThemeProvider>
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
