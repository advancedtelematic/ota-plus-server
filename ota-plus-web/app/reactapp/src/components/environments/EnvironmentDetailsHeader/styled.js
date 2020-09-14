import styled from 'styled-components';

export const ButtonsWrapper = styled.div`
  display: flex;
  margin-top: 30px;
  & > button {
    min-width: 160px;
    width: auto;
    :not(:last-child) {
      margin-right: 20px;
      min-width: 125px;
      background-color: transparent;
    }
  }
`;

export const MainContent = styled.div`
  padding: 30px 0;
`;

export const TextsWrapper = styled.div`
  margin-top: 10px;
  line-height: 15px;
  font-size: 13px;
  font-weight: 400;
  color: ${({ theme }) => theme.palette.texts.black};
  display: flex;
  align-items: center;
  & > div {
    margin-right: 30px;
  }
  #copyable-value-container { 
    display: block;
    width: auto;
    #copyable-value-value {
      margin-left: 0;
      font-size: 13px;
      font-weight: 400;
      color: ${({ theme }) => theme.palette.texts.black};
      max-width: 116px;
      width: auto;
    }
  }
`;

export const Prefix = styled.span`
  color: ${({ theme }) => theme.palette.secondaryTranslucent};
  margin-bottom: 3px;
`;
