/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import { Tabs } from 'antd';
import { SIZES } from '../../../constants/styleConstants';

export const StyledTabs = styled(Tabs)`
  min-height: ${SIZES.PAGE_WITH_HEADER_HEIGHT};
  background-color: ${({ theme }) => theme.palette.white};
  .ant-tabs-bar {
    padding-left: 30px;
    background-color: ${({ theme }) => theme.palette.backgroundLight};
    border-bottom: none;
    margin: 0;
  }
  .ant-tabs-tab {
    height: 40px;
    font-size: 16px;
    background-color: ${({ theme }) => theme.palette.white};
    border-radius: 3px 3px 0 0;
    padding: 10px 20px;
    line-height: 20px;
    &, :hover {
      color: ${({ theme }) => theme.palette.texts.black};
    }
  }
  .ant-tabs-ink-bar {
    bottom: 5px;
    height: 3px;
    background-color: ${({ theme }) => theme.palette.primaryDarkened};
    width: 87px !important;
    margin-left: 10px;
  }
  .ant-tabs-tabpane {
    padding: 30px;
  }
`;
