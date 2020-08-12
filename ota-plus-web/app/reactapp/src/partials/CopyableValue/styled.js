import styled from 'styled-components';

export const Container = styled.div`
  display: inline;
  height: 20px;
  width: 160px;
`;

export const Icon = styled.div`
  background: url(/assets/img/new-app/16/icon-copy-clipboard-aqua-16x16.svg);
  cursor: pointer;
  background-size: contain;
  background-position-y: center;
  display: inline-block;
  width: 16px;
  height: 16px;
`;


export const Title = styled.span`
  margin-left: auto;
  color: ${({ theme }) => theme.palette.whiteAlpha08};
  font-size: 12px;
  font-weight: 500;
  display: inline-block;
  overflow: hidden;
`;

export const Value = styled.span(({ width = '64px', theme }) => ({
  marginLeft: '4px',
  color: theme.palette.whiteAlpha08,
  fontSize: '12px',
  fontWeight: '300',
  width,
  display: 'inline-block',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden'
}));
