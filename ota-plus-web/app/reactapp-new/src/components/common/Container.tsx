import styled, { DefaultTheme } from 'styled-components';

type Props = {
  elevation?: number,
  rounded?: boolean,
  theme: DefaultTheme
};

export default styled.div<Props>(({ elevation = 1, rounded = true, theme }: Props) => ({
  padding: '20px',
  backgroundColor: theme.palette.white,
  borderRadius: rounded ? '5px' : 0,
  boxShadow: `0 2px 4px 0 rgba(15,22,33,${0.05 * elevation})`
}));
