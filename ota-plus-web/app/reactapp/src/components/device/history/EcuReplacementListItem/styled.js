import styled from 'styled-components';

export const EcuReplacementContainer = styled.div`
  margin: 15px;
  border: 1px solid ${({ theme }) => theme.palette.borderLight};
  border-radius: 2px;
  background-color: ${({ theme }) => theme.palette.backgroundLight};
`;

export const BodyContainer = styled.div`
  padding: 30px;
  border-radius: 2px;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.palette.borderLight};
  height: 40px;
  padding: 0 30px;
  & > img {
    width: 16px;
    height: 16px;
    margin-right: 12px;
  }
  & > span {
    color: ${({ theme }) => theme.palette.texts.darkGrey};
    font-size: 13px;
    font-weight: 500;
    line-height: 15px;
  }
`;

export const StatusBar = styled.div`
  height: 40px;
  background-color: ${({ theme }) => theme.palette.green};
  font-size: 16px;
  color: ${({ theme }) => theme.palette.white};
  display: flex;
  align-items: center;
  padding: 0 20px;
  & > a {
    margin-left: 4px;
    color: ${({ theme }) => theme.palette.white} !important;
    line-height: 17px;
    border-bottom: 2px solid ${({ theme }) => theme.palette.white};
    :hover {
      border-bottom-color: transparent;
    }
  }
`;

export const ContentBox = styled.div`
  border: 1px solid ${({ theme }) => theme.palette.borderLight};
  background-color: ${({ theme }) => theme.palette.white};
  padding: 20px;
  font-size: 13px;
`;

export const TopRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 22px;
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 11px;
  #copyable-value-container {
    width: 50%;
    span {
      color: ${({ theme }) => theme.palette.texts.black};
      font-size: 13px;
    }
    #copyable-value-title {
      font-weight: 700;
    }
    #copyable-value-icon {
      margin: 0 0 4px 2px;
    }
  }
`;

export const ReplacedTag = styled.div`
  padding: 2px 0;
  width: 74px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.palette.green};
  text-align: center;
  color: ${({ theme }) => theme.palette.white};
  font-size: 11px;
  font-weight: 500;
  line-height: 12px;
  margin-right: 8px;
`;

export const InfoBlock = styled.div`
  flex: 1;
  display: flex;
  color: ${({ theme }) => theme.palette.texts.black};
  & > div:first-child {
    font-weight: 700;
    margin-right: 4px;
  }
`;

export const HalfBlock = styled.div`
  width: 50%;
`;
