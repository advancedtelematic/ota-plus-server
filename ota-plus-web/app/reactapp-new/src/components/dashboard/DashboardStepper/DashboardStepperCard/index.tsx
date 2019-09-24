import React, { useEffect, useState, ReactElement } from 'react';
import { Title } from '../../../common';
import {
  ActionButton,
  Card,
  LoadingIcon,
  PrimaryText,
  SecondaryText,
  SecondaryTextNormal,
  SecondaryTextError,
  TitleIcon,
  TitleWrapper
} from './styled';
import { COLORS } from '../../../../constants/styleConstants';

export type CardType = 'devices' | 'softwareVersion' | 'deviceGroup' | 'softwareUpdates' | 'campaigns';

export type StepStatus = 'done' | 'active' | 'inactive';

export type Props = {
  buttonTitle: string,
  description?: string,
  descriptionDone?: string,
  id: string,
  statValue?: number,
  status: StepStatus,
  title: string,
  type: CardType
};

const renderStats = (id: string, statValue: number, type: CardType, description?: string): ReactElement => (
  <>
    <PrimaryText id={`${id}-stat-value`}>{statValue.toLocaleString()}</PrimaryText>
    {type !== 'campaigns' && description
      ? <SecondaryTextNormal isLight id={`${id}-desc-done`}>{description}</SecondaryTextNormal>
      : (
        <SecondaryTextError
          id={`${id}-error`}
          style={{
            // If there are no campaign errors, highlight the text in green
            color: description && Number(description.split(' ').slice(0, 1).join(' ')) === 0
              ? COLORS.GREEN
              : COLORS.ERROR
          }}
        >
          {description}
        </SecondaryTextError>
      )}
  </>
);

export const DashboardStepperCard = ({ id, buttonTitle, description, statValue, status, title, type }: Props) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(
    () => {
      if (statValue !== undefined) {
        setIsLoading(false);
      }
    },
    [statValue]);

  return (
    <Card status={status} id={id}>
      <TitleWrapper>
        <TitleIcon type={type} />
        <Title size="small" id={`${id}-title`}>{title}</Title>
      </TitleWrapper>
      {isLoading
        ? <LoadingIcon type="loading" spin />
        : status === 'done' && statValue
          ? renderStats(id, statValue, type, description)
          : <SecondaryText id={`${id}-desc`}>{description}</SecondaryText>}
      <ActionButton
        id={`${id}-action-btn`}
        type={status === 'active' ? 'primary' : 'default'}
      >
        {buttonTitle}
      </ActionButton>
    </Card>
  );
};

export default DashboardStepperCard;
