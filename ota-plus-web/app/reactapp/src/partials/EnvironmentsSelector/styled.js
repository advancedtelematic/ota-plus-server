import styled from 'styled-components';
import { Button, Icon, Menu } from 'antd';

export const ButtonStyled = styled(Button)`
  background-color: transparent;
  border: 0px;
  color: ${({ theme }) => theme.palette.white};
  display: flex;
  font-size: 1.00em;
  height: 24px;
  line-height: 18px;
  margin-right: 20px;
  padding: 0 5px;
  &:hover, &:focus {
    color: ${({ lightMode, theme }) => lightMode ? theme.palette.secondaryTranslucent08 : theme.palette.white};
    background-color: transparent;
  }
`;

export const ButtonText = styled.span`
  color: ${({ lightMode, theme }) => lightMode ? theme.palette.secondaryTranslucent08 : theme.palette.white};
  font-size: 13px;
  font-weight: 500;
  line-height: 16px;
  margin-left: 0;
  text-align: left;
  width: 90%;
`;

export const IconStyled = styled(Icon)`
  color: ${({ lightmode, theme }) => (lightmode ? theme.palette.secondaryTranslucent08 : theme.palette.white)};
  height: 14px;
  margin-right: 0;
  margin-top: 1px;
  right: 0;
  width: 14px;
`;
export const MenuIndicator = styled.div`
  background: ${({ theme, selected }) => selected ? theme.palette.primaryDarkened : 'transparent'};
  height: 40px;
  width: 4px;
`;

export const MenuItemStyled = styled(Menu.Item)`
  background-color: ${({ lightmode, theme }) => lightmode ? theme.palette.white : theme.palette.backgroundPrimary};
  color: ${({ theme }) => theme.palette.white};
  display: inline-flex;
  float: left;
  height: 58px;
  padding: 9px 0px 5px 0;
  width: 320px;
  &:hover, &:focus {
    background: ${({ lightmode, theme }) => lightmode ? theme.palette.backgroundLightSelected : theme.palette.backgroundSelected};
    outline: none;
  }
}
`;

export const MenuItemGroupStyled = styled(Menu.ItemGroup)`
  background-color: ${({ lightmode, theme }) => lightmode ? theme.palette.backgroundLightAlpha : theme.palette.secondary};
  border-color: ${({ lightmode, theme }) => lightmode ? theme.palette.borderLight : theme.palette.whiteAlpha02};
  color:  ${({ lightmode, theme }) => lightmode ? theme.palette.texts.darkGrey : theme.palette.whiteTranslucent};
  font-size: 13px;
  font-weight: 500;
  line-height: 16px;
  height: 27px;
  .ant-dropdown-menu-item-group-title {
    color:  ${({ lightmode, theme }) => lightmode ? theme.palette.texts.darkGrey : theme.palette.whiteTranslucent};
  }
  & > ul li:not(:last-child) {
      border-bottom: ${({ lightmode, theme }) => `1px solid ${lightmode ? theme.palette.borderLight : theme.palette.whiteAlpha02}`};
  }
`;

export const MenuStyled = styled(Menu)`
  background-color: ${({ lightmode, theme }) => lightmode ? theme.palette.white : theme.palette.backgroundPrimary};
  border: 0;
  border-radius: 0;
  margin-top: -1px;
  padding: 0;
  max-height: ${({ itemsheight }) => `${27 + itemsheight}px`};//316px;
  overflow-x: hidden;
  overflow-y: ${({ showscrolly }) => showscrolly ? 'scroll' : 'hidden'};
`;

export const MenuTextContainer = styled.div`
  padding-top: 4px;
  width: 316px;
`;

export const MenuTextName = styled.div(({ lightMode, theme }) => ({
  color: lightMode ? theme.palette.secondaryTranslucent08 : theme.palette.texts.light,
  fontSize: '13px',
  fontWeight: '500',
  lineHeight: '16px',
  marginLeft: '5px',
  marginRight: '5px',
  width: '306px',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis'
}));

export const MenuTextNamespace = styled.div(({ lightMode, theme }) => ({
  color: lightMode ? theme.palette.texts.darkAlpha : theme.palette.whiteAlpha04,
  fontSize: '13px',
  lineHeight: '15px',
  marginLeft: '5px',
  marginRight: '5px',
  width: '306px',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis'
}));
