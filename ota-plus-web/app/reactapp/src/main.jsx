import React from 'react';
import { render } from 'react-dom';
import Routes from './Routes';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

const muiTheme = getMuiTheme({
    palette: {
        primary1Color: '#9ce2d8',
    },
    datePicker: {
        selectColor: '#48DAD0',
    },
    flatButton: {
        primaryTextColor: '#4B5151',
    },
});

const Main = () => {
    injectTapEventPlugin();
    return (
        <MuiThemeProvider muiTheme={muiTheme}>
            <I18nextProvider i18n={i18n}>
                <Routes />
            </I18nextProvider>
        </MuiThemeProvider>
    )
}

render(<Main />, document.getElementById('app'));