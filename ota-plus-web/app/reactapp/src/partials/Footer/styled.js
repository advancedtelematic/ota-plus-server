import styled from 'styled-components';
import { Button, Icon, Menu } from 'antd';
import { ExternalLink } from '..';

export const FooterContainer = styled.footer`
  height: 49px;
  background-color: ${({ theme }) => theme.palette.secondary};
  box-shadow: ${({ theme }) => theme.shadows.upwards};
  padding: 0 30px;
  display: flex;
  align-items: center;
  line-height: 0.86em;
  width: 100%;
  ${ExternalLink}:not(:first-of-type) {
    padding-left: 10px;
  };
  ${ExternalLink}:not(:last-of-type) {
    border-right: 1px solid ${({ theme }) => theme.palette.whiteAlpha02};
    padding-right: 10px;
  };
`;

export const RightContainer = styled.div`
  height: inherit;
  margin-left: auto;
  display: flex;
  align-items: center;
  & > div:not(:last-child) {
      margin-right: 30px;
  }
`;

export const CopyrightTag = styled.span`
  margin-left: auto;
  color: ${({ theme }) => theme.palette.white};
  font-size: 1.00em;
  font-weight: 300;
`;

export const LanguageTag = styled.span`
  margin-left: auto;
  margin-right: 8px;
  color: ${({ theme }) => theme.palette.white};
  font-size: 1.00em;
  font-weight: 300;
`;

export const ButtonStyled = styled(Button)`
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.palette.whiteTranslucent};;
  border-radius: 2px;
  color: ${({ theme }) => theme.palette.white};
  display: flex;
  font-size: 1.00em;
  font-family: "Fira Sans";
  line-height: 18px;
  margin-right: 20px;
  padding: 0 5px;
  width: 160px;
  &:hover, &:focus {
    color: ${({ theme }) => theme.palette.white};
    border-color: ${({ theme }) => theme.palette.whiteTranslucent};
    background-color: transparent;
  }
`;

export const ButtonText = styled.span`
  font-weight: 100;
  margin-left: 0;
  text-align: left;
  width: 90%;
`;

export const IconStyled = styled(Icon)`
  margin-right: 0;
  margin-top: 2px;
  right: 0;
  width: 10%;
`;

export const MenuItemStyled = styled(Menu.Item)`
  background-color: ${({ theme }) => theme.palette.secondary};
  color: ${({ theme }) => theme.palette.white};
  &:hover, &:focus {
    background: ${({ theme }) => theme.palette.primary};
    outline: none;
  }
}
`;

export const MenuStyled = styled(Menu)`
  background-color: ${({ theme }) => theme.palette.secondary};
  border: 1px solid ${({ theme }) => theme.palette.whiteTranslucent};
`;
