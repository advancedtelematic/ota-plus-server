import styled from 'styled-components';
import { Icon, Button } from '../../common';

const AddMembersButton = styled(Button)`
  margin-bottom: 10px;
  padding: 0;
  font-weight: 500;
  min-width: 110px;
  span {
    margin-left: 4px;
    font-size: 1.15em;
    letter-spacing: 0.01px;
    line-height: 18px;
  }
`;

const Description = styled.div`
  color: ${({ theme }) => theme.palette.texts.black};
  font-size: 0.93em;
  line-height: 24px;
  margin-bottom: 14px;
`;

const StyledIcon = styled(Icon)`
  width: 24px;
  height: 24px;
  margin: 0 12px 20px 0;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export { AddMembersButton, Description, StyledIcon, TitleWrapper };
