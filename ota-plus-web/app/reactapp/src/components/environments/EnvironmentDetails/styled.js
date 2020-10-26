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

export const FeatureListBlock = styled.div`
  position: relative;
  padding: 0 20px;
  display: flex;
  align-items: center;
  font-weight: 500;
  & > span {
    :nth-child(1) {
      width: 20%;
    }
    :nth-child(2) {
      width: 40%;
    }
    :nth-child(3) {
      width: 40%;
    }
  }
`;

export const FeaturesListHeader = styled(FeatureListBlock)`
  height: 30px;
  color: ${({ theme }) => theme.palette.texts.darkGrey};
  & > img {
    width: 24px;
    height: 24px;
    position: absolute;
    right: 20px;
    cursor: pointer;
  }
  &, :hover {
    background-color: ${({ theme }) => theme.palette.headerGrey};
  }
`;

export const FeatureCategoryBlock = styled.div`
  height: 34px;
  padding-left: 26px;
  line-height: 34px;
  font-size: 13px;
  font-weight: 500;
  background-color: #F7F8F8;
`;

export const FeatureBlock = styled(FeatureListBlock)`
  height: 50px;
  font-size: 13px;
  letter-spacing: 0;
  line-height: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.palette.borderLight};
  a {
    text-decoration: underline;
    color: ${({ theme }) => theme.palette.primaryDarkened};
  }
  .ant-checkbox-wrapper {
    position: absolute;
    right: 20px;
  }
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
