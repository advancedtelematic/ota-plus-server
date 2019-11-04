/** @format */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { MetaData, FadeAnimation } from '../utils';
import { Terms } from '../containers';

const TermsAndConditions = () => {
  const { t } = useTranslation();
  return (
    <FadeAnimation>
      <MetaData title={t('terms_of_use.title')}>
        <Terms checked />
      </MetaData>
    </FadeAnimation>
  );
};

export default TermsAndConditions;
