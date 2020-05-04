import styled from 'styled-components';

export default styled.span`
  display: flex;
  opacity: 0.8;
  color: ${({ theme }) => theme.palette.white};
  font-weight: 300;
  a {
    margin: 0 0 0 4px;
  }
`;
