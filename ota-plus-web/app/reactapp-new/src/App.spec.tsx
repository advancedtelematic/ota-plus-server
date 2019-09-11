import React from 'react';
import { shallow } from 'enzyme';
import { App } from './App';
import { UserState } from './store/user/types';
import { Actions } from './store/user/actions';
import AppMain from './components/layout/AppMain';

interface IProps {
  setUserProfileRequest: typeof Actions.setUserProfileRequest;
  setUserProfileDone: typeof Actions.setUserProfileDone;
  user: UserState;
}

const props : IProps = {
  setUserProfileRequest: jest.fn() as typeof Actions.setUserProfileRequest,
  setUserProfileDone: jest.fn() as typeof Actions.setUserProfileDone,
  user: {} as UserState
};

describe('App', () => {
  it('should render h1 element', () => {
    const component = shallow(<App {...props} />);
    const app = component.find(AppMain);
    expect(app).toHaveLength(1);
  });
});
