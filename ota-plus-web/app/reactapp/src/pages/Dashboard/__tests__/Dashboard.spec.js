import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from 'mobx-react';
import stores from '../../../stores';
import Dashboard from '..';

it('should render', () => {
  shallow(
    <Provider stores={stores}>
      <Dashboard />
    </Provider>
  );
});
