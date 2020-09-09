import styled from 'styled-components';

export const SplitContainer = styled.div`
  padding: 30px 40px 0 0;
  background-color: ${({ theme }) => theme.palette.white};
  display: flex;
  height: calc(100vh - 276px);
`;

export const Sidepanel = styled.div`
  width: 330px;
`;

export const ContentWrapper = styled.div`
  flex: 1;
  padding-left: 30px;
  & > h2 {
    font-size: 22px;
    line-height: 30px;
    margin-bottom: 10px;
  }
  & > div:first-of-type {
    font-weight: 400;
    font-size: 13px;
    letter-spacing: 0;
    line-height: 15px;
    margin-bottom: 30px;
  }
`;

export const FeaturesListHeader = styled.div`
  padding: 0 20px;
  height: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${({ theme }) => theme.palette.texts.darkGrey};
  font-weight: 500;
  & > img {
    width: 24px;
    height: 24px;
    opacity: 0.6;
  }
  &, :hover {
    background-color: ${({ theme }) => theme.palette.headerGrey};
  }
`;
