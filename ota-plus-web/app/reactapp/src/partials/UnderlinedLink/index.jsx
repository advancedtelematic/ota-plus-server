import styled from 'styled-components';
import { ExternalLink } from '..';

export default styled(ExternalLink)`
  text-decoration: underline;
  && {
    font-weight: 300;
    font-size: 1em;
  }
  :hover {
    text-decoration: none;
  }
`;
