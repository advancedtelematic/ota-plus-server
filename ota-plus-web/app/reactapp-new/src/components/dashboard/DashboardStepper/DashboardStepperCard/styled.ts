import styled from 'styled-components';
import { Icon as AntdIcon } from 'antd';
import { Button, Container, Title, Icon } from '../../../common';
import { StyledTheme } from '../../../../theme';
import { StepStatus } from './index';

type CardProps = {
  status: StepStatus
};

type SecondaryTextProps = {
  isLight?: boolean
};

const ActionButton = styled(Button)`
  position: absolute;
  bottom: 20px;
`;

const Card = styled(Container)<CardProps>(({ status, theme }) => ({
  height: '227px',
  width: '228px',
  position: 'relative',
  border: status === 'active' ? `1px solid ${theme.palette.primary}` : 'none',
  img: {
    opacity: status === 'inactive' ? 0.3 : 1
  },
  [`${Title}, ${SecondaryText}`]: {
    color: status === 'inactive' ? theme.palette.texts.lightGrey : theme.palette.texts.black,
  }
}));

const LoadingIcon = styled(AntdIcon)`
  font-size: 40px;
  position: absolute;
  top: calc(50% - 20px);
  left: calc(50% - 20px);
`;

const PrimaryText = styled.div`
  font-size: 2.58em;
  font-weight: 300;
  line-height: 44px;
  margin-bottom: 5px;
`;

const SecondaryText = styled.div`
  font-size: 0.93em;
  line-height: 18px;
`;

const SecondaryTextNormal = styled(SecondaryText)<SecondaryTextProps>(
  ({ isLight, theme }: SecondaryTextProps & StyledTheme) => ({
    '&&': {
      color: isLight ? theme.palette.texts.darkGrey : theme.palette.texts.black
    }
  })
);

const SecondaryTextError = styled(SecondaryText)`
  && {
    color: ${({ theme }) => theme.palette.error};
  }
`;

const TitleIcon = styled(Icon)`
  height: 24px;
  width: 24px;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 19px;
  img {
    margin-right: 5px;
  }
`;

export {
  ActionButton,
  Card,
  LoadingIcon,
  PrimaryText,
  SecondaryText,
  SecondaryTextNormal,
  SecondaryTextError,
  TitleIcon,
  TitleWrapper
};
