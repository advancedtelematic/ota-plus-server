import { COLORS, SHADOWS } from './constants/styleConstants';

const theme = {
  palette: {
    backgroundPrimary: COLORS.BACKGROUND_PRIMARY,
    backgroundSecondary: COLORS.BACKGROUND_SECONDARY,
    listBackground: COLORS.LIST_BACKGROUND,
    primary: COLORS.PRIMARY,
    primaryTranslucent: COLORS.PRIMARY_TRANSLUCENT,
    primaryDarkened: COLORS.PRIMARY_DARKENED,
    primaryDarkened2: COLORS.PRIMARY_DARKENED_2,
    secondary: COLORS.SECONDARY,
    secondaryTranslucent: COLORS.SECONDARY_TRANSLUCENT,
    secondaryTranslucent08: COLORS.SECONDARY_TRANSLUCENT_08,
    white: COLORS.WHITE,
    whiteAlpha02: COLORS.WHITE_ALPHA_02,
    whiteAlpha08: COLORS.WHITE_ALPHA_08,
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
