import styled from 'styled-components';
import { List } from 'antd';

export const ListStyled = styled(List)`
  .ant-list-header {
    padding: 0;
    border-bottom: none;
  }
`;

export const EnvName = styled.span`
  font-weight: 500;
`;

export const ListItem = styled(List.Item)`
  display: flex;
  padding: 10px 30px;
  font-size: 13px;
  color: ${({ theme }) => theme.palette.texts.black};
  cursor: pointer;
  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.palette.borderLight} !important;
  }
  & > span {
    flex: 18.5%;
    padding-right: 16px;
  }
  & > span:nth-child(1) {
    flex: 21%;
  }
  & > span:nth-child(2) {
    flex: 42%;
  }
  :hover {
    background-color: ${({ theme }) => theme.palette.backgroundLightUltra};
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
