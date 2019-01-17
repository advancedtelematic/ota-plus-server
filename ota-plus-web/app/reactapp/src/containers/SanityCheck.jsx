/** @format */

import React from 'react';
import { FadeAnimation } from '../utils';

const SanityCheck = () => (
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

export default SanityCheck;
