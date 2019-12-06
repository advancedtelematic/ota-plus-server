import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Button, ExternalLink, Title } from '../../../../../partials';
import { STEP_STATUS } from '../../../../../constants';

const ActionButton = styled(Button)`
  width: 98%;
  margin: 0 auto 20px;
  padding: 0 6px;
  cursor: pointer !important;
`;

const PrimaryText = styled.div`
  font-size: 2.77em;
  font-weight: 400;
  line-height: 44px;
  :hover {
    color: ${({ theme }) => theme.palette.white};
  }
`;

const SecondaryText = styled.div`
  font-size: 1em;
  line-height: 15px;
  height: 18px;
  color: #A0A4A8;
`;

const SecondaryTextNormal = styled(SecondaryText)`
line-height: 18px;
  &&, *, *:hover {
    color: ${({ isLight, theme }) => `${isLight ? theme.palette.white : '#6F737A'} !important`};
  };
`;

SecondaryTextNormal.propTypes = {
  isLight: PropTypes.bool,
};

const TitleIcon = styled.img`
  height: 24px;
  width: 24px;
  margin-right: 10px;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 18px;
  cursor: pointer;
  ${Title} {
    font-weight: 400;
    font-size: 1.232em;
    :hover {
      text-decoration: underline;
    }
  }
`;

const UnderlinedLink = styled(ExternalLink)`
  text-decoration: underline;
  && {
    font-weight: 300;
    font-size: 1em;
  }
  :hover {
    text-decoration: none;
  }
`;

const Card = styled.div(({ status, theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '210px',
  minWidth: '180px',
  width: '100%',
  maxWidth: '280px',
  position: 'relative',
  margin: '0 30px',
  color: '#A0A4A8',
  img: {
    opacity: status === STEP_STATUS.INACTIVE
      ? 0.3
      : status === STEP_STATUS.DONE
        ? 0.6
        : 1
  },
  [Title]: {
    color: status === STEP_STATUS.INACTIVE
      ? theme.palette.lightGrey
      : status === STEP_STATUS.DONE
        ? '#A0A4A8'
        : theme.palette.white,
    marginBottom: 0
  },
  [SecondaryText]: {
    img: {
      marginLeft: '6px',
      paddingBottom: '1px'
    }
  }
}));

Card.propTypes = {
  status: PropTypes.oneOf([STEP_STATUS.DONE, STEP_STATUS.ACTIVE, STEP_STATUS.INACTIVE]),
  theme: PropTypes.shape({})
};

export {
  ActionButton,
  Card,
  PrimaryText,
  SecondaryText,
  SecondaryTextNormal,
  TitleIcon,
  TitleWrapper,
  UnderlinedLink
};
