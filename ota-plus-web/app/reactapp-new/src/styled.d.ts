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
      texts: {
        black: string;
        dark: string;
      },
    };
    shadows: {
      upwards: string;
    };
  }
}
