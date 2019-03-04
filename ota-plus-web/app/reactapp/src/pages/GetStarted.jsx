/** @format */

import React from 'react';
import { MetaData, FadeAnimation } from '../utils';
import { GetStartedContainer } from '../containers';

const title = 'GET STARTED';

const GetStarted = () => (
  <FadeAnimation>
    <MetaData title={title}>
      <GetStartedContainer />
    </MetaData>
  </FadeAnimation>
);

export default GetStarted;
