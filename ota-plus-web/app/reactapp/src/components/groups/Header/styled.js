import styled from 'styled-components';

export const ModalTitleWrapper = styled.div`
  .modal-close {
    cursor: pointer;
    position: absolute;
    top: 20px;
    right: 20px;
  }
`;

export const ModalTitle = styled.h2`
  font-size: 22px;
  font-weight: bold;
  letter-spacing: 0;
  line-height: 30px;
  margin: 0;
  color: ${({ theme }) => theme.palette.texts.black};
`;

export const CDFListHeader = styled.div`
  background-color: ${({ theme }) => theme.palette.headerGrey};
  height: 30px;
  margin: 0 40px;
  padding: 0 40px;
  & > span {
    color: ${({ theme }) => theme.palette.texts.dark};
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0;
    line-height: 30px;
    display: block;
  }
`;

export const CDFList = styled.div`
  max-height: 390px;
  overflow-y: auto;
  border-bottom: 1px solid ${({ theme }) => theme.palette.borderLight};
  #save-name-btn {
    opacity: ${({ isError }) => isError && 0.5};
  }
  & > div {
    margin: 0 40px;
    padding: 0 20px 0 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    :not(:last-child) {
      border-bottom: 1px solid ${({ theme }) => theme.palette.borderLight};
    }
    & > span {
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

export const CDFFooter = styled.div`
  padding: 0 40px;
  height: 100px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

export const InputWrapper = styled.div`
  position: relative;
  height: 40px;
  left: -14px;
  width: 100%;
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
