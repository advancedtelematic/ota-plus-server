import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

import '../style/index.scss';

interface IProps extends WithTranslation {
  t: TFunction;
}

const App: React.FC<IProps> = ({ t }) => (
  <div>
    <h1>{t('common.test')}</h1>
  </div>
);

export default withTranslation()(App);
