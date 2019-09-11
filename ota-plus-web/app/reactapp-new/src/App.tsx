
import React from 'react';
import { useTranslation, UseTranslationResponse } from 'react-i18next';
import { connect } from 'react-redux';
import { ThemeProvider } from 'styled-components';

import Routes from './Routes';
import { AppState } from './store';
import { UserState } from './store/user/types';

import '../style/index.scss';
import theme from './theme';

import AppHeader from './components/layout/AppHeader';
import AppMain from './components/layout/AppMain';
import AppFooter from './components/layout/AppFooter';
import { Actions } from './store/user/actions';

interface IProps {
  setUserProfileRequest: typeof Actions.setUserProfileRequest;
  setUserProfileDone: typeof Actions.setUserProfileDone;
  user: UserState;
}

export const App: React.FC<IProps> = (props) => {
  const { t }: UseTranslationResponse = useTranslation();

  // FIXME: buttons are only temporary for Redux testing
  return (
    <ThemeProvider theme={theme}>
      <>
        <AppHeader>{t('common.test')}</AppHeader>
        <AppMain>
          <Routes />
          <br />
          {JSON.stringify(props.user)}
          <div>
            <button
              onClick={() => {
                props.setUserProfileDone({ fullName: '', email: '', picture: undefined });
              }}>
              REDUX TEST Reset user profile
            </button>
            <br />
            <br />
          </div>
          <div>
            <button
              onClick={() => {
                props.setUserProfileRequest();
              }}>
              REDUX TEST Get user profile
            </button>
          </div>
        </AppMain>
        <AppFooter>Footer</AppFooter>
      </>
    </ThemeProvider>
  );
};

const mapStateToProps = (state: AppState) => ({
  user: state.user,
});

const mapDispatchToProps = {
  setUserProfileDone: Actions.setUserProfileDone,
  setUserProfileRequest: Actions.setUserProfileRequest
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
