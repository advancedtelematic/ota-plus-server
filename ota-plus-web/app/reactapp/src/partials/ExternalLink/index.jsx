import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const ExternalLink = ({ className, children, id, onClick, url }) => (
  <a id={id} className={className} href={url} onClick={onClick} target="_blank" rel="noopener noreferrer">
    {children}
  </a>
);

ExternalLink.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  id: PropTypes.string,
  onClick: PropTypes.func,
  url: PropTypes.string
};

styled.propTypes = {
  weight: PropTypes.string,
  theme: PropTypes.shape({})
};

export const weightVariants = {
  medium: {
    fontWeight: 500
  },
  regular: {
    fontWeight: 400,
  },
  default: {
    fontWeight: 300
  }
};

export default styled(ExternalLink)(({ theme, weight = 'default' }) => ({
  textDecoration: 'none',
  fontSize: '1em',
  '&, :hover': {
    color: theme.palette.primary,
    ...weightVariants[weight]
  }
}));
