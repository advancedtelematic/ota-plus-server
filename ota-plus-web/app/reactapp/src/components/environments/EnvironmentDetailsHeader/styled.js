import styled from 'styled-components';

export const ButtonsWrapper = styled.div`
  display: flex;
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
  & > h1 {
    font-size: 22px;
    line-height: 30px;
    margin: 0;
  }
`;

export const TextsWrapper = styled.div`
  line-height: 22px;
  font-size: 13px;
  font-weight: 400;
  color: ${({ theme }) => theme.palette.texts.black};
  display: flex;
  align-items: center;
  & > div:first-of-type {
    width: 400px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const Prefix = styled.span`
  color: ${({ theme }) => theme.palette.secondaryTranslucent};
  margin-right: 5px;
  :not(:first-child ){
    margin-left: 30px;
  }
`;
