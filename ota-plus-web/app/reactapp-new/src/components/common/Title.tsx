import styled, { DefaultTheme } from 'styled-components';

const styleVariants = (theme: DefaultTheme) => ({
  small: {
    height: '20px',
    fontSize: '1.15em',
    lineHeight: '30px'
  },
  medium: {
    fontSize: '1.58em',
    lineHeight: '40px',
    marginBottom: '20px',
    color: theme.palette.texts.black
  },
  large: {
    fontSize: '2.29em',
    lineHeight: '46px',
    marginBottom: '22px'
  }
});

type Props = {
  size?: 'small' | 'medium' | 'large',
  theme: DefaultTheme
};

export default styled.h1<Props>(({ size = 'medium', theme }: Props) => ({
  fontWeight: 700,
  color: theme.palette.texts.black,
  ...styleVariants(theme)[size]
}));
