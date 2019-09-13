import styled from 'styled-components';
import { Checkbox } from 'antd';

export default styled(Checkbox)`
  margin-right: 10px;
  .ant-checkbox-checked .ant-checkbox-inner,
  .ant-checkbox-input:focus + .ant-checkbox-inner,
  .ant-checkbox .ant-checkbox-inner {
    border-color: ${({ theme }) => `${theme.palette.accents.light}`};
    background-color: ${({ theme }) => `${theme.palette.white}`};
    border-radius: 0;
  }
  .ant-checkbox::after,
  .ant-checkbox:hover::after {
    visibility: hidden !important;
  }
  .ant-checkbox.ant-checkbox-checked .ant-checkbox-inner:hover,
  .ant-checkbox .ant-checkbox-inner:hover {
    border-radius: 0;
    border: ${({ theme }) => `1px solid ${theme.palette.accents.light}`};
  }
  .ant-checkbox-checked .ant-checkbox-inner::after {
    border: ${({ theme }) => `2px solid ${theme.palette.primary}`};
    border-top: 0;
    border-left: 0;
    -webkit-transform: rotate(45deg) scale(1) translate(-50%, -50%);
    -ms-transform: rotate(45deg) scale(1) translate(-50%, -50%);
    transform: rotate(45deg) scale(1) translate(-50%, -50%);
    opacity: 1;
    -webkit-transition: all 0.2s cubic-bezier(0.12, 0.4, 0.29, 1.46) 0.1s;
    transition: all 0.2s cubic-bezier(0.12, 0.4, 0.29, 1.46) 0.1s;
    content: ' ';
  }
`;
