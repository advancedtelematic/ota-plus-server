import styled from 'styled-components';
import { List } from 'antd';
import { Button } from '../../../partials';
import { ListItem as BaseListItem } from '../EnvironmentsList/styled';

export const ListStyled = styled(List)`
  .ant-list-header {
    padding: 0;
    border-bottom: none;
  }
`;

export const ListItem = styled(BaseListItem)`
  & > span {
    flex: 50% !important;
    padding-right: 16px;
  }
  & > span:first-child {
    font-weight: 500;
  }
`;

export const ListHeader = styled(ListItem)`
  padding: 5px 30px;
  font-weight: 500;
  color: ${({ theme }) => theme.palette.texts.darkGrey};
  cursor: default;
  &, :hover {
    background-color: ${({ theme }) => theme.palette.headerGrey};
  }
`;

export const OwnerTag = styled.div`
  display: inline-block;
  height: 15px;
  padding: 0 12px;
  border-radius: 2px;
  background-color: ${({ theme }) => theme.palette.primaryDarkened};
  color: ${({ theme }) => theme.palette.white};
  cursor: default;
  font-size: 0.85em;
  font-weight: 500;
  letter-spacing: 0.28px;
  margin-left: 6px;
  text-transform: uppercase;
`;

export const RemoveButton = styled(Button)`
  border: none;
  position: absolute;
  right: 30px;
  padding: 0;
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
