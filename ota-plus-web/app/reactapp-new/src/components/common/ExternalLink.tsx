import React from 'react';
import styled, { DefaultTheme } from 'styled-components';

type ExternalLinkProps = {
  className?: string
  children: React.ReactNode
  url: string
};

type Props = {
  theme: DefaultTheme
};

const ExternalLink = ({ url, className, children }: ExternalLinkProps) => (
  <a className={className} href={url} target="_blank" rel="noopener noreferrer">
    {children}
  </a>
);

export default styled(ExternalLink)(({ theme }: Props) => ({
  color: theme.palette.primary,
  textDecoration: 'none',
  fontWeight: 500
}));
