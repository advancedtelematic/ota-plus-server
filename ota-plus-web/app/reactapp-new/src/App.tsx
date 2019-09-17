
import React from 'react';
import { useTranslation, UseTranslationResponse } from 'react-i18next';
import { connect } from 'react-redux';
import { ThemeProvider } from 'styled-components';

import Routes from './Routes';
import { AppState } from './store';
import { UserState } from './store/user/types';

import '../style/index.scss';
import theme from './theme';

import AppMain from './components/layout/AppMain';
import AppFooter from './components/layout/AppFooter';
import { Actions } from './store/user/actions';
import { AppNavbar } from './components/layout/AppNavbar';

import { Button, Container, ExternalLink, Title } from './components/common';
import DocsLinks from './components/DocsLinks/DocsLinks';

interface IProps {
  setUserProfileRequest: typeof Actions.setUserProfileRequest;
  setUserProfileDone: typeof Actions.setUserProfileDone;
  user: UserState;
}

export const App = (props: IProps) => {
  const { t }: UseTranslationResponse = useTranslation();

  // FIXME: buttons are only temporary for Redux testing
  return (
    <ThemeProvider theme={theme}>
      <>
        <AppNavbar />
        <AppMain>
          <Title size="large">Welcome</Title>
          <Container>
            <Title>Recently created</Title>
          </Container>
          <Title size="small">Devices</Title>
          <DocsLinks/>
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
        <AppFooter />
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
