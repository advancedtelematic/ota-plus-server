/** @format */

import React, { Component } from 'react';
import { observer } from 'mobx-react';

@observer
class Header extends Component {
  render() {
    return (
      <div className='get-started-header'>
        <div className='get-started-header__image' />
        <div className='get-started-header__title'>
          <h1>Get Started</h1>
          <p className='description'> A quick guide to deploying software updates in OTA Connect. </p>
        </div>
      </div>
    );
  }
}

export default Header;
