/** @format */

import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { SubHeader } from '../../partials';

@observer
class Header extends Component {
  render() {
    return (
      <SubHeader>
        <a className='add-button grey-button' id='add-new-campaign'>
          <span>{'+'}</span>
          <span>{'Add campaign'}</span>
        </a>
      </SubHeader>
    );
  }
}

export default Header;
