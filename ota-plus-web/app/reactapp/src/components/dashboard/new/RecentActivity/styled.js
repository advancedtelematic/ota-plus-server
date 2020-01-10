import styled from 'styled-components';
import { Button, Checkbox, Icon, List, Menu } from 'antd';

export const ButtonStyled = styled(Button)`
  background-color: ${({ theme }) => theme.palette.backgroundPrimary};
  border: 1px solid ${({ theme }) => theme.palette.secondaryTranslucent};
  border-radius: 0px;
  color: ${({ theme }) => theme.palette.whiteAlpha08};
  display: flex;
  font-size: 13px;
  font-weight: 500;
  line-height: 18px;
  margin-right: 0px;
  padding: 0 5px;
  width: 160px;
  &:hover, &:focus {
    color: ${({ theme }) => theme.palette.white};
    border-color: ${({ theme }) => theme.palette.secondaryTranslucent};
    background-color: ${({ theme }) => theme.palette.backgroundPrimary};
  }
`;

export const ButtonText = styled.span`
  color: ${({ theme }) => theme.palette.whiteAlpha08};
  font-weight: 400;
  margin-left: 2px;
  text-align: left;
  width: 90%;
`;

export const FilterTitle = styled.span`
  margin-left: auto;
  margin-right: 8px;
  color: ${({ theme }) => theme.palette.texts.lightGrey};
  font-size: 13px;
  font-weight: 500;
  line-height: 18px;
`;

export const DropdownIcon = styled(Icon)`
  color: ${({ theme }) => theme.palette.whiteAlpha08};
  margin-right: 0;
  margin-top: 2px;
  right: 0;
  width: 10%;
`;

export const ListStyled = styled(List)`
  background-color: ${({ theme }) => theme.palette.listBackground};
  margin: 20px;
`;

export const ListItem = styled(List.Item)`
  display: flex;
  height: 60px;
  padding: 0;

`;

export const ListIcon = styled.img`
  width: 20px;
  height: 20px;
  margin-left: 20px;
  margin-right: 20px;
`;

export const ListDescription = styled.div`
  height: 16px;
  color: ${({ theme }) => theme.palette.secondaryTranslucent};
  font-size: 11px;
  line-height: 16px;
`;

export const ListTitle = styled.div`
  height: 24px;
  color: ${({ theme }) => theme.palette.secondaryTranslucent08};
  font-size: 13px;
  font-weight: 500;
  line-height: 24px;
`;

export const ListDate = styled.div`
  height: 16px;
  color: ${({ theme }) => theme.palette.secondaryTranslucent08};
  font-size: 13px;
  line-height: 16px;
  margin-left: auto;
  margin-right: 20px;
`;

export const ListNoDataWrapper = styled.div`
  height: 288px;
  width: 100%;  
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ListNoDataContainer = styled.div`
  text-align: center;
`;

export const ListNoDataIcon = styled.img`
  width: 24px;
  height: 24px;
  margin-bottom: 10px;
`;

export const ListNoDataDescription = styled.div`
  color: ${({ theme }) => theme.palette.lightGrey};
  font-size: 13px;
  line-height: 18px;
  text-align: center;
  white-space: pre-line;
`;

export const MenuCheckbox = styled(Checkbox)`
  margin-right: 8px;
  width: 12px;
  .ant-checkbox-inner {
    border: 1px solid ${({ theme }) => theme.palette.whiteAlpha02};
    border-radius: 2px;
    background-color: transparent;
    height: 12px;
    width: 12px;
  }
  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: ${({ theme }) => theme.palette.primary};
  }
  .ant-checkbox-checked .ant-checkbox-inner:after {
    border-color: ${({ theme }) => theme.palette.texts.black};
  }
`;

export const MenuItemStyled = styled(Menu.Item)`
  background-color: ${({ theme }) => theme.palette.backgroundPrimary};
  color: ${({ theme }) => theme.palette.whiteAlpha08};
  display: flex;
  font-size: 13px;
  font-weight: 400;
  line-height: 24px;
  &:hover, &:focus {
    background: ${({ theme }) => theme.palette.whiteAlpha02};
    outline: none;
  }
`;

export const MenuSelectedLength = styled.div`
  height: 18px;
  width: 7px;
  color: ${({ theme }) => theme.palette.whiteAlpha08};
  font-size: 13px;
  font-weight: 400;
  line-height: 18px;
  margin-right: 7px;
`;

export const MenuStyled = styled(Menu)`
  background-color: ${({ theme }) => theme.palette.backgroundPrimary};
  border: 1px solid ${({ theme }) => theme.palette.secondaryTranslucent};
  border-radius: 0px;
`;

export const RecentActivityWrapper = styled.div(({ empty, theme }) => ({
  display: 'flex',
  flex: 1,
  marginRight: '30px',
  flexDirection: 'column',
  backgroundColor: theme.palette.backgroundSecondary,
  position: 'relative',
  height: empty ? '288px' : 'auto',
  minHeight: '288px',
}));

export const RightContainer = styled.div`
  height: inherit;
  margin-left: auto;
  display: flex;
  align-items: center;
`;

export const Title = styled.div`
  height: 30px;
  width: 300px;
  color: ${({ theme }) => theme.palette.white};
  font-size: 22px;
  font-weight: bold;
  line-height: 30px;
`;

export const TopContainer = styled.div`
  display: flex;
  padding: 20px;
`;
