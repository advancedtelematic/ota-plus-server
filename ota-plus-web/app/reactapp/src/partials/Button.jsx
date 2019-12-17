import styled from 'styled-components';
import { Button as AntdButton } from 'antd';
import PropTypes from 'prop-types';

const styleVariants = theme => ({
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
    }
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

const Button = styled(AntdButton)(({ theme, type = 'default' }) => ({
  borderRadius: '1px',
  minWidth: '180px',
  fontWeight: 500,
  fontSize: '1em',
  ...styleVariants(theme)[type]
}));

Button.propTypes = {
  theme: PropTypes.shape({}),
  type: PropTypes.oneOf(['default', 'primary', 'link'])
};

export default Button;
