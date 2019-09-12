
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

import { Button, Container, ExternalLink, Title } from './components/common';

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
          <Title size="large">Welcome</Title>
          <Container>
            <Title>Recently created</Title>
          </Container>
          <Title size="small">Devices</Title>
          <ExternalLink url="https://www.google.com">Create device groups</ExternalLink>
          <br />
          <Routes />
          <br />
          {JSON.stringify(props.user)}
          <div>
            <Button type="primary"
              onClick={() => {
                props.setUserProfileDone({ fullName: '', email: '', picture: undefined });
              }}>
              Reset user profile
            </Button>
            <br />
            <br />
          </div>
          <div>
            <Button
              onClick={() => {
                props.setUserProfileRequest();
              }}>
              Get user profile
            </Button>
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
