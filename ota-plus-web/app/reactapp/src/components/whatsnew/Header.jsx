/** @format */

import React, { Component } from 'react';
import { observer } from 'mobx-react';

@observer
class Header extends Component {
  render() {
    return (
      <div className='whats-new-header'>
        <div className='whats-new-header__image' />
        <div className='whats-new-header__title'>
          <h1>Whats new</h1>
          <p className='description'> The latest product news and updates for HERE OTA Connect in one place</p>
        </div>
      </div>
    );
  }
}

export default Header;
