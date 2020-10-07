import styled from 'styled-components';

export const SplitContainer = styled.div`
  padding: 30px 24px 0 0;
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
  padding-right: 16px;
  overflow-y: auto;
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
    transform: scaleX(-1);
  }
  &, :hover {
    background-color: ${({ theme }) => theme.palette.headerGrey};
  }
`;

export const FeatureBlock = styled.div`
  padding: 0 24px;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0;
  line-height: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.palette.borderLight};
  .ant-checkbox-inner {
    width: 18px;
    height: 18px;
    border-radius: 2px;
    &, :active, :focus {
      border: 2px solid ${({ theme }) => theme.palette.lightGrey} !important;
    }
    ::after {
      width: 7.714286px;
      height: 12.142857px;
      transform: rotate(45deg) scale(1) translate(-55%,-55%);
    }
  }
  .ant-checkbox-disabled {
    opacity: 0.4;
  }
  .ant-checkbox-checked {
    .ant-checkbox-inner {
      border: none !important;
      ::after {
        border-color: ${({ theme }) => theme.palette.white};
      }
    }
  }
`;
