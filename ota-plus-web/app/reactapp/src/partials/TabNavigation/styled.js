import styled from 'styled-components';
import { Button, Icon, Menu } from 'antd';

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
  padding: 0 8px;
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
