import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useHistory, Link } from 'react-router-dom';
import { Tooltip } from 'antd';
import { Title } from '../../../../../partials';
import {
  ActionButton,
  Card,
  PrimaryText,
  SecondaryText,
  SecondaryTextNormal,
  TitleIcon,
  TitleWrapper,
  UnderlinedLink
} from './styled';
import { STEP_STATUS } from '../../../../../constants';
import { WARNING_ICON } from '../../../../../config';
import { sendAction } from '../../../../../helpers/analyticsHelper';

export const DEVICE_GROUP_CARD_ID = 'deviceGroup-card';

const renderStats = (id, statValue, description) => (
  <>
    <PrimaryText id={`${id}-stat-value`}>
      {statValue.toLocaleString()}
    </PrimaryText>
    {description && (
      <SecondaryText id={`${id}-desc-done`}>
        {description}
        {id !== DEVICE_GROUP_CARD_ID && <img src={WARNING_ICON} />}
      </SecondaryText>
    )}
  </>
);

const DashboardStepperCard = ({ id, buttonTitle, description, iconPath, statValue, status, title, links }) => {
  const { t } = useTranslation();
  const history = useHistory();

  const handleCTABtnClick = () => {
    const { ctaButton, ctaButtonActionType } = links;
    sendAction(ctaButtonActionType);
    history.push({
      pathname: ctaButton,
      state: { openWizard: true }
    });
  };

  const handleReadMoreClick = () => {
    const { docsActionType } = links;
    sendAction(docsActionType);
  };

  const renderActionButton = () => (
    <ActionButton
      block
      id={`${id}-action-btn`}
      type={status === STEP_STATUS.ACTIVE ? 'primary' : 'default'}
      disabled={status === STEP_STATUS.INACTIVE}
      onClick={handleCTABtnClick}
    >
      {buttonTitle}
    </ActionButton>
  );

  return (
    <Card status={status} id={id} elevation={0}>
      <div>
        <Link
          onClick={() => { sendAction(links.ctaLinkActionType); }}
          to={links.ctaLink}
        >
          <TitleWrapper>
            <TitleIcon src={iconPath} />
            <Title size="small" id={`${id}-title`}>{title}</Title>
          </TitleWrapper>
        </Link>
        {status === STEP_STATUS.DONE && statValue
          ? renderStats(id, statValue, description)
          : (
            <SecondaryTextNormal id={`${id}-desc`} isLight={status === STEP_STATUS.ACTIVE}>
              {description}
              {' '}
              <UnderlinedLink url={links.docs} onClick={handleReadMoreClick}>
                {t('dashboard.stepper.read-more')}
              </UnderlinedLink>
            </SecondaryTextNormal>
          )
      }
      </div>
      <div>
        {links.tooltip && status === STEP_STATUS.INACTIVE
          ? (
            <Tooltip title={links.tooltip} overlayClassName="stepper-btn-tooltip">
              {renderActionButton()}
            </Tooltip>
          )
          : renderActionButton()}
      </div>
    </Card>
  );
};

DashboardStepperCard.propTypes = {
  buttonTitle: PropTypes.string.isRequired,
  description: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]),
  iconPath: PropTypes.string,
  id: PropTypes.string.isRequired,
  statValue: PropTypes.number,
  status: PropTypes.oneOf([STEP_STATUS.ACTIVE, STEP_STATUS.DONE, STEP_STATUS.INACTIVE]),
  title: PropTypes.string.isRequired,
  links: PropTypes.shape({
    ctaButton: PropTypes.string,
    ctaButtonActionType: PropTypes.string,
    ctaLink: PropTypes.string,
    ctaLinkActionType: PropTypes.string,
    docs: PropTypes.string,
    tooltip: PropTypes.string
  }),
};

export default DashboardStepperCard;
