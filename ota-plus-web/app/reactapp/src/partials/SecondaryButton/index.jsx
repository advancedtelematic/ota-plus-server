import styled from 'styled-components';
import Button from '../Button';

export default styled(Button)`
  display: flex;
  align-items: center;
  padding: 0;
  font-weight: 500;
  height: 36px;
  min-width: 100px;
  span {
    font-size: 0.88em;
    letter-spacing: 0.01px;
  }
  img {
    transition: all .3s ease-out;
  }
  :hover {
    img {
      filter: brightness(1.2);
    }
  }  
`;
