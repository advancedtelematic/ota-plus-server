import styled from 'styled-components';
import { Steps } from 'antd';

const { Step: AntStep } = Steps;

const CardsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Step = styled(AntStep)`
  margin-right: 8px !important;
  :last-child {
    margin-right: 0 !important;
    .ant-steps-item-icon {
      margin-right: 0;
    }
  }
  .ant-steps-item-icon {
    width: 40px;
    height: 40px;
    font-size: 14px;
    border: 1px solid #DCDFE3;
    span {
      font-size: 1.43em;
      font-weight: 500;
      top: 5px;
      color: ${({ theme }) => theme.palette.texts.lightGrey} !important;
    }
  }
`;

const StepperWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Stepper = styled(Steps)`
  margin-bottom: 10px;
  padding: 0 94px;
  .ant-steps-item-title::after {
    height: 2px;
    left: 0;
    top: 19px;
    box-sizing: border-box;
    border: 1.5px dashed #DBDCDE;
    background-color: transparent !important;
  }
  .ant-steps-item-process .ant-steps-item-icon  {
    background: ${({ theme }) => theme.palette.white};
    border: 1px solid ${({ theme }) => theme.palette.primary};
  }
`;

export { CardsWrapper, Step, Stepper, StepperWrapper };
