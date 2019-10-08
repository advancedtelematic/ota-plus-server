import React, { ReactElement } from 'react';
import styled, { DefaultTheme } from 'styled-components';
import { get } from 'lodash';
import { RequireAtLeastOne } from '../../utils/types';

type IdUuidProps = {
  id?: string;
  uuid?: string;
};

type ItemProps = RequireAtLeastOne<IdUuidProps, 'id' | 'uuid'>;

type ListCell<T> = {
  title: string | (() => ReactElement);
  row?: ((p: T) => ReactElement);
  dataIndex?: string;
  width?: number;
  textPosition?: string;
};

type ListInterface<T> = {
  items: T[];
  columns: ListCell<T>[];
  headerTheme?: string;
  onCellClick?: (p: any) => void;
  onRowClick?: (p: T) => void;
};

type Props = {
  width?: number | string;
  headerTheme?: string;
  textPosition?: string;
  theme: DefaultTheme;
};

// header variants light with underline or with dark background
const headerVariants = (selected: string, theme: DefaultTheme) => {
  const variants: Record<string, Record<string, any>> = {
    dark: {
      backgroundColor: theme.palette.accents.light,
      td: {
        padding: '0.31em 0'
      }
    },
    light: {
      fontWeight: 700,
      borderBottom: `1px solid ${theme.palette.accents.dark}`,
      td: {
        padding: '0.75em 0'
      }
    }
  };
  return variants[selected];
};
// cell positioning variants, default is vertically centered and text aligned to left
const cellVariants: Record<string, Record<string, any>> = {
  top: {
    verticalAlign: 'top',
    textAlign: 'left'
  },
  centeredTop: {
    verticalAlign: 'top',
    textAlign: 'center'
  },
  centered: {
    textAlign: 'center'
  },
  default: {}
};

const Table = styled.table`
  font-size: 1em;
  width: 100%;
`;

const HeaderRow = styled.tr<Props>(({ theme, headerTheme = 'light' }: Props) => ({
  ...headerVariants(headerTheme, theme)
}));

const HeaderCell = styled.td<Props>`
  color: ${({ theme }) => theme.palette.texts.black};
  width: ${({ width }) => `${width}%`};
`;

const DataRow = styled.tr<Props>`
  border-bottom: ${({ theme }) => `1px solid ${theme.palette.disabledBorder}`};
`;

const Cell = styled.td<Props>(({ theme, width, textPosition = 'default' }: Props) => ({
  ...cellVariants[textPosition],
  color: theme.palette.texts.black,
  padding: '0.94em 0',
  width: `${width}%`
}));

// calculates widths for each cell into percentages
const calculateWidths = <T extends {}>(columns: ListCell<T>[]): string[] => {
  const totalWidth = columns.reduce((sum: number, col: ListCell<T>) => sum + (col.width || 100), 0);
  return columns.reduce(
    (sums: string[], col: ListCell<T>) => {
      const percentage = (col.width || 100) * 100 / totalWidth;
      sums.push((percentage.toFixed(2)));
      return sums;
    },
    []);
};

const List = <T extends ItemProps>(props: ListInterface<T>): ReactElement => {
  const { items, columns, onCellClick, onRowClick, headerTheme = 'light' } = props;
  const widths: string[] = calculateWidths<T>(columns);
  return (
    <>
      <Table>
        <thead>
          <HeaderRow headerTheme={headerTheme}>
            {columns.map(({ title }, index) =>
              <HeaderCell
                key={`header-${index}-key`}
                width={widths[index]}
              >
                {(typeof title === 'function') ? title() : title}
              </HeaderCell>
            )}
          </HeaderRow>
        </thead>
        <tbody>
          {items.map((item: T) =>
            <DataRow key={`row-${item.id || item.uuid}`} onClick={() => onRowClick && onRowClick(item)}>
              {columns.map(
                ({ row, dataIndex = '', textPosition }: ListCell<T>, index) =>
                  <Cell
                    onClick={() => onCellClick && onCellClick(item)}
                    key={`cell-${index}-${item.id || item.uuid}`}
                    textPosition={textPosition}
                    width={widths[index]}
                  >
                    {typeof row === 'function' ? row(item) : get(item, dataIndex)}
                  </Cell>
              )}
            </DataRow>
          )}
        </tbody>
      </Table>
    </>
  );
};

export default List;
