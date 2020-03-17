/** @format */

import React from 'react';
import { FadeAnimation } from '../utils';
import { HERE_ICON, POINTS_GIF } from '../config';

const SanityCheck = () => (
  <FadeAnimation>
    <div className="sanity-check">
      <div className="wrapper-center">
        <img className="sanity-check__logo-image" src={HERE_ICON} alt="HERE" />
        <div className="sanity-check__title">Setting up your account</div>
        <div className="sanity-check__item-name">
          Loading HERE OTA Connect
          <img src={POINTS_GIF} className="sanity-check__item-image" alt="Icon" />
        </div>
      </div>
    </div>
  </FadeAnimation>
);

export default SanityCheck;
