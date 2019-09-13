import React from 'react';
import styled, { DefaultTheme } from 'styled-components';

const sizeVariants = {
  small: {
    fontSize: '0.72em',
    fontWeight: 300
  },
  default: {
    fontSize: '0.93em',
    fontWeight: 500
  }
};

type ExternalLinkProps = {
  className?: string
  children: React.ReactNode,
  size?: 'small' | 'default',
  url: string
};

const ExternalLink = ({ url, className, children }: ExternalLinkProps) => (
  <a className={className} href={url} target="_blank" rel="noopener noreferrer">
    {children}
  </a>
);

type Props = {
  theme: DefaultTheme
};

export default styled(ExternalLink)(({ theme, size = 'default' }: Props & ExternalLinkProps) => ({
  textDecoration: 'none',
  '&, :hover': {
    color: theme.palette.primary,
    ...sizeVariants[size]
  }
}));
