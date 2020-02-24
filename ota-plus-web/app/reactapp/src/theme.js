import { COLORS, SHADOWS } from './constants/styleConstants';

const theme = {
  palette: {
    backgroundPrimary: COLORS.BACKGROUND_PRIMARY,
    backgroundSecondary: COLORS.BACKGROUND_SECONDARY,
    backgroundSelected: COLORS.BACKGROUND_SELECTED,
    backgroundLight: COLORS.BACKGROUND_LIGHT,
    backgroundLightSelected: COLORS.BACKGROUND_LIGHT_SELECTED,
    backgroundLightAlpha: COLORS.BACKGROUND_LIGHT_ALPHA,
    borderLight: COLORS.BORDER_LIGHT,
    primary: COLORS.PRIMARY,
    primaryTranslucent: COLORS.PRIMARY_TRANSLUCENT,
    primaryDarkened: COLORS.PRIMARY_DARKENED,
    primaryDarkened2: COLORS.PRIMARY_DARKENED_2,
    secondary: COLORS.SECONDARY,
    secondaryTranslucent: COLORS.SECONDARY_TRANSLUCENT,
    secondaryTranslucent03: COLORS.SECONDARY_TRANSLUCENT_03,
    secondaryTranslucent08: COLORS.SECONDARY_TRANSLUCENT_08,
    white: COLORS.WHITE,
    whiteAlpha02: COLORS.WHITE_ALPHA_02,
    whiteAlpha04: COLORS.WHITE_ALPHA_04,
    whiteAlpha08: COLORS.WHITE_ALPHA_08,
    lightGrey: COLORS.LIGHT_GREY,
    lightGreen: COLORS.LIGHT_GREEN,
    whiteTranslucent: COLORS.WHITE_TRANSLUCENT,
    disabledText: COLORS.DISABLED_TEXT,
    error: COLORS.ERROR,
    errorMild: COLORS.ERROR_MILD,
    texts: {
      black: COLORS.TEXT_BLACK,
      dark: COLORS.TEXT_DARK,
      darkAlpha: COLORS.TEXT_DARK_ALPHA,
      darkGrey: COLORS.TEXT_DARK_GREY,
      light: COLORS.TEXT_LIGHT,
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
