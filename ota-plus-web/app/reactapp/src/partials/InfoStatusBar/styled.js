import styled from 'styled-components';
import { INFO_STATUS_BAR_TYPE } from '../../constants';

export const CloseIconContainer = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: flex-end;
  margin-left: auto;
`;

export const Container = styled.div`
  height: 40px;
  background-color: ${({ type, theme }) => type === INFO_STATUS_BAR_TYPE.SUCCESS ? theme.palette.green : theme.palette.error};
  display: flex;
  border-radius: 2px;
  align-items: center;
  line-height: 0.86em;
  width: 100%;
`;

export const Icon = styled.img`
  width: 20px;
  height: 20px;
  margin-left: 8px;
  margin-right: 8px;
`;

export const Text = styled.div`
  height: 20px;
  color: ${({ type, theme }) => type === INFO_STATUS_BAR_TYPE.SUCCESS ? theme.palette.texts.black : theme.palette.white};
  font-size: 16px;
  letter-spacing: 0;
  font-weight: 400;
  line-height: 20px;
`;
