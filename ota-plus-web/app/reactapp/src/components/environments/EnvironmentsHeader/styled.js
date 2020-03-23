import styled from 'styled-components';

export const EnvIcon = styled.img`
  margin: 4px;
`;

export const HelpIcon = styled.img`
  width: 16px;
  height: 16px;
  opacity: 0.4;
  margin-left: 7px;
`;

export const LinkPrimary = styled.span`
  color: ${({ theme }) => theme.palette.primaryDarkened};
  text-decoration: underline !important;
  cursor: pointer;
  :hover {
    color: ${({ theme }) => theme.palette.primaryTranslucent};
  };
  :focus, :active {
    color: ${({ theme }) => theme.palette.primaryDarkened2};
  };
`;

export const Subtitle = styled.span`
  line-height: 15px;
  letter-spacing: 0.1px;
  font-weight: 400;
  color: ${({ theme }) => theme.palette.texts.darkGrey};
`;

export const TextsWrapper = styled.div`
  margin-left: 20px;
  display: flex;
  flex-direction: column;
`;
