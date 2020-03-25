import React from 'react';
import { mount } from 'enzyme';
import WarningModal from '..';
import { ThemeProvider } from 'styled-components';
import theme from '../../../../../theme';
import { WARNING_MODAL_COLOR } from '../../../../../constants';

function mountComponent(props) {
  return mount(
    <ThemeProvider theme={theme}>
      <WarningModal {...props} />
    </ThemeProvider>
  );
}

describe('<WarningModal />', () => {
  let wrapper;

  beforeEach(() => {
    const props = {
      type: WARNING_MODAL_COLOR.DANGER,
      title: 'Title',
      desc: 'Description',
      cancelButtonProps: {
        title: 'Cancel'
      },
      confirmButtonProps: {
        title: 'Confirm',
        onClick: () => ({})
      },
      onClose: () => ({})
    };
    wrapper = mountComponent(props);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('renders correctly', () => {
    expect(wrapper.find('WarningModal')).toHaveLength(1);
  });
});
