import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    palette: {
      primary: string;
      primaryTranslucent: string,
      primaryDarkened: string,
      secondary: string;
      white: string;
      texts: {
        black: string;
        dark: string;
      }
    },
    shadows: {
      upwards: string;
    }
  }
}