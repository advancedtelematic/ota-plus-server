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
      error: string;
      texts: {
        black: string;
        dark: string;
        darkGrey: string;
        lightGrey: string;
      },
    };
    shadows: {
      upwards: string;
    };
  }
}
