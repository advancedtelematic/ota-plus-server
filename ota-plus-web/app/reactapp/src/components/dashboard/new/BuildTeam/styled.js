import styled from 'styled-components';
import { Button, Container, Title } from '../../../../partials';

export const AddMembersButton = styled(Button)`
  display: flex;
  align-items: center;
  padding: 0;
  font-weight: 500;
  height: 30px;
  min-width: 100px;
  span {
    font-size: 1em;
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

export const BuildTeamWrapper = styled(Container)`
  width: 320px;
  padding: 30px 20px 20px;
`;

export const Description = styled.div`
  color: ${({ theme }) => theme.palette.whiteTranslucent};
  font-size: 1em;
  line-height: 24px;
  margin-bottom: 20px;
`;

export const StyledIcon = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 10px;
`;

export const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  ${Title} {
    color: ${({ theme }) => theme.palette.white};
    font-size: 1.7em;
    line-height: 30px;
    margin-bottom: 0;
  }
`;
