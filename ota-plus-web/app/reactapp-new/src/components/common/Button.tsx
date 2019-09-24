import styled, { DefaultTheme } from 'styled-components';
import { Button } from 'antd';
import { NativeButtonProps } from 'antd/lib/button/button';

const sizeVariants = {
  small: {},
  default: {
    minWidth: '188px',
    height: '30px',
    span: {
      fontSize: '0.93em'
    },
  },
  large: {
    minWidth: '330px',
    height: '40px',
    span: {
      fontSize: '1.15em'
    }
  }
};

const styleVariants = (theme: DefaultTheme) => ({
  default: {
    '&, :hover, :focus, :active': {
      color: theme.palette.primary,
      borderColor: theme.palette.primary
    },
    ':hover': {
      backgroundColor: theme.palette.primaryTranslucent
    }
  },
  primary: {
    '&, :hover, :focus, :active': {
      backgroundColor: theme.palette.primary,
      borderColor: theme.palette.primary,
    },
    ':hover': {
      backgroundColor: theme.palette.primaryDarkened
    }
  },
  link: {
    '&, :hover, :focus, :active': {
      color: theme.palette.primary
    },
  },
  ghost: {},
  dashed: {},
  danger: {}
});

type Props = {
  theme: DefaultTheme;
};

export default styled(Button)(({ size = 'default', theme, type = 'default' }: Props & NativeButtonProps) => ({
  borderRadius: '1px',
  ...sizeVariants[size],
  ...styleVariants(theme)[type]
}));
