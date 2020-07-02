import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';
import { ThemeProvider } from 'styled-components';
import theme from '../../../../../theme';
import stores from '../../../../../stores';
import DashboardStepper, { getStepStatus, calcStepIconStatus } from '..';
import { STEP_STATUS, ANT_STEP_STATUS } from '../../../../../constants';

function mountComponent(props) {
  return mount(
    <MemoryRouter>
      <Provider stores={stores}>
        <ThemeProvider theme={theme}>
          <DashboardStepper {...props} />
        </ThemeProvider>
      </Provider>
    </MemoryRouter>
  );
}

jest.mock('../../../../../i18n');

describe('<DashboardStepper />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mountComponent();
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('renders correctly', () => {
    expect(wrapper.find('DashboardStepper')).toHaveLength(1);
  });

  it('should calculate step status correctly', () => {
    expect(getStepStatus(false, false)).toBe(STEP_STATUS.INACTIVE);
    expect(getStepStatus(false, true)).toBe(STEP_STATUS.DONE);
    expect(getStepStatus(true, false)).toBe(STEP_STATUS.ACTIVE);
    expect(getStepStatus(true, true)).toBe(STEP_STATUS.DONE);
  });

  it('should pick step icon correctly', () => {
    expect(calcStepIconStatus(STEP_STATUS.INACTIVE)).toBe(ANT_STEP_STATUS.WAIT);
    expect(calcStepIconStatus(STEP_STATUS.ACTIVE)).toBe(ANT_STEP_STATUS.PROCESS);
    expect(calcStepIconStatus(STEP_STATUS.DONE)).toBe(ANT_STEP_STATUS.DONE);
  });
});
