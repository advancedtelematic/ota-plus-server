import styled from 'styled-components';
import { Button } from '../../../partials';

export const Pill = styled.div`
  display: inline-block;
  height: 24px;
  line-height: 24px;
  padding: 0 12px;
  margin-right: 10px;
  border-radius: 16px;
  color: rgba(0,10,25,0.8);
  font-weight: 400;
  background-color: rgba(0,55,141,0.05);
  i {
    margin-left: 8px;
    cursor: pointer;
  }
`;

export const BackgroundMask = styled.div`
  position: absolute;
  z-index: 3001;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${({ theme }) => theme.palette.texts.darkGrey};
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ButtonsWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;

export const UploadButton = styled(Button)`
  min-width: 148px;
  height: 40px;
  font-size: 16px;
  margin-right: 16px;
  img {
    margin-left: 7px;
  }
`;

export const UploadFileSection = styled.div`
  margin-top: 23px;
  margin-bottom: 40px;
  & > span {
    color: rgba(0,10,25,0.8);
    font-weight: 400;
  }
  & > ${Pill} {
    margin-right: 8px;
    display: inline-flex;
    align-items: center;
    max-width: 250px;
    div {
      display: inline-block;
      max-width: 232px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  & > input {
    height: 0;
    width: 0;
  }
`;

export const UploadIputFileSection = styled.div`
  display: ${({ displayed }) => displayed ? 'block' : 'none'};
  margin-top: 23px;
  margin-bottom: 40px;
  & > span {
    color: rgba(0,10,25,0.8);
    font-weight: 400;
  }
  & > input {
    height: 0;
    width: 0;
  }
`;

export const StyledButton = styled(Button)`
  min-width: 160px;
  width: 160px;
  height: 40px;
  font-size: 16px;
  margin-left: 20px;
`;

export const Title = styled.p`
  color: ${({ theme }) => theme.palette.texts.black};
  font-size: 22px;
  font-weight: bold;
  letter-spacing: 0;
  line-height: 30px;
  margin: 0 0 10px 0;
`;

export const CloseIcon = styled.img`
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
`;

export const Description = styled.p`
  color: ${({ theme }) => theme.palette.secondaryTranslucent};
  font-size: 13px;
  font-style: italic;
  letter-spacing: 0;
  line-height: 20px;
  margin: 0 0 20px 0;
`;

export const ModalContainer = styled.div`
  position: absolute;
  z-index: 9999;
  top: 60px;
  left: calc(50% - 421px);
  width: 843px;
  border-radius: 3px;
  padding: 40px 30px 30px 40px;
  background-color: ${({ theme }) => theme.palette.white};
  overflow: hidden;
`;

export const InfoStatusBarContainer = styled.div`
  margin: 0 0 20px 0;
`;
