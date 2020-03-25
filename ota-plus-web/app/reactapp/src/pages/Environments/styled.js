/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import { SIZES } from '../../constants/styleConstants';

export const EnvListWrapper = styled.div`
  padding: 30px;
  background-color: ${({ theme }) => theme.palette.white};
  min-height: ${SIZES.PAGE_WITH_HEADER_HEIGHT};
`;
