import styled from 'styled-components';

export default styled.header`
  height: 50px;
  background-color: ${({ theme }) => theme.palette.secondary};
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
`;
