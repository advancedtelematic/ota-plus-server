import styled from 'styled-components';

export const Support = styled.div`
  background: url(/assets/img/new-app/24/help-solid-active-24.svg) no-repeat;
  background-size: contain;
  background-position-y: center;
  width: 24px;
  height: inherit;
  opacity: ${({ isActive }) => isActive ? 1 : 0.6};
  :hover, :focus {
    opacity: 1;
  }
`;

export const SidebarHeader = styled.div`
  height: 80px;
  padding: 20px 30px;
  background-color: rgba(15,22,33,0.03);
  display: flex;
  align-items: center;
  & > h1 {
    margin: 0 0 0 10px;
  }
`;

export const HelpIcon = styled.img`
  width: 24px;
  height: 24px;
  opacity: 0.8;
`;

export const LinksContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 36px 30px;
  a {
    line-height: 49px;
    font-size: 1.15em;
    font-weight: 500;
    color: ${({ theme }) => theme.palette.texts.black};
    :hover {
      opacity: .8;
    }
  }
`;
