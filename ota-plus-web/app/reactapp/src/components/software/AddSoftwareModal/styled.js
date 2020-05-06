import styled, { css } from 'styled-components';
import { Input as AntdInput, Select } from 'antd';
import { Button } from '../../../partials';

const placeholderStyles = css`
  color: rgba(30,43,70,0.6) !important;
  font-style: italic;
  font-weight: 300; 
`;

const baseInputStyles = css`
  box-sizing: border-box;
  height: 40px;
  width: 400px !important;
  border: 1px solid rgba(35,52,89,0.35);
  border-radius: 2px;
  font-size: 16px;
`;

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

export const PillsContainer = styled.div`
  margin-bottom: 7px;
`;

export const EcuSelect = styled(Select)`
  margin-bottom: 20px;
  .ant-select-selection {
    ${baseInputStyles}
    &__rendered {
      height: 40px;
      margin-left: 8px;
      margin-right: 10px;
    }
    &__placeholder {
      ${placeholderStyles}
    }
    &-selected-value {
      line-height: 38px;
      font-weight: 400;
    }
  }
  .ant-select-arrow {
    margin-top: -10px;
    color: rgba(0,10,25,0.8);
    font-size: 16px;
    font-weight: 400;
    &-icon {
      display: flex;
      align-items: center;
    }
    i {
      font-size: 20px;
      margin-left: 6px;
    }
  }
`;

export const Input = styled(AntdInput)`
  margin-bottom: 30px;
  padding: 10px 8px !important;
  ${baseInputStyles}
  &::placeholder {
    ${placeholderStyles}
  }
`;

export const InputLabel = styled.span`
  display: block;
  color: rgba(30,43,70,0.6);
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0;
  line-height: 15px;
  margin-bottom: 8px;
`;

export const TextLabelInput = styled.span`
  display: block;
  color: ${({ theme }) => theme.palette.texts.black};
  height: 20px;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 20px;
  margin-bottom: 24px;
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

export const FileInfoSection = styled.div`
    margin-top: 24px;
`;

export const UploadFileSection = styled.div`
  display: ${({ displayed }) => displayed ? 'block' : 'none'};
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

export const Info = styled.span`
  color: ${({ error, theme }) => !error ? 'rgba(0,10,25,0.8)' : theme.palette.error} !important;
  img {
    margin: 0 5px 0 8px;
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
  display: ${({ displayed }) => displayed ? 'block' : 'none'};
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

export const ProgressBar = styled.div`
  height: 39px;
  width: ${({ widthPercentage }) => `${widthPercentage}%`};;
  background-color: ${({ theme }) => theme.palette.progressFill};
`;

export const ProgressBarContainer = styled.div`
  height: 40px;
  width: 593px;
  border: 1px solid ${({ theme }) => theme.palette.primaryDarkenedAlpha_03};
  display: flex;
`;

export const ProgressBarTextContainer = styled.div`
  height: 40px;
  width: 593px;
  position: absolute;
  text-align: center;
`;

export const ProgressBarText = styled.p`
  color: ${({ theme }) => theme.palette.primaryDarkened};
  font-size: 16px;
  letter-spacing: 0;
  line-height: 20px;
  margin-top: 10px;
  font-weight: 400;
`;
