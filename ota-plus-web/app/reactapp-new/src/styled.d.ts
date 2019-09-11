import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    palette: {
      primary: string;
      secondary: string;
      white: string;
    },
    shadows: {
      upwards: string;
    }
  }
}