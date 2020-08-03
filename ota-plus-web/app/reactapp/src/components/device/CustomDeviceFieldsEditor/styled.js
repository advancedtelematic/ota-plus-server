import styled from 'styled-components';

export const Container = styled.div`
  height: calc(100% - 100px);
  background-color: ${({ theme }) => theme.palette.white};
  padding: 30px 68px 30px 30px;
  overflow-y: auto;
`;

export const CDFListHeader = styled.div`
  display: flex;
  background-color: ${({ theme }) => theme.palette.headerGrey};
  height: 30px;
  padding: 0 44px 0 40px;
  & > span {
    flex: 1;
    color: ${({ theme }) => theme.palette.texts.dark};
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0;
    line-height: 30px;
  }
`;

export const CDFList = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.palette.borderLight};
  #save-name-btn {
    opacity: ${({ isError }) => isError && 0.5};
  }
  & > div {
    padding: 0 20px 0 40px;
    display: flex;
    align-items: center;
    height: 50px;
    :not(:last-child) {
      border-bottom: 1px solid ${({ theme }) => theme.palette.borderLight};
    }
    & > span {
      flex: 1;
      font-size: 13px;
      font-weight: 500;
      letter-spacing: 0;
      line-height: 20px;
    }
    .cdf-edit-name {
      opacity: 0.6;
      background: url(/assets/img/new-app/24/LUI-icon-pd-edit-outline-24.svg);
      cursor: pointer;
      width: 22px;
      height: 22px;
      :hover {
        background: url(/assets/img/new-app/24/LUI-icon-pd-edit-solid-24.svg);
      }
    }
    & > div {
      & > img {
        opacity: 0.8;
        cursor: pointer;
        width: 22px;
        height: 22px;
      }
    }
  }
`;

export const InputWrapper = styled.div`
  position: relative;
  height: 40px;
  left: -14px;
  flex: 1;
  input {
    height: 40px;
    border: 1px solid rgba(35,52,89,0.35);
    border-radius: 2px;
    font-size: 16px !important;
  }
  & > img {
    position: absolute;
    right: 16px;
    top: 10px;
  }
`;

export const NoCDFWrapper = styled.div`
  margin-top: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  & > img {
    margin-bottom: 40px;
  }
  & > button {
    margin-top: 16px;
    font-size: 14px;
    & > img {
      margin-right: 2px;
      padding-bottom: 2px;
    }
  }
`;

export const NoCDFPrimaryText = styled.div`
  font-size: 14px;
  line-height: 20px;
`;

export const NoCDFSecondaryText = styled.div`
  height: 18px;
  font-size: 13px;
  letter-spacing: 0;
  line-height: 18px;
`;
