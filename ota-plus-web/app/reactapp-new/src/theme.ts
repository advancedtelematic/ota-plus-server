import { DefaultTheme } from 'styled-components';
import { COLORS, SHADOWS } from './constants/styleConstants';

const theme: DefaultTheme = {
  palette: {
    primary: COLORS.PRIMARY,
    secondary: COLORS.SECONDARY,
    white: COLORS.WHITE
  },
  shadows: {
    upwards: SHADOWS.UPWARDS
  }
};

export default theme;
