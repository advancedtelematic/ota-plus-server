/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import { Button } from '../../../partials';

export const CreateEnvButton = styled(Button)`
  float: left;
  margin-bottom: 16px;
`;

export const OwnerTag = styled.div`
  height: 15px;
  padding: 0 12px;
  border-radius: 2px;
  background-color: ${({ theme }) => theme.palette.primaryDarkened};
  color: ${({ theme }) => theme.palette.white};
  font-size: 0.85em;
  font-weight: 500;
  letter-spacing: 0.28px;
  margin-left: 6px;
  text-transform: uppercase;
`;

export const RemoveButton = styled(Button)`
  border: none;
  height: 42px;
  min-width: 100px;
  font-size: 1.08em;
  &, :hover, :focus {
    color: #CF001A;
  }
  :hover {
    opacity: 0.7;
  }
  & > img {
    margin: 0 4px 4px 0;
  }
`;
