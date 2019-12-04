import styled from 'styled-components';
import { Steps } from 'antd';

const AntStep = Steps.Step;

const CardsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 52px 10px 10px 10px;
  border-radius: 1px;
`;

const Step = styled(AntStep)`
  margin-right: 0 !important;
  .ant-steps-item-icon {
    margin-right: 0;
    width: 48px;
    height: 48px;
    border: 1px solid #12E4D6;
    background-color: #1B222C;
    span {
      font-size: 1.38em;
      font-weight: 400;
      top: 8px;
      color: rgba(255,255,255,0.6) !important;
    }
  }
`;

const StepperWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #3F454D;
  position: relative;
`;

const Stepper = styled(Steps)`
  position: absolute;
  top: -24px;
  right: 0;
  left: 0;
  margin: 0 auto;
  padding: 0 8.9%;
  @media only screen and (min-width: 1810px) {
    padding: 0 156px;
  }
  min-width: calc(100% - 220px);
  .ant-steps-item-title::after {
    height: 0;
  }
  .ant-steps-item-done .ant-steps-icon {
    color: #fff !important;
  }
  .ant-steps-item-wait .ant-steps-item-icon {
    border-color: rgba(18,228,214,0.4);
  }
  .ant-steps-item-process .ant-steps-item-icon {
    background: #12E4D6;
    .ant-steps-icon {
      color: #1B222C !important;
    }
  }
`;

export { CardsWrapper, Step, Stepper, StepperWrapper };
