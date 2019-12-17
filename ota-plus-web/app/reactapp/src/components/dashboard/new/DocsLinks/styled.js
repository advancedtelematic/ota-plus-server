import styled from 'styled-components';

const Description = styled.div`
  height: 48px;
  width: 274px;
  color: ${({ theme }) => theme.palette.whiteTranslucent};
  font-size: 13px;
  line-height: 24px;
  margin-top: 10px;
`;

const DocsLinksWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #3F454D;
  position: relative;
  height: 288px;
  width: 320px;
  margin-top: 30px;
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

const StyledIcon = styled.img`
  width: 16px;
  height: 16px;
  margin-right: 10px;
  fill: ${({ theme }) => theme.palette.primary};
`;

const Title = styled.div`
  height: 30px;
  width: 119px;
  color: ${({ theme }) => theme.palette.white};
  font-size: 22px;
  font-weight: bold;
  line-height: 30px;
`;

export { Description, DocsLinksWrapper, List, ListItem, StyledIcon, Title };
