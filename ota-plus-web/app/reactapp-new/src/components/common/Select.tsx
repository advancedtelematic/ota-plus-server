import React, { ReactElement, useState } from 'react';
import { Menu, Dropdown } from 'antd';
import { Checkbox } from './';
import styled, { DefaultTheme } from 'styled-components';
import { useTranslation, UseTranslationResponse } from 'react-i18next';

type SelectOptions = {
  value: string;
  row: () => ReactElement;
};

type Props = {
  className?: string
  options: SelectOptions[],
  selected?: string[],
  disabled?: boolean,
  multiple?: boolean,
  onSelect?: (p: string[]) => void,
  dropdownWidth?: number | string,
  width?: number | string,
  placeholder?: string
};

type StyledProps = {
  dropdownwidth?: number | string,
  width?: number | string;
  disabled?: boolean;
  theme: DefaultTheme;
};

const disabledState = (disabled: boolean, theme: DefaultTheme) => {
  const variants: Record<string, Record<string, any>> = {
    enabled: {
      backgroundColor: theme.palette.white,
      boxShadow: theme.shadows.light,
      border: '0px',
      color: theme.palette.texts.black,
      cursor: 'pointer'
    },
    disabled: {
      backgroundColor: theme.palette.disabled,
      boxShadow: 'none',
      border: `1px solid ${theme.palette.disabledBorder}`,
      color: theme.palette.disabledText,
      cursor: 'no-drop'
    }
  };
  return !disabled ? variants.enabled : variants.disabled;
};

const StyledMenu = styled(Menu)<StyledProps>`
  border-radius: 0;
  box-shadow: ${({ theme }) => `${theme.shadows.light}`};
  margin-top: -0.19em;
  font-size: 1em;
  width: ${({ dropdownwidth }) => `${dropdownwidth || '100%'}`};
  padding: 0;
`;
const StyledMenuItem = styled(Menu.Item)<StyledProps>`
  border-bottom: ${({ theme }) => `1px solid ${theme.palette.accents.dark}`};
  padding: 0.56em 0.62em;
  &.ant-dropdown-menu-item-active {
    background-color: ${({ theme }) => `${theme.palette.white}`};
  }
`;
const StyledSelection = styled.div<StyledProps>(({ theme, disabled = false, width = '100%' }: StyledProps) => ({
  ...disabledState(disabled, theme),
  display: 'inline-block',
  fontSize: '1em',
  fontWeight: 400,
  overflow: 'hidden',
  padding: '0.6em 0.62em',
  width: `${width}`
}));

const Select = (
  {
    options,
    selected = [],
    multiple = false,
    disabled = false,
    onSelect,
    dropdownWidth,
    width,
    placeholder
  }: Props) => {
  const [state, setState] = useState<{ selected: string[], visible: boolean }>({ selected, visible: false });
  const { t }: UseTranslationResponse = useTranslation();

  // on item click, select option
  const handleOnClick = ({ key }: { key: string}) => {
    let { selected } = state;
    const property = selected.indexOf(key);
    if (multiple) {
      // multi selection
      if (property !== -1) {
        selected.splice(property, 1);
      } else {
        selected.push(key);
      }
    } else {
      // single selection
      selected = [key];
    }
    setState({ ...state, selected });
    // trigger upstream event
    onSelect && onSelect(selected);
  };

  // to keep dropdown visible after making selection
  const handleVisibleChange = (flag : boolean) => {
    setState({ ...state, visible: flag });
  };

  const displaySelected = () => {
    const { selected } = state;
    if (!selected.length) {
      return placeholder || t('select.default.option');
    }
    return `${selected.length} ${t('select.default.selected')}`;
  };

  const menu = (
    <StyledMenu multiple={true} onClick={handleOnClick} dropdownwidth={dropdownWidth}>
      {options.map(({ value, row }) => (
          <StyledMenuItem key={value}>
            <Checkbox checked={(state.selected.indexOf(value) !== -1)}/>
            {row()}
          </StyledMenuItem>
      ))}
    </StyledMenu>
  );

  // TODO: add open/close icon
  return (
    <Dropdown
      disabled={disabled}
      overlay={menu}
      onVisibleChange={handleVisibleChange}
      trigger={['click']}
      visible={state.visible}
    >
      <StyledSelection width={width} disabled={disabled}>{displaySelected()}</StyledSelection>
    </Dropdown>
  );
};

export default Select;
