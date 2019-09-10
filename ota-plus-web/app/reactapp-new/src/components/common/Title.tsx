import styled, { DefaultTheme } from 'styled-components';

const styleVariants = (theme: DefaultTheme) => ({
  small: {
    height: '20px',
    fontSize: '1.15em',
    lineHeight: '30px'
  },
  medium: {
    height: '40px',
    fontSize: '1.58em',
    lineHeight: '28px',
    color: theme.palette.texts.black
  },
  large: {
    height: '50px',
    fontSize: '2.29em',
    lineHeight: '46px'
  }
});

type Props = {
  size?: 'small' | 'medium' | 'large',
  theme: DefaultTheme
};

export default styled.h1<Props>(({ size = 'medium', theme }) => ({
  fontWeight: 700,
  color: theme.palette.texts.black,
  ...styleVariants(theme)[size]
}));
