/** @format */

import React from 'react';
import { MetaData, FadeAnimation } from '../utils';
import { WhatsNewContainer } from '../containers';

const title = "WHAT's NEW";

const WhatsNew = () => (
  <FadeAnimation>
    <MetaData title={title}>
      <WhatsNewContainer />
    </MetaData>
  </FadeAnimation>
);

export default WhatsNew;
