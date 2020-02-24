import React from 'react';
import styled from 'styled-components';
import { Input as AntdInput } from 'antd';
import { Button } from '../../../partials';

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
  width: 340px;
  display: flex;
  justify-content: space-between;
  position: absolute;
  right: 40px;
  bottom: 40px;
`;

export const CloseIcon = styled.img`
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 3px;
  cursor: pointer;
`;

export const ErrorMsg = styled.span`
  display: block;
  height: 20px;
  color: ${({ theme }) => theme.palette.error};
  font-size: 13px;
  font-weight: 400;
  line-height: 20px;
  margin-top: 10px;
`;

export const Input = styled(({ withError, ...restProps }) => <AntdInput {...restProps} />)`
  box-sizing: border-box;
  height: 40px;
  border: ${({ theme }) => `1px solid ${theme.palette.secondaryTranslucent03}`};
  border-color: ${({ withError, theme }) => withError ? `${theme.palette.error} !important` : theme.palette.secondaryTranslucent03};
  border-radius: 2px;
  font-size: 16px;
  background-color: ${({ withError, theme }) => withError && theme.palette.errorMild};
  &::placeholder {
    font-style: italic;
    font-weight: 300;
    color: ${({ theme }) => theme.palette.texts.darkGrey};
  }
`;

export const InputLabel = styled.span`
  display: block;
  margin: 21px 0 8px;
  height: 15px;
  color: ${({ error, theme }) => error ? theme.palette.error : theme.palette.texts.darkGrey};
  font-size: 13px;
  font-weight: 500;
  line-height: 15px;
`;

export const ModalContainer = styled.div`
  position: absolute;
  padding: 40px;
  z-index: 9999;
  top: 320px;
  left: calc(50% - 270px);
  width: 540px;
  height: 310px;
  border-radius: 3px;
  background-color: ${({ theme }) => theme.palette.white};
  overflow: hidden;
`;

export const StyledButton = styled(Button)`
  min-width: 160px;
  width: 160px;
  height: 40px;
  font-size: 16px;
`;

export const Subtitle = styled.span`
  display: block;
  height: 20px;
  color: ${({ theme }) => theme.palette.texts.darkGrey};
  font-size: 13px;
  line-height: 20px;
`;

export const Title = styled.span`
  display: block;
  height: 30px;
  color: ${({ theme }) => theme.palette.texts.black};
  font-size: 22px;
  font-weight: bold;
  line-height: 30px;
  margin-bottom: 4px;
`;
