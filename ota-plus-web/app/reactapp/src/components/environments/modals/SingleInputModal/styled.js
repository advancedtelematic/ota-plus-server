import styled from 'styled-components';
import { ModalContainer as ModalContainerShared, Title as TitleShared } from '../sharedStyled';

export const Description = styled.div`
  color: ${({ theme }) => theme.palette.texts.darkGrey};
  font-size: 1em;
  line-height: 24px;
  font-weight: 400;
`;

export const ModalContainer = styled(ModalContainerShared)`
  height: ${({ height }) => height || '300px'};
  top: 200px;
`;

export const Title = styled(TitleShared)`
  margin-bottom: 34px;
`;
