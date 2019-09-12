import { DefaultTheme } from 'styled-components';
import { COLORS, SHADOWS } from './constants/styleConstants';

const theme: DefaultTheme = {
  palette: {
    primary: COLORS.PRIMARY,
    primaryTranslucent: COLORS.PRIMARY_TRANSLUCENT,
    primaryDarkened: COLORS.PRIMARY_DARKENED,
    secondary: COLORS.SECONDARY,
    white: COLORS.WHITE,
    texts: {
      black: COLORS.TEXT_BLACK,
      dark: COLORS.TEXT_DARK
    }
  },
  shadows: {
    upwards: SHADOWS.UPWARDS
  }
};

export default theme;
