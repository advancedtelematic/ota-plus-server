import styled, { css } from 'styled-components';
import { Button, OTAModal } from '../../../../../../partials';

export const StyledOTAModal = styled(OTAModal)`
  .ant-modal-content {
    border-radius: 3px;
    padding: 30px 0;
    width: 818px;
    .ant-modal-header {
      border-bottom: none;
      padding: 12px 0 8px !important;
      margin: 0 40px !important;
      img {
        position: absolute;
        top: 23px;
        right: 23px;
        cursor: pointer;
      }
    }
    .ant-modal-body {
      padding: 0;
      #smart-create-step2 {
        & > p {
          padding: 0 40px;
          margin-bottom: 20px;
          color: ${({ theme }) => theme.palette.secondaryTranslucent};
          font-size: 13px;
          font-style: italic;
          letter-spacing: -0.02px;
          line-height: 20px;
          a {
            color: #3E9EFF;
          }
        }
        input {
          font-size: 16px !important;
          padding: 10px 26px 10px 8px;
        }
      } 
      .c-form__select-icon {
        font-size: 21px;
        color: inherit;
        margin-top: -11px;
        right: 8px;
      }
    }
  }
`;

export const ModalTitle = styled.div`
  font-size: 22px;
  font-weight: 700;
  line-height: 30px;
  color: ${({ theme }) => theme.palette.texts.black};
`;

export const FieldLabel = styled.div`
  color: ${({ theme }) => theme.palette.texts.black};
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0;
  line-height: 30px;
`;

export const NameFieldWrapper = styled.div`
  padding: 0 40px;
  & > input {
    margin-top: 8px;
    box-sizing: border-box;
    height: 40px;
    border: 1px solid rgba(35,52,89,0.35);
    border-radius: 2px;
    font-size: 16px !important;
  }
`;

export const FiltersHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  margin: 20px 0 10px;
  height: 40px;
`;

export const AddFilterButton = styled(Button)`
  height: 40px;
  font-size: 16px;
  min-width: 142px;
  line-height: 38px;
  padding: 0 18px;
  display: flex;
  align-items: center;
  & > img {
    width: 28px;
    height: 28px;
    margin-right: 4px;
  }
`;

export const RemoveClusterButton = styled(Button)`
  height: 40px;
  font-size: 16px;
  min-width: 132px;
  line-height: 38px;
  padding: 0 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  &, &:hover, &:focus {
    border: 1px solid #CF001A;
    color: ${({ theme }) => theme.palette.error};
  }
`;

const customSbStyles = css`
  &::-webkit-scrollbar {
    width: 10px;
  }
  &::-webkit-scrollbar-track {
    background: #D8D8D8;
  }
  &::-webkit-scrollbar-thumb {
    background: #BAB9B9;
  }
`;

export const FiltersContainer = styled.div`
  max-height: ${({ maxHeight }) => maxHeight};
  padding: 10px 24px;
  overflow-y: auto;
  background-color: #F7F8F8;
  ${customSbStyles};
`;

export const FiltersCluster = styled.div`
  border-radius: 4px;
  background-color: #FFFFFF;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,0.15);
  padding: 16px 16px 10px;
  margin-bottom: 8px;
`;

export const ClusterHeader = styled.div`
  height: 40px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  & > div:last-child {
    display: flex;
    #filter-minus, #cluster-minus {
      width: 40px;
      margin-left: 16px;
    }
  }
`;

export const FilterRow = styled.div`
  display: flex;
  margin-bottom: 8px;
  input {
    height: 40px;
    border: 1px solid rgba(35,52,89,0.35);
    border-radius: 2px;
    background-color: ${({ theme }) => theme.palette.white};
    padding-left: 8px;
  }
  & > div {
    max-height: 40px;
    :not(:last-of-type) {
      margin-right: 16px;
    }
    :nth-child(4) {
      min-width: 40px;
      max-width: 40px;
    }
  }
`;

export const FilterRowHeader = styled.div`
  display: flex;
  margin-bottom: 8px;
  & > div {
    max-height: 40px;
    :not(:last-of-type) {
      margin-right: 16px;
    }
    :nth-child(1) {
      width: 230px;
    }
    :nth-child(2) {
      width: 234px;
    }
    :nth-child(3) {
      width: 186px;
    }
  }
`;

export const DeviceFieldWrapper = styled.div`
  width: 230px;
`;

export const FilterTypeFieldWrapper = styled.div`
  width: 234px;
`;

export const ValueFieldWrapper = styled.div`
  width: 186px;
`;

export const FilterColumnHeader = styled.div`
  color: rgba(30,43,70,0.6);
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0;
  line-height: 15px;
`;

export const TargetedDevicesHint = styled.div`
  width: 100%;
  color: ${({ theme }) => theme.palette.secondaryTranslucent};
  font-size: 13px;
  font-style: italic;
  height: 20px;
  padding: 0 40px;
  margin-top: 18px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  & > div {
    line-height: 20px;
  }
  & > div:last-child {
    margin-left: 5px;
    color: ${({ theme }) => theme.palette.texts.black};
    font-size: 16px;
    font-weight: bold;
    font-style: normal;
  }
`;

export const ButtonsWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding: 25px 40px 0;
`;


export const StyledButton = styled(Button)`
  min-width: 160px;
  width: 160px;
  height: 40px;
  font-size: 16px;
  margin-left: 20px;
`;

export const RemoveFilterButton = styled.div`
  border: 1px solid #CF001A;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  img {
    width: 14px;
    height: 14px;
  }
`;

export const DoubleFieldWrapper = styled.div`
  display: flex;
  & > div:first-child {
    margin-right: 16px;
    width: 42px;
    input {
      padding: 0 0 0 8px !important;
    }
  }
  & > div:last-child {
    width: 128px;
  }
`;
