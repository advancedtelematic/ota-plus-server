/** @format */

import React from 'react';
import { MetaData, FadeAnimation } from '../utils';
import { Terms } from '../containers';

const title = 'Policy';

const TermsAndConditions = () => (
  <FadeAnimation>
    <MetaData title={title}>
      <Terms checked />
    </MetaData>
  </FadeAnimation>
);

export default TermsAndConditions;
