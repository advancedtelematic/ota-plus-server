import React from 'react';
import styled, { DefaultTheme } from 'styled-components';
import PropTypes from 'prop-types';

const ExternalLink = ({ className, children, onClick, url }) => (
  <a className={className} href={url} onClick={onClick} target="_blank" rel="noopener noreferrer">
    {children}
  </a>
);

ExternalLink.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  onClick: PropTypes.func,
  url: PropTypes.string
};

styled.propTypes = {
  size: PropTypes.string,
  theme: DefaultTheme
};

export const sizeVariants = {
  small: {
    fontSize: '1.0em',
    fontWeight: 300
  },
  default: {
    fontSize: '0.93em',
    fontWeight: 500
  }
};

export default styled(ExternalLink)(({ theme, size = 'default' }) => ({
  textDecoration: 'none',
  '&, :hover': {
    color: theme.palette.primary,
    ...sizeVariants[size]
  }
}));
