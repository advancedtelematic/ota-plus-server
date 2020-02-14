import styled from 'styled-components';

export const Avatar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid ${({ theme, isActive }) => isActive ? theme.palette.lightGreen : theme.palette.whiteTranslucent};
  color: ${({ theme }) => theme.palette.whiteTranslucent};
  background-color: ${({ theme }) => theme.palette.secondaryTranslucent};
  :hover {
    border: 1px solid ${({ theme }) => theme.palette.white};
  }
`;

export const BetaTag = styled.span`
  width: 28px;
  line-height: 10px;
  height: 10px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 2px;
  font-size: 0.65em;
  font-weight: 600;
  background-color: ${({ theme }) => theme.palette.primary};
  color: ${({ theme }) => theme.palette.white};
`;

export const DrawerHeader = styled.div`
  padding: 21px 30px;
  background-color: rgba(15,22,33,0.03);
  display: flex;
  flex-direction: column;
  & > h1 {
    margin-bottom: 0;
  }
  & > div {
    display: flex;
    align-items: center;
  }
  & > div > span:not(:last-child) {
    font-size: 0.93em;
    font-weight: 400;
    letter-spacing: 0.1px;
    line-height: 18px;
    color: rgba(15,22,33,0.6);
    margin-right: 5px;
  }
`;

export const LinksContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const LinkContent = styled.div`
  color: ${({ theme }) => theme.palette.texts.black};
  display: flex;
  border-bottom: 1px solid rgba(15,22,33,0.05);
  padding: 25px 30px;
  &:hover {
    background-color: rgba(15,22,33,0.05);
  }
  h1 {
    font-weight: 500;
    margin-bottom: 0;
  }
  ${BetaTag} {
    margin-left: 5px;
  }
`;

export const OrganizationName = styled.span`
  width: inherit;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Signout = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  left: 0;
  bottom: 80px;
  height: 70px;
  width: 100%;
  border-top: 1px solid rgba(15,22,33,0.15);
  padding: 25px 30px;
  h1 {
    font-weight: 500;
    margin: 0;
  }
`;

export const SignoutIcon = styled.img`
  margin-right: 10px;
  width: 20px;
  height: 20px;
`;
