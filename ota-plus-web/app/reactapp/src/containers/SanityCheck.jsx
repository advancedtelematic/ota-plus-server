/** @format */

import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import _ from 'underscore';
import { FadeAnimation } from '../utils';
import { Loader } from '../partials';

@observer
class SanityCheck extends Component {
  render() {
    return (
      <FadeAnimation>
        <div className='sanity-check'>
          <div className='wrapper-center'>
            <img className='sanity-check__logo-image' src='/assets/img/HERE_pos.png' alt='HERE' />
            <div className='sanity-check__title'>Setting up your account</div>
            <div className='sanity-check__item-name'>
              Loading HERE OTA Connect
              <img src='/assets/img/icons/points.gif' className='sanity-check__item-image' alt='Icon' />
            </div>
          </div>
        </div>
      </FadeAnimation>
    );
  }
}

export default SanityCheck;
