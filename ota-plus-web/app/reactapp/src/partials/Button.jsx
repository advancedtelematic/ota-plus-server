import styled from 'styled-components';
import { Button as AntdButton } from 'antd';
import PropTypes from 'prop-types';

const darkStyleVariants = theme => ({
  default: {
    color: theme.palette.primary,
    borderColor: theme.palette.primary,
    backgroundColor: 'transparent',
    ':hover': {
      borderColor: theme.palette.primaryTranslucent,
      color: theme.palette.primaryTranslucent,
      backgroundColor: 'transparent',
    },
    ':focus, :active': {
      color: theme.palette.primaryDarkened,
      borderColor: theme.palette.primaryDarkened,
      backgroundColor: 'transparent',
    },
    '&.ant-btn[disabled]': {
      borderColor: 'rgba(45,213,201,0.2)',
      backgroundColor: 'transparent',
      color: 'rgba(45,213,201,0.2)'
    }
  },
  primary: {
    span: {
      color: theme.palette.texts.black,
    },
    backgroundColor: theme.palette.primary,
    borderColor: theme.palette.primary,
    ':hover': {
      backgroundColor: theme.palette.primaryTranslucent,
      borderColor: theme.palette.primaryTranslucent,
    },
    ':focus, :active': {
      backgroundColor: theme.palette.primaryDarkened,
      borderColor: theme.palette.primaryDarkened,
    },
  },
  link: {
    color: theme.palette.primary,
    backgroundColor: 'transparent !important',
    border: 'none !important',
    boxShadow: 'none',
    ':hover': {
      color: theme.palette.primaryTranslucent,
    },
    ':focus, :active': {
      color: theme.palette.primaryDarkened
    },
  }
});

const lightStyleVariants = theme => ({
  default: {
    '&, :hover, :focus': {
      border: '1px solid #00B6B2',
      color: '#00B6B2'
    },
    ':hover, :focus': {
      opacity: 0.8,
    },
    '&.ant-btn[disabled]': {
      color: theme.palette.primaryDarkened,
      borderColor: theme.palette.primaryDarkened,
      backgroundColor: 'transparent',
      opacity: 0.3
    }
  },
  primary: {
    span: {
      color: '#FFFFFF',
    },
    backgroundColor: theme.palette.primaryDarkened,
    borderColor: theme.palette.primaryDarkened,
    ':hover': {
      backgroundColor: theme.palette.primary,
      borderColor: theme.palette.primary,
    },
    ':focus, :active': {
      backgroundColor: theme.palette.primaryDarkened2,
      borderColor: theme.palette.primaryDarkened2,
    },
    '&.ant-btn[disabled]': {
      border: 'none',
      backgroundColor: 'rgba(0,182,178,0.4)',
      color: '#FFFFFF'
    }
  }
});

const styleVariants = (theme, light) => light ? lightStyleVariants(theme) : darkStyleVariants(theme);

const Button = styled(AntdButton)(({ theme, type = 'default', light = false, minwidth = '180px' }) => ({
  borderRadius: '1px',
  minWidth: minwidth,
  fontWeight: 500,
  fontSize: '1em',
  '&.ant-btn-lg': {
    fontSize: '16px',
  },
  ...styleVariants(theme, light)[type]
}));

Button.propTypes = {
  light: PropTypes.oneOf(['true', 'false']),
  theme: PropTypes.shape({}),
  type: PropTypes.oneOf(['default', 'primary', 'link'])
};

export default Button;
