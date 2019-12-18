import styled from 'styled-components';
import { Icon as AntdIcon } from 'antd';

export const GridContainer = styled.div`
  display: flex;
`;

export const HomeWrapper = styled.div`
  width: 100%;
  padding: 54px 30px 30px 30px;
`;

export const LoadingIcon = styled(AntdIcon)`
  font-size: 56px;
  position: absolute;
  top: 200px;
  left: calc(50% - 28px);
  color: ${({ theme }) => theme.palette.primary};
`;
