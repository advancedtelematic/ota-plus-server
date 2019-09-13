import styled from 'styled-components';
import { Icon } from '../../common';

const Description = styled.div`
  color: ${({ theme }) => theme.palette.texts.black};
  font-size: 0.93em;
  line-height: 24px;
  padding-right: 40px;
`;

const List = styled.ul`
  list-style: none;
  margin: 1em 0 0 0;
  padding: 0;
`;

const ListItem = styled.li`
  margin: 0.3em 0 0 0;
  height: 35px;
  display: flex;
  align-items: center;
  a {
    line-height: 20px;
  }
`;

const StyledIcon = styled(Icon)`
  width: 16px;
  margin-right: 10px;
`;

export { Description, List, ListItem, StyledIcon };
