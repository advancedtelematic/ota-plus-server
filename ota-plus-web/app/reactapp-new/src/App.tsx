
import React from 'react';
import { ThemeProvider } from 'styled-components';
import theme from './theme';

import Routes from './Routes';

import AppMain from './components/layout/AppMain';
import AppFooter from './components/layout/AppFooter';
import AppNavbar from './components/layout/AppNavbar';

export const App: React.FC = () => (
  <ThemeProvider theme={theme}>
    <>
      <AppNavbar />
      <AppMain>
        <Routes />
      </AppMain>
      <AppFooter />
    </>
  </ThemeProvider>
);

export default App;
