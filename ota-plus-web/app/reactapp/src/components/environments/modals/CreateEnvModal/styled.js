/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';

export const Subtitle = styled.span`
  display: block;
  height: 20px;
  color: ${({ theme }) => theme.palette.texts.darkGrey};
  font-size: 13px;
  line-height: 20px;
`;
