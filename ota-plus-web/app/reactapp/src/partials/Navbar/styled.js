import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { SIZES } from '../../constants/styleConstants';

export const BetaTag = styled.div`
  width: 28px;
  height: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 2px;
  font-size: 0.58em;
  font-weight: 600;
  background-color: ${({ theme }) => theme.palette.primary};
  color: ${({ theme }) => theme.palette.white};
  margin-left: 8px;
`;

export const NavContainer = styled.nav`
  height: ${SIZES.NAVBAR_HEIGHT};
  background-color: ${({ theme }) => theme.palette.secondary};
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 999;
  padding: 0 30.5px;
`;

export const LogoContainer = styled.div`
  height: inherit;
  display: flex;
  align-items: center;
`;

export const Logo = styled.div`
  background: url(/assets/img/HERE_Logo_2016.png) no-repeat;
  background-size: contain;
  background-position-y: center;
  width: 32px;
  height: 28px;
`;

export const AppName = styled.span`
  font-size: 1.24em;
  font-weight: bold;
  margin: 0 50px 0 10px;
  padding-left: 11px;
  color: ${({ theme }) => theme.palette.white};
  border-left: 1px solid ${({ theme }) => theme.palette.lightGrey};
`;

export const Ul = styled.ul`
  display: flex;
  margin-bottom: 0;
`;

export const Li = styled.li`
  align-items: center;
  justify-content: center;
  align-items: center;
  display: flex;
  height: ${SIZES.NAVBAR_HEIGHT};
`;

export const Link = styled(NavLink)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: inherit;
  text-decoration: none;
  font-size: 1.24em;
  color: ${({ theme }) => theme.palette.whiteTranslucent};
  padding: 0 14px;
  :hover {
    background-color: ${({ theme }) => theme.palette.secondaryTranslucent};
    color: ${({ theme }) => theme.palette.whiteTranslucent};
  }
`;

export const SettingsContainer = styled.div`
  height: inherit;
  margin-left: auto;
  display: flex;
  align-items: center;
  border-left: 1px solid ${({ theme }) => theme.palette.lightGrey};
  padding-left: 20px;
  & > div:not(:last-child) {
      margin-right: 15px;
  }
`;
