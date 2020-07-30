import React from 'react';
import styled from 'styled-components';
import Button from '../Button';
import { WARNING_MODAL_COLOR } from '../../constants';

export const BackgroundMask = styled.div`
  position: absolute;
  z-index: 3001;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 370px;
  margin: 30px auto;
`;

export const Description = styled.div`
  font-size: 1.231em;
  font-weight: 400;
  padding: 0 32px;
  line-height: 20px;
  text-align: center;
  background-color: ${({ theme }) => theme.palette.white};
`;

export const ModalContainer = styled.div`
  position: absolute;
  z-index: 9999;
  top: 320px;
  left: calc(50% - 300px);
  width: 600px;
  border-radius: 3px;
  background-color: ${({ theme }) => theme.palette.white};
  overflow: hidden;
`;

export const StyledButton = styled(Button)`
  height: 40px;
  min-width: 170px;
  font-size: 1.231em;
`;

export const CancelButton = styled(({ colorTheme, ...restProps }) => <StyledButton {...restProps} />)`  
  &, :hover, :focus {
    border: 1px solid ${props => props.colorTheme};
    color: ${props => props.colorTheme === WARNING_MODAL_COLOR.INFO ? props.theme.palette.texts.black : props.colorTheme};
    background-color: ${props => props.colorTheme === WARNING_MODAL_COLOR.INFO && WARNING_MODAL_COLOR.INFO};
  }
  :hover, :focus {
    opacity: 0.8;
  }
`;

export const ConfirmButton = styled(({ colorTheme, ...restProps }) => <StyledButton {...restProps} />)`
  margin-left: 30px;
  &, :hover, :focus {
    border: none;
    color: ${({ theme }) => theme.palette.white};
    background-color: ${props => props.colorTheme};
  }
  :hover, :focus {
    opacity: 0.8;
  }
`;

export const Title = styled.h1`
  margin: 30px auto 18px;
  font-size: 2.462em;
  font-weight: 700;
  text-align: center;
  color: ${({ theme }) => theme.palette.texts.black};
`;

export const TopBar = styled.div`
  height: 20px;
  width: 100%;
  background-color: ${({ colorTheme }) => colorTheme};
`;
