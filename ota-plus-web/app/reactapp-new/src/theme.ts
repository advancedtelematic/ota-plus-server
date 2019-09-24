import { DefaultTheme } from 'styled-components';
import { COLORS, SHADOWS } from './constants/styleConstants';

export type StyledTheme = {
  theme: DefaultTheme
};

const theme: DefaultTheme = {
  palette: {
    primary: COLORS.PRIMARY,
    primaryTranslucent: COLORS.PRIMARY_TRANSLUCENT,
    primaryDarkened: COLORS.PRIMARY_DARKENED,
    secondary: COLORS.SECONDARY,
    secondaryTranslucent: COLORS.SECONDARY_TRANSLUCENT,
    white: COLORS.WHITE,
    lightGrey: COLORS.LIGHT_GREY,
    lightGreen: COLORS.LIGHT_GREEN,
    whiteTranslucent: COLORS.WHITE_TRANSLUCENT,
    error: COLORS.ERROR,
    texts: {
      black: COLORS.TEXT_BLACK,
      dark: COLORS.TEXT_DARK,
      darkGrey: COLORS.TEXT_DARK_GREY,
      lightGrey: COLORS.TEXT_LIGHT_GREY,
    }
  },
  shadows: {
    upwards: SHADOWS.UPWARDS
  }
};

export default theme;
