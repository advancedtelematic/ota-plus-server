import styled from 'styled-components';

export const FlexCenter = styled.div`
  display: flex;
  align-items: center;
`;

export const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 110px;
  width: 100vw;
  padding: 0 30px;
  background-color: ${({ theme }) => theme.palette.backgroundLight};
  #button-create-env {
    min-width: 200px;
    width: auto;
  }
`;
