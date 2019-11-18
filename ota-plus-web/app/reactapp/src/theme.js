import { COLORS, SHADOWS } from './constants/styleConstants';

const theme = {
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
    disabled: COLORS.DISABLED_GREY,
    disabledBorder: COLORS.DISABLED_BORDER,
    disabledText: COLORS.DISABLED_TEXT,
    error: COLORS.ERROR,
    texts: {
      black: COLORS.TEXT_BLACK,
      dark: COLORS.TEXT_DARK,
      darkGrey: COLORS.TEXT_DARK_GREY,
      lightGrey: COLORS.TEXT_LIGHT_GREY
    },
    accents: {
      dark: COLORS.ACCENTS_DARK,
      light: COLORS.ACCENTS_LIGHT_DARK
    }
  },
  shadows: {
    upwards: SHADOWS.UPWARDS,
    light: SHADOWS.LIGHT
  }
};

export default theme;
