import React from 'react';
import { shallow } from 'enzyme';
import { App } from './App';
import AppMain from './components/layout/AppMain';

describe('App', () => {
  it('should render h1 element', () => {
    const component = shallow(<App />);
    const app = component.find(AppMain);
    expect(app).toHaveLength(1);
  });
});
