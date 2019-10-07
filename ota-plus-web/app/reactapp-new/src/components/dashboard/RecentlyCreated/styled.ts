import styled, { DefaultTheme } from 'styled-components';
import { Icon } from '../../common';

type ElementProps = {
  disabled?: boolean;
  theme: DefaultTheme;
};

const StyledIcon = styled(Icon)`
  width: 24px;
`;

const StyledSelectIcon = styled(Icon)`
  width: 16px;
  margin-right: 6px;
  margin-top: -0.19em;
`;

const DataHeader = styled.div`
  font-size: 1.15em;
  font-weight: 500;
`;

const DataDesc = styled.div`
  color: ${({ theme }) => theme.palette.lightGrey};
  font-size: 0.93em;
  font-weight: 300;
`;

const DateElement = styled.div`
  font-size: 1.15em;
`;

const SelectElement = styled.div`
  margin: 0 0 0.94em 0;
`;

const ShowElement = styled.span<ElementProps>`
  color: ${({ disabled = false, theme }) => !disabled ? theme.palette.lightGrey : theme.palette.disabledText};
  float: left;
  font-size: 0.91em;
  font-weight: 500;
  line-height: 40px;
  margin-right: 8px;
`;

const EmptyList = styled.div`
  color: ${({ theme }) => theme.palette.lightGrey};
  font-size: 0.91em;
  font-weight: 400;
  line-height: 1.5em;
  margin-right: 0.5em;
  width: 75%;
`;

const SelectedElements = styled.div`
  margin: 0 0 0.94em 0;
`;

const SelectedItem = styled.span`
  border: ${({ theme }) => `1px solid ${theme.palette.accents.light}`};
  border-radius: 100px;
  color: ${({ theme }) => theme.palette.lightGrey};
  display: inline-block;
  font-size: 0.93em;
  margin-right: 0.63em;
  padding: 0.1em 0.64em;
`;

const SelectedCloseItem = styled(Icon)`
  cursor: pointer;
  margin-left: 6px;
  width: 12px;
`;

export {
  StyledIcon, StyledSelectIcon, DataHeader, DataDesc, DateElement, SelectElement,
  ShowElement, EmptyList, SelectedElements, SelectedItem, SelectedCloseItem
};
