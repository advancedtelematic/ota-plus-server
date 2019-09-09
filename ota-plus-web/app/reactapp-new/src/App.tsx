
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import Routes from './Routes';
import { AppState } from './store';
import { UserProfile, UserState } from './store/user/types';

import {
  setUserProfileRequest as setUserProfileRequestAction,
  setUserProfileDone as setUserProfileDoneAction
} from './store/user/actions';

import '../style/index.scss';

interface IProps {
  setUserProfileRequest: typeof setUserProfileRequestAction;
  setUserProfileDone: typeof setUserProfileDoneAction;
  user: UserState;
}

export const App: React.FC<IProps> = (props) => {
  const [t] = useTranslation();

  // FIXME: buttons are only temporary for Redux testing
  return (
    <div>
      <h1>{t('common.test')}</h1>
      <Routes />
      <br/>
      {JSON.stringify(props.user)}
      <div>
        <button
          onClick={() => {
            props.setUserProfileDone({ fullName: '', email: '', picture: undefined });
          }}>
            REDUX TEST Reset user profile
        </button>
        <br/>
        <br/>
      </div>
      <div>
        <button
          onClick={() => {
            props.setUserProfileRequest();
          }}>
          REDUX TEST Get user profile
        </button>
      </div>
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  user: state.user,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    setUserProfileDone: (newUserProfile: UserProfile) => dispatch(setUserProfileDoneAction(newUserProfile)),
    setUserProfileRequest: () => dispatch(setUserProfileRequestAction()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
