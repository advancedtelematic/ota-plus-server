import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    palette: {
      primary: string;
      primaryTranslucent: string,
      primaryDarkened: string,
      secondary: string;
      secondaryTranslucent: string;
      white: string;
      lightGrey: string;
      lightGreen: string;
      whiteTranslucent: string;
      disabled: string;
      disabledBorder: string;
      disabledText: string;
      error: string;
      texts: {
        black: string;
        dark: string;
        darkGrey: string;
        lightGrey: string;
      },
      accents: {
        dark: string;
        light: string;
      }
    };
    shadows: {
      upwards: string;
      light: string;
    };
  }
}
