import React from 'react';
import { shallow } from 'enzyme'
import { App } from './App';
import { UserState } from './store/user/types';

import {
  setUserProfileRequest as setUserProfileRequestAction,
  setUserProfileDone as setUserProfileDoneAction
} from './store/user/actions';


interface IProps {
    setUserProfileRequest: typeof setUserProfileRequestAction;
    setUserProfileDone: typeof setUserProfileDoneAction;
    user: UserState;
}

const props : IProps = {
    setUserProfileRequest: jest.fn() as typeof setUserProfileRequestAction,
    setUserProfileDone: jest.fn() as typeof setUserProfileDoneAction,
    user: {} as UserState
}


describe('App', () => {
    it('should render h1 element', () => {
        const component = shallow(<App {...props} />);
        const h1 = component.find('h1');
        expect(h1).toHaveLength(1)
    });
});
