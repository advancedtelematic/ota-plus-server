import styled from 'styled-components';

export default styled.footer`
  height: 50px;
  background-color: ${({ theme }) => theme.palette.secondary};
  box-shadow: ${({ theme }) => theme.shadows.upwards};
`;
