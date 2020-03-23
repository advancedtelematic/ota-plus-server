import styled from 'styled-components';
import { SIZES } from '../../constants/styleConstants';

export const SubNavBarContainer = styled.div(({ lightMode, theme }) => ({
  height: `${SIZES.SUBNAVBAR_HEIGHT}px`,
  display: 'flex',
  alignItems: 'center',
  borderBottom: `1px solid ${lightMode ? theme.palette.borderLight : theme.palette.whiteAlpha02}`,
  position: 'sticky',
  top: 0,
  zIndex: 999,
  padding: '0 10px 0 30px',
  backgroundColor: lightMode ? theme.palette.backgroundLight : theme.palette.backgroundPrimary,
  '& > div > span': {
    color: theme.palette.texts.black,
    fontWeight: 400,
    letterSpacing: '0.05px'
  }
}));

export const BackButton = styled.div`
  color: ${({ theme }) => theme.palette.primaryLight};
  font-weight: 400;
  cursor: pointer;
  ::before {
    content: '← ';
  }
`;

export const EnvironmentContainer = styled.div`
  height: inherit;
  margin-left: auto;
  display: flex;
  align-items: center;
`;

export const EnvironmentTitle = styled.div(({ lightMode, theme }) => ({
  color: lightMode ? theme.palette.secondaryTranslucent : theme.palette.whiteAlpha04,
  fontSize: '13px',
  fontWeight: '500',
  lineHeight: '16px',
}));
