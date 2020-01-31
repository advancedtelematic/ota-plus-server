import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';
import { ThemeProvider } from 'styled-components';
import * as analyticsHelper from '../../../../../../helpers/analyticsHelper';
import theme from '../../../../../../theme';
import stores from '../../../../../../stores';
import DashboardStepperCard from '..';
import { ICON_PATHS } from '../../../../../../config';
import { STEP_STATUS } from '../../../../../../constants';

function mountComponent(props) {
  return mount(
    <MemoryRouter>
      <Provider stores={stores}>
        <ThemeProvider theme={theme}>
          <DashboardStepperCard {...props} />
        </ThemeProvider>
      </Provider>
    </MemoryRouter>
  );
}

const generateCardProps = status => ({
  id: 'deviceGroup-card',
  buttonTitle: 'Create group',
  description: 'Dummy desc',
  iconPath: ICON_PATHS[2],
  statValue: 20,
  status,
  title: 'Device group',
  links: {
    ctaButton: '/devices',
    ctaLink: '/devices',
    docs: 'https://here.com/',
    ctaButtonActionType: 'CTAButtonActionType',
    ctaLinkActionType: 'CTALinkActionType',
    docsActionType: 'DOCSActionType'
  },
});

describe('<DashboardStepperCard />', () => {
  let wrapper;

  afterEach(() => {
    wrapper.unmount();
  });

  it('renders correctly', () => {
    wrapper = mountComponent(generateCardProps(STEP_STATUS.DONE));
    expect(wrapper.find('DashboardStepperCard')).toHaveLength(1);
  });

  it('should open docs in new tab upon clicking "read more"', () => {
    wrapper = mountComponent(generateCardProps(STEP_STATUS.ACTIVE));
    expect(wrapper.find('#deviceGroup-card-desc').find('a').props().target).toEqual('_blank');
  });

  it('should call sendAction upon clicking "read more"', () => {
    analyticsHelper.sendAction = jest.fn();
    wrapper = mountComponent(generateCardProps(STEP_STATUS.ACTIVE));
    wrapper.find('#deviceGroup-card-desc').find('a').simulate('click');
    expect(analyticsHelper.sendAction).toBeCalledWith('DOCSActionType');
  });

  it('should call sendAction upon clicking CTA button', () => {
    analyticsHelper.sendAction = jest.fn();
    wrapper = mountComponent(generateCardProps(STEP_STATUS.DONE));
    wrapper.find('#deviceGroup-card-action-btn').first().simulate('click');
    expect(analyticsHelper.sendAction).toBeCalledWith('CTAButtonActionType');
  });
});
