import styled, { css } from 'styled-components';
import { List } from 'antd';
import { Button } from '../../../partials';

export const ListStyled = styled(List)`
  border: 1px solid ${({ theme }) => theme.palette.borderLight};
  border-left: none;
  border-top: none;
  height: 100%;
  overflow-y: auto;
  .ant-list-header {
    padding: 0;
    border-bottom: none;
  }
`;

export const ListItem = styled(List.Item)`
  cursor: pointer;
  height: 74px;
  display: block;
  font-size: 13px;
  color: ${({ theme }) => theme.palette.texts.black};
  padding: 15px 20px;
  position: relative;
  ${({ active }) => active && css`
    ::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 6px;
      height: 100%;
      background-color: ${({ theme }) => theme.palette.primary};
    }
  `}
  :hover {
    background-color: ${({ theme }) => theme.palette.backgroundLight};
  }
  & > div:first-child {
    font-weight: 500;
    height: 20px;
    margin-bottom: 8px;
    white-space: nowrap;
    overflow: hidden;
    margin-right: 12px;
  }
  & > div:last-child {
    line-height: 15px;
  }
  & > img {
    cursor: pointer;
    position: absolute;
    right: 12px;
    top: 12px;
    height: 24px;
    width: 24px;
    opacity: 0;
  }
  ul {
    width: auto;
    li {
      justify-content: center;
      height: 40px;
      padding: 0 16px;
      & > img {
        height: 22px;
        width: 22px;
        margin-right: 8px;
      }
      & > span {
        color: ${({ theme }) => theme.palette.error};
        font-weight: 400;
      }
    }
  }
  :hover {
    & > img {
      opacity: 0.6;
    }
  }
`;

export const LowImportanceText = styled.span`
  color: ${({ theme }) => theme.palette.secondaryTranslucent};
`;

export const ListHeader = styled(ListItem)`
  height: 94px;
  padding: 0 20px 20px 20px;
  color: ${({ theme }) => theme.palette.texts.black};
  cursor: default;
  border-bottom: 1px solid ${({ theme }) => theme.palette.borderLight} !important;
  &, :hover {
    background-color: ${({ theme }) => theme.palette.white};
  }
  & > h2 {
    font-size: 22px;
    line-height: 30px;
    margin-bottom: 10px;
  }
  .search-box {
    .input-wrapper.search {
      width: 100% !important;
      border-radius: 2px;
      overflow: hidden;
      border: 1px solid rgba(35,52,89,0.35) !important;
      input {
        color: ${({ theme }) => theme.palette.texts.black} !important;
        font-size: 13px !important;
        padding: 0 38px !important;
        background-color: ${({ theme }) => theme.palette.white} !important;
        &::placeholder {
          font-style: italic;
          font-weight: 300;
        }
      } 
    }
    .ant-input-prefix {
      & > i {
        color: ${({ theme }) => theme.palette.texts.darkGrey};
        font-size: 16px;
      }
    }
    .ant-input-suffix {
      display: none;
    }
  }
`;

export const OwnerTag = styled.div`
  display: inline-block;
  height: 12px;
  line-height: 13px;
  padding: 0 8px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.palette.primaryDarkened};
  color: ${({ theme }) => theme.palette.white};
  cursor: default;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0;
  margin-left: 6px;
  text-transform: uppercase;
`;

export const FullRestrictionTag = styled(OwnerTag)`
  background-color: ${({ theme }) => theme.palette.white};
  color: ${({ theme }) => theme.palette.lightGrey};
  border: 1px solid ${({ theme }) => theme.palette.lightGrey};
  line-height: 12px;
`;

export const AccessManagerTag = styled(OwnerTag)`
  background-color: #EC610E;
`;

export const RemoveButton = styled(Button)`
  display: flex;
  align-items: center;
  border: none;
  position: absolute;
  right: 30px;
  padding: 0;
  min-width: 100px;
  font-size: 1.08em;
  &, :hover, :focus {
    color: #CF001A;
  }
  :hover {
    opacity: 0.7;
  }
  & > img {
    height: 14px;
    width: 14px;
    margin: 0 4px 2px 0;
  }
`;
