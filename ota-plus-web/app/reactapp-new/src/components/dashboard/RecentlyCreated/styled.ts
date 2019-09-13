import styled, {DefaultTheme} from 'styled-components';
import { Icon } from '../../common';

type ElementProps = {
  disabled?: boolean;
  theme: DefaultTheme;
};

const StyledIcon = styled(Icon)`
  width: 1.25em;
`;

const StyledSelectIcon = styled(Icon)`
  width: 0.75em;
  margin-right: 0.31em;
  margin-top: -0.19em;
`;

const DataHeader = styled.div`
  font-size: 1em;
  font-weight: 500;
`;
const DataDesc = styled.div`
  color: ${({ theme }) => theme.palette.lightGrey};
  font-size: 0.81em;
  font-weight: 300;
`;
const DateElement = styled.div`
  font-size: 1em;
`;

const SelectElement = styled.div`
  margin: 0 0 0.94em 0;
`;

const ShowElement = styled.span<ElementProps>`
  color: ${({ disabled = false, theme }) => !disabled ? theme.palette.lightGrey : theme.palette.disabledText };
  display: inline-block;
  float: left;
  font-size: 0.91em;
  font-weight: 600;
  line-height: 3.1em;
  margin-right: 0.5em;
`;

const EmptyList = styled.div`
  color: ${({ theme }) => theme.palette.lightGrey};
  font-size: 0.91em;
  font-weight: 400;
  line-height: 1.5em;
  margin-right: 0.5em
  width: 75%;
`;

const SelectedElements = styled.div`
  margin: 0 0 0.94em 0;
`;

const SelectedItem = styled.span`
  border: ${({ theme }) => `1px solid ${theme.palette.lightGrey}`};
  border-radius: 1.25em;
  color: ${({ theme }) => theme.palette.lightGrey};
  display: inline-block;
  font-size: 0.81em;
  margin-right: 0.63em;
  padding: 0.13em 0.63em;
`;

const SelectedCloseItem = styled(Icon)`
  cursor: pointer;
  margin-left: 0.25em;
  margin-top: 0.13em;
  width: 1em;
`;

export {
  StyledIcon, StyledSelectIcon, DataHeader, DataDesc, DateElement, SelectElement,
  ShowElement, EmptyList, SelectedElements, SelectedItem, SelectedCloseItem
};
