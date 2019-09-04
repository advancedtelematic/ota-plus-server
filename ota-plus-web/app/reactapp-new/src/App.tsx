import React from 'react';
import { useTranslation } from 'react-i18next';
import Routes from './Routes';

import '../style/index.scss';

const App: React.FC<{}> = () => {
  const [t, i18n] = useTranslation();

  return (
    <>
      <h1>{t('common.test')}</h1>
      <Routes />
    </>
  );
};

export default App;
